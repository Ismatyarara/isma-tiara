// POST /api/login
// Body: { email, password }
// Cek ke Environment Variables Vercel (ADMIN_EMAIL, ADMIN_PASSWORD, SESSION_SECRET),
// bukan ke kode yang bisa dibaca siapa saja lewat "View Source".
const crypto = require('crypto');

async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method tidak diizinkan.' });
    }

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    const ADMIN_API_SECRET = process.env.ADMIN_API_SECRET;

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !ADMIN_API_SECRET) {
        return res.status(500).json({
            error: 'Server belum dikonfigurasi. Tambahkan ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_API_SECRET di Vercel > Settings > Environment Variables.',
        });
    }

    const { email, password } = req.body || {};
    const validEmail = String(email || '').trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
    const validPassword = String(password || '') === ADMIN_PASSWORD;

    if (!validEmail || !validPassword) {
        return res.status(401).json({ error: 'Email atau password tidak sesuai. Akses ditolak.' });
    }

    const expires = Date.now() + 1000 * 60 * 60 * 12; // token berlaku 12 jam
    const payload = String(expires);
    const signature = crypto.createHmac('sha256', ADMIN_API_SECRET).update(payload).digest('hex');
    const token = Buffer.from(`${payload}.${signature}`).toString('base64url');

    return res.status(200).json({ token, expires });
}

module.exports = handler;