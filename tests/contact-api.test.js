const test = require('node:test');
const assert = require('node:assert/strict');
const Module = require('node:module');

const originalLoad = Module._load;
let inboxBlob = null;
Module._load = function (request, parent, isMain) {
  if (request === '@vercel/blob') return {
    list: async () => ({ blobs: inboxBlob ? [{ url: 'https://blob.test/inbox' }] : [] }),
    put: async (_path, content) => { inboxBlob = String(content); return { url: 'https://blob.test/inbox' }; },
  };
  if (request === './_auth' && parent?.filename.endsWith(`${require('node:path').sep}api${require('node:path').sep}contact.js`)) return { verifyToken: req => req.headers.authorization === 'Bearer test-admin-token' };
  return originalLoad.call(this, request, parent, isMain);
};

process.env.BLOB_READ_WRITE_TOKEN = 'test-blob-token';
process.env.ADMIN_API_SECRET = 'test-admin-secret-that-is-at-least-32-characters-long';
delete process.env.CONTACT_INBOX_SECRET;
delete process.env.RESEND_API_KEY;
delete process.env.CONTACT_FROM_EMAIL;
delete process.env.CONTACT_TO_EMAIL;

const handler = require('../api/contact.js');
const realFetch = global.fetch;
global.fetch = async () => new Response(inboxBlob, { status: 200, headers: { 'Content-Type': 'application/json' } });

function makeResponse() {
  return {
    code: 200,
    headers: {},
    body: null,
    status(code) { this.code = code; return this; },
    json(body) { this.body = body; return this; },
    setHeader(name, value) { this.headers[name] = value; },
  };
}

test('stores contact messages encrypted and supports authenticated unread/read inbox', async () => {
  inboxBlob = null;
  const secretMessage = 'A private collaboration message for backend test.';
  const postResponse = makeResponse();
  await handler({ method: 'POST', headers: { 'x-real-ip': '127.0.0.21' }, socket: {}, body: {
    name: 'Test Visitor', email: 'visitor@example.com', subject: 'Collaboration inquiry', category: 'Website Development',
    message: secretMessage, startedAt: Date.now() - 5000, website: '',
  } }, postResponse);
  assert.equal(postResponse.code, 200);
  assert.equal(postResponse.body.ok, true);
  assert.equal(postResponse.body.emailStatus, 'inbox-only');
  assert.ok(inboxBlob);
  assert.equal(inboxBlob.includes(secretMessage), false);

  const getResponse = makeResponse();
  await handler({ method: 'GET', headers: { authorization: 'Bearer test-admin-token' } }, getResponse);
  assert.equal(getResponse.code, 200);
  assert.equal(getResponse.headers['Cache-Control'], 'no-store, private');
  assert.equal(getResponse.body.messages[0].message, secretMessage);
  assert.equal(getResponse.body.messages[0].status, 'unread');

  const patchResponse = makeResponse();
  await handler({ method: 'PATCH', headers: { authorization: 'Bearer test-admin-token' }, body: { id: getResponse.body.messages[0].id, status: 'read' } }, patchResponse);
  assert.equal(patchResponse.code, 200);
  const readResponse = makeResponse();
  await handler({ method: 'GET', headers: { authorization: 'Bearer test-admin-token' } }, readResponse);
  assert.equal(readResponse.body.messages[0].status, 'read');

  const unauthorizedResponse = makeResponse();
  await handler({ method: 'GET', headers: {} }, unauthorizedResponse);
  assert.equal(unauthorizedResponse.code, 401);
});

test('rejects a honeypot submission without writing it to the inbox', async () => {
  inboxBlob = null;
  const response = makeResponse();
  await handler({ method: 'POST', headers: {}, body: { website: 'spam', message: 'spam' } }, response);
  assert.equal(response.code, 400);
  assert.equal(inboxBlob, null);
});

test.after(() => {
  global.fetch = realFetch;
  Module._load = originalLoad;
});
