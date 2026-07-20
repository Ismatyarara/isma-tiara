// POST /api/upload
// Body: { filename, contentType, dataBase64 }
// Upload gambar ke Vercel Blob Storage (bukan localStorage), butuh login.
const { put } = require('@vercel/blob');
const { verifyToken } = require('./_auth');

async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method tidak diizinkan.' });
    }

    if (!verifyToken(req)) {
        return res.status(401).json({ error: 'Unauthorized. Silakan login ulang.' });
    }

    const { filename, contentType, dataBase64 } = req.body || {};
    if (!filename || !dataBase64) {
        return res.status(400).json({ error: 'File tidak ditemukan pada request.' });
    }

    try {
        const buffer = Buffer.from(dataBase64, 'base64');

        // Catatan: paket gratis Vercel membatasi body request ~4.5MB (setelah base64,
        // yang menambah ukuran ~33%). admin.js sudah membatasi resize gambar supaya aman.
        const safeName = String(filename).replace(/[^a-zA-Z0-9._-]/g, '_').slice(-80);
        const pathname = `images/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;

        const blob = await put(pathname, buffer, {
            access: 'public',
            contentType: contentType || 'image/jpeg',
            addRandomSuffix: false,
        });

        return res.status(200).json({ url: blob.url });
    } catch (err) {
        return res.status(500).json({ error: 'Gagal mengunggah gambar.', detail: String(err) });
    }
}

handler.config = { api: { bodyParser: { sizeLimit: '10mb' } } };

module.exports = handler;