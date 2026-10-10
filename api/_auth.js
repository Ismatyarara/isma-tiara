const crypto = require('crypto');

function verifyToken(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const secret = process.env.ADMIN_API_SECRET;
  if (!token || !secret) return false;
  try {
    const [payloadEncoded, signature] = token.split('.');
    if (!payloadEncoded || !signature) return false;
    const expected = crypto.createHmac('sha256', secret).update(payloadEncoded).digest('base64url');
    const a = Buffer.from(signature); const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
    const payload = JSON.parse(Buffer.from(payloadEncoded, 'base64url').toString('utf8'));
    return Number.isFinite(payload.exp) && payload.exp > Date.now() && typeof payload.jti === 'string';
  } catch { return false; }
}
module.exports = { verifyToken };
