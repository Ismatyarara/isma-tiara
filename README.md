# Isma Portfolio CMS

Website statis HTML/CSS/JavaScript yang memakai **Vercel Serverless Functions + Vercel Blob**. Konten yang disimpan dari admin tersinkron ke halaman publik melalui `/api/portfolio`.

## Konfigurasi Vercel (wajib sebelum login)

Tambahkan environment variables berikut di **Vercel → Project → Settings → Environment Variables**, untuk Production dan Preview:

- `PORTFOLIO_READ_WRITE_TOKEN` (atau `BLOB_READ_WRITE_TOKEN`): token dari Vercel Blob Store.
- `ADMIN_EMAIL`: alamat email admin.
- `ADMIN_PASSWORD`: password admin sebagai Vercel Secret (cara termudah), atau gunakan `ADMIN_PASSWORD_HASH` untuk hash PBKDF2.
- `ADMIN_API_SECRET`: string acak panjang (minimal 32 karakter) untuk menandatangani sesi.

Buat hash password di komputer sendiri (jangan jalankan di browser publik):

```powershell
node -e "const c=require('crypto'); const salt=c.randomBytes(16); const hash=c.pbkdf2Sync(process.argv[1],salt,210000,64,'sha512'); console.log('pbkdf2-sha512$210000$'+salt.toString('base64url')+'$'+hash.toString('base64url'))" "PASSWORD_BARU"
```

Salin hasilnya ke `ADMIN_PASSWORD_HASH`. Buat secret sesi, misalnya dengan `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`.

## Alur CMS

1. Buka `/admin.html`, masuk memakai email dan password admin.
2. Kelola proyek (termasuk cover dan galeri), sertifikat, skill, serta hobi dan galeri foto.
3. Gambar diunggah ke Vercel Blob; yang tersimpan di data portfolio adalah URL gambar.
4. Perubahan disimpan melalui API terlindungi dan langsung dibaca halaman publik setelah refresh.

## Keamanan

- Login memverifikasi `ADMIN_PASSWORD_HASH` menggunakan PBKDF2-SHA512 dan perbandingan konstan.
- Sesi bertanda tangan HMAC, berlaku 12 jam, dan endpoint tulis/upload memerlukan token valid.
- Endpoint login membatasi percobaan berulang per instance serverless. Untuk rate limit global, tambahkan Vercel WAF atau layanan rate limit terkelola.
- Jangan commit `.env`, token Blob, password, atau `ADMIN_API_SECRET` ke GitHub.

## Pengujian manual

Uji login, logout, tambah/edit/hapus data, upload/ganti gambar, refresh halaman publik, filter proyek, dan lightbox galeri. Jika login mengembalikan pesan konfigurasi, periksa tiga environment variables admin di atas lalu redeploy.
