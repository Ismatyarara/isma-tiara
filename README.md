# Isma Portfolio CMS (static)

Situs ini murni HTML, CSS, dan JavaScript. Tidak ada build command: unggah folder ini langsung ke Vercel.

## Admin

- Buka `admin.html` dan masuk memakai kredensial yang telah ditetapkan.
- Dashboard menampilkan hitungan proyek, sertifikat, dan skill secara otomatis.
- Kelola proyek, sertifikat, dan skill dari menu samping. Perubahan disimpan ke `localStorage` browser.

## Fitur halaman publik

- Filter proyek: Semua, Website, UI/UX Design, Mobile App, Video, dan Photography.
- Sertifikat awalnya hanya menampilkan maksimal tiga item. Tombol **Lihat semua sertifikat** muncul otomatis saat jumlahnya lebih dari tiga.

## Catatan keamanan dan data

Karena ini situs statis, kredensial ada di JavaScript dan proteksi login hanya mencegah akses melalui antarmuka browser. Ini cocok untuk CMS demo atau personal yang di-hosting statis, tetapi bukan keamanan server yang sesungguhnya. Untuk akses admin yang benar-benar aman dan data yang sama untuk semua pengunjung, sambungkan autentikasi dan penyimpanan ke layanan seperti Supabase atau Firebase.
