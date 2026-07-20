// Verifikasi token sesi admin.
// Token dibuat oleh /api/login.js: base64url("expires.signature")
// signature = HMAC-SHA256(expires, SESSION_SECRET)
const crypto = require('crypto');

function verifyToken(req) {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return false;

    const secret = process.env.ADMIN_API_SECRET;
    if (!secret) return false;

    try {
        const decoded = Buffer.from(token, 'base64url').toString('utf8');
        const separatorIndex = decoded.lastIndexOf('.');
        if (separatorIndex === -1) return false;

        const payload = decoded.slice(0, separatorIndex);
        const signature = decoded.slice(separatorIndex + 1);

        const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');

        const sigBuffer = Buffer.from(signature);
        const expBuffer = Buffer.from(expected);
        if (sigBuffer.length !== expBuffer.length) return false;
        if (!crypto.timingSafeEqual(sigBuffer, expBuffer)) return false;

        const expires = Number(payload);
        if (!expires || Date.now() > expires) return false;

        return true;
    } catch {
        return false;
    }
}

module.exports = { verifyToken };