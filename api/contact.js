const crypto = require('crypto');
const { put, list } = require('@vercel/blob');
const { verifyToken } = require('./_auth');

const INBOX_PATH = 'data/collaboration-inbox.enc.json';
const BLOB_TOKEN = process.env.PORTFOLIO_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;
const recentSenders = new Map();

function inboxKey() {
  const secret = process.env.CONTACT_INBOX_SECRET || process.env.ADMIN_API_SECRET;
  if (!secret || secret.length < 32) throw new Error('Set CONTACT_INBOX_SECRET or ADMIN_API_SECRET with at least 32 characters.');
  return crypto.createHash('sha256').update(secret).digest();
}
function encryptMessages(messages) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', inboxKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(messages), 'utf8'), cipher.final()]);
  return JSON.stringify({ version: 1, iv: iv.toString('base64'), tag: cipher.getAuthTag().toString('base64'), ciphertext: ciphertext.toString('base64') });
}
function decryptMessages(payload) {
  const decipher = crypto.createDecipheriv('aes-256-gcm', inboxKey(), Buffer.from(payload.iv, 'base64'));
  decipher.setAuthTag(Buffer.from(payload.tag, 'base64'));
  return JSON.parse(Buffer.concat([decipher.update(Buffer.from(payload.ciphertext, 'base64')), decipher.final()]).toString('utf8'));
}
async function readMessages() {
  inboxKey();
  const { blobs } = await list({ prefix: INBOX_PATH, limit: 1, token: BLOB_TOKEN });
  if (!blobs.length) return [];
  const response = await fetch(blobs[0].url, { cache: 'no-store' });
  if (!response.ok) throw new Error('Inbox could not be read.');
  return decryptMessages(await response.json());
}
async function writeMessages(messages) {
  await put(INBOX_PATH, encryptMessages(messages), { access: 'public', contentType: 'application/json', addRandomSuffix: false, allowOverwrite: true, token: BLOB_TOKEN });
}
function sendJson(res, status, body) { return res.status(status).json(body); }
function clean(value, max) { return String(value || '').trim().slice(0, max); }

module.exports = async function handler(req, res) {
  if (!BLOB_TOKEN) return sendJson(res, 503, { error: 'Penyimpanan pesan belum dikonfigurasi.' });
  if (req.method === 'POST') {
    const body = req.body || {};
    if (body.website) return sendJson(res, 400, { error: 'Periksa kembali formulir dan coba kirim lagi.' }); // Honeypot: reject bots without storing their content.
    const name = clean(body.name, 100);
    const email = clean(body.email, 254).toLowerCase();
    const subject = clean(body.subject, 160);
    const category = clean(body.category, 80);
    const message = clean(body.message, 5000);
    const categories = ['Job Opportunity', 'Website Development', 'UI/UX Design', 'Creative Project', 'Administrative Support', 'Other Collaboration'];
    const startedAt = Number(body.startedAt);
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !subject || !categories.includes(category) || message.length < 10 || !Number.isFinite(startedAt) || Date.now() - startedAt < 2500) return sendJson(res, 400, { error: 'Periksa kembali formulir dan coba kirim lagi.' });
    const senderKey = String(req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown').trim();
    const now = Date.now();
    if (now - (recentSenders.get(senderKey) || 0) < 45_000) return sendJson(res, 429, { error: 'Tunggu sebentar sebelum mengirim pesan berikutnya.' });
    recentSenders.set(senderKey, now);
    try {
      const messages = await readMessages();
      const item = { id: crypto.randomUUID(), name, email, subject, category, message, receivedAt: new Date().toISOString(), status: 'unread' };
      messages.unshift(item);
      await writeMessages(messages);
      let emailStatus = 'inbox-only';
      if (process.env.RESEND_API_KEY && process.env.CONTACT_FROM_EMAIL) {
        try {
          let to = process.env.CONTACT_TO_EMAIL || '';
          if (!to) {
            const { blobs } = await list({ prefix: 'data/portfolio.json', limit: 1, token: BLOB_TOKEN });
            if (blobs.length) {
              const portfolioResponse = await fetch(blobs[0].url, { cache: 'no-store' });
              const portfolio = portfolioResponse.ok ? await portfolioResponse.json() : null;
              to = portfolio?.collaboration?.[0]?.email || '';
            }
          }
          if (to) {
            const delivery = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: process.env.CONTACT_FROM_EMAIL, to: [to], reply_to: email, subject: `[Portfolio] ${subject}`, text: `Nama: ${name}\nEmail: ${email}\nKategori: ${category}\n\n${message}` }) });
            emailStatus = delivery.ok ? 'sent' : 'failed';
          }
        } catch { emailStatus = 'failed'; }
      }
      return sendJson(res, 200, { ok: true, emailStatus });
    } catch (error) {
      recentSenders.delete(senderKey);
      return sendJson(res, 503, { error: 'Pesan belum dapat disimpan. Coba lagi nanti.' });
    }
  }
  if (!verifyToken(req)) return sendJson(res, 401, { error: 'Unauthorized.' });
  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 'no-store, private');
    try { return sendJson(res, 200, { messages: await readMessages() }); }
    catch { return sendJson(res, 503, { error: 'Inbox belum tersedia. Pastikan CONTACT_INBOX_SECRET atau ADMIN_API_SECRET telah dikonfigurasi.' }); }
  }
  if (req.method === 'PATCH') {
    const { id, status } = req.body || {};
    if (typeof id !== 'string' || !['read', 'unread'].includes(status)) return sendJson(res, 400, { error: 'Perubahan status tidak valid.' });
    try {
      const messages = await readMessages();
      const item = messages.find(message => message.id === id);
      if (!item) return sendJson(res, 404, { error: 'Pesan tidak ditemukan.' });
      item.status = status;
      await writeMessages(messages);
      return sendJson(res, 200, { ok: true });
    } catch { return sendJson(res, 503, { error: 'Status pesan belum dapat diperbarui.' }); }
  }
  res.setHeader('Allow', 'GET, POST, PATCH');
  return sendJson(res, 405, { error: 'Method tidak diizinkan.' });
};
module.exports.config = { api: { bodyParser: { sizeLimit: '64kb' } } };
