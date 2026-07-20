// GET  /api/portfolio  -> ambil data portfolio (publik, dipakai index.html)
// POST /api/portfolio  -> simpan data portfolio (butuh login, dipakai admin.js)
const { put, list } = require('@vercel/blob');
const { verifyToken } = require('./_auth');

const DATA_PATH = 'data/portfolio.json';

async function readData() {
    const { blobs } = await list({ prefix: DATA_PATH, limit: 1 });
    if (!blobs.length) return null;
    const response = await fetch(blobs[0].url, { cache: 'no-store' });
    if (!response.ok) return null;
    return response.json();
}

async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const data = await readData();
            return res.status(200).json(data); // null kalau belum pernah disimpan -> data.js pakai default
        } catch (err) {
            return res.status(500).json({ error: 'Gagal mengambil data.', detail: String(err) });
        }
    }

    if (req.method === 'POST' || req.method === 'PUT') {
        if (!verifyToken(req)) {
            return res.status(401).json({ error: 'Unauthorized. Silakan login ulang.' });
        }

        const body = req.body;
        if (!body || typeof body !== 'object' || Array.isArray(body)) {
            return res.status(400).json({ error: 'Format data tidak valid.' });
        }

        try {
            await put(DATA_PATH, JSON.stringify(body), {
                access: 'public',
                contentType: 'application/json',
                addRandomSuffix: false,
                allowOverwrite: true,
            });
            return res.status(200).json({ ok: true });
        } catch (err) {
            return res.status(500).json({ error: 'Gagal menyimpan data.', detail: String(err) });
        }
    }

    res.setHeader('Allow', 'GET, POST, PUT');
    return res.status(405).json({ error: 'Method tidak diizinkan.' });
}

handler.config = { api: { bodyParser: { sizeLimit: '2mb' } } };

module.exports = handler;