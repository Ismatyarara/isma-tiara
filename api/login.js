const crypto = require('crypto');
const attempts = new Map();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;

function getClientIp(req) { return String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim(); }
function passwordMatches(password, encoded) {
  const [algorithm, iterations, salt, expected] = String(encoded || '').split('$');
  if (algorithm !== 'pbkdf2-sha512' || !iterations || !salt || !expected) return false;
  const actual = crypto.pbkdf2Sync(String(password), Buffer.from(salt, 'base64url'), Number(iterations), 64, 'sha512');
  const target = Buffer.from(expected, 'base64url');
  return actual.length === target.length && crypto.timingSafeEqual(actual, target);
}
function signSession(secret) {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + 12 * 60 * 60 * 1000, jti: crypto.randomBytes(16).toString('hex') })).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return { token: `${payload}.${signature}`, expires: JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')).exp };
}
async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Method tidak diizinkan.' }); }
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  const ip = getClientIp(req); const now = Date.now(); const record = attempts.get(ip);
  if (record && record.blockedUntil > now) return res.status(429).json({ error: 'Terlalu banyak percobaan login. Coba lagi beberapa menit lagi.' });
  if (record && record.windowStart + WINDOW_MS <= now) attempts.delete(ip);
  const adminEmail = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH; const secret = process.env.ADMIN_API_SECRET;
  if (!adminEmail || !passwordHash || !secret) return res.status(500).json({ error: 'Server belum dikonfigurasi. Tambahkan ADMIN_EMAIL, ADMIN_PASSWORD_HASH, dan ADMIN_API_SECRET di Vercel.' });
  if (email !== adminEmail || !passwordMatches(password, passwordHash)) {
    const fresh = attempts.get(ip);
    const count = (fresh?.count || 0) + 1;
    attempts.set(ip, { count, windowStart: fresh?.windowStart || now, blockedUntil: count >= MAX_ATTEMPTS ? now + WINDOW_MS : 0 });
    return res.status(401).json({ error: 'Email atau password tidak sesuai.' });
  }
  attempts.delete(ip);
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json(signSession(secret));
}
module.exports = handler;
