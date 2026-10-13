// POST /api/upload
// Body: { filename, contentType, dataBase64 }
// Upload gambar dan dokumen sertifikat ke Vercel Blob Storage, butuh login.
const { put } = require('@vercel/blob');
const { verifyToken } = require('./_auth');
const BLOB_TOKEN = process.env.PORTFOLIO_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;

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

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(contentType)) {
        return res.status(415).json({ error: 'Format file tidak didukung.' });
    }

    try {
        const buffer = Buffer.from(dataBase64, 'base64');

        const maxBytes = contentType === 'application/pdf' ? 3 * 1024 * 1024 : 4 * 1024 * 1024;
        if (!buffer.length || buffer.length > maxBytes) {
            return res.status(413).json({ error: contentType === 'application/pdf' ? 'Ukuran PDF maksimal 3 MB.' : 'Ukuran gambar maksimal 4 MB.' });
        }

        // Catatan: paket gratis Vercel membatasi body request ~4.5MB (setelah base64,
        // yang menambah ukuran ~33%). admin.js sudah membatasi resize gambar supaya aman.
        const safeName = String(filename).replace(/[^a-zA-Z0-9._-]/g, '_').slice(-80);
        const pathname = `images/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;

        const blob = await put(pathname, buffer, {
            access: 'public',
            contentType,
            addRandomSuffix: false,
            token: BLOB_TOKEN,
        });

        return res.status(200).json({ url: blob.url });
    } catch (err) {
        return res.status(500).json({ error: 'Gagal mengunggah gambar.', detail: String(err) });
    }
}

handler.config = { api: { bodyParser: { sizeLimit: '10mb' } } };

module.exports = handler;
