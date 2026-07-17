const defaultData = {
  projects: [
    { id: 1, kategori_id: 'Mobile App', nama_proyek: 'HealTrack', slug: 'healtrack', deskripsi_singkat: 'Aplikasi layanan kesehatan dengan jadwal konsultasi dan pengingat minum obat.', deskripsi_lengkap: 'Proyek Uji Kompetensi Keahlian berupa aplikasi layanan kesehatan dengan fitur manajemen jadwal dan notifikasi pengingat minum obat otomatis.', thumbnail: '', banner: '', gallery: [], tahun: '2026', durasi: 'Proyek UKK', status: 'Selesai', unggulan: true },
    { id: 2, kategori_id: 'Website', nama_proyek: 'Sistem Inventaris & Ruangan', slug: 'sistem-inventaris', deskripsi_singkat: 'Sistem untuk membantu pemantauan inventaris dan manajemen ruangan kampus.', deskripsi_lengkap: 'Dikembangkan bersama tim saat Program Praktik Kerja Lapangan untuk meningkatkan efisiensi pemantauan fasilitas.', thumbnail: '', banner: '', gallery: [], tahun: '2025', durasi: 'PKL', status: 'Selesai', unggulan: false },
    { id: 3, kategori_id: 'UI Design', nama_proyek: 'Finance Dashboard', slug: 'finance-dashboard', deskripsi_singkat: 'Dashboard analitik keuangan modern.', deskripsi_lengkap: 'Desain UI dashboard untuk memantau ringkasan keuangan, grafik pemasukan-pengeluaran, dan laporan bulanan secara visual.', thumbnail: '', banner: '', gallery: [], tahun: '2026', durasi: '', status: 'Selesai', unggulan: false },
    { id: 4, kategori_id: 'Website', nama_proyek: 'Coffee Shop Website', slug: 'coffee-shop-website', deskripsi_singkat: 'Website cafe dengan konsep elegan.', deskripsi_lengkap: 'Desain dan pengembangan halaman website untuk sebuah coffee shop, menonjolkan menu, suasana, dan identitas brand.', thumbnail: '', banner: '', gallery: [], tahun: '2026', durasi: '', status: 'Selesai', unggulan: false },
    { id: 5, kategori_id: 'Mobile App', nama_proyek: 'Mobile Banking App', slug: 'mobile-banking-app', deskripsi_singkat: 'Desain aplikasi mobile banking yang user-friendly.', deskripsi_lengkap: 'Rancangan antarmuka aplikasi mobile banking dengan fokus kemudahan transaksi dan navigasi yang intuitif.', thumbnail: '', banner: '', gallery: [], tahun: '2026', durasi: '', status: 'Selesai', unggulan: false },
    { id: 6, kategori_id: 'Video', nama_proyek: 'Company Profile Video', slug: 'company-profile-video', deskripsi_singkat: 'Video profil perusahaan untuk kebutuhan branding.', deskripsi_lengkap: 'Produksi video profil singkat untuk memperkenalkan perusahaan, mencakup naskah, pengambilan gambar, dan editing.', thumbnail: '', banner: '', gallery: [], tahun: '2025', durasi: '', status: 'Selesai', unggulan: false },
    { id: 7, kategori_id: 'Photography', nama_proyek: 'Nature Photography', slug: 'nature-photography', deskripsi_singkat: 'Kumpulan proyek fotografi alam.', deskripsi_lengkap: 'Koleksi hasil fotografi bertema alam, memperlihatkan komposisi dan pengambilan momen di berbagai lokasi.', thumbnail: '', banner: '', gallery: [], tahun: '2025', durasi: '', status: 'Selesai', unggulan: false },
    { id: 8, kategori_id: 'Graphic Design', nama_proyek: 'Poster Design', slug: 'poster-design', deskripsi_singkat: 'Desain poster untuk kampanye produk.', deskripsi_lengkap: 'Desain poster promosi untuk kebutuhan kampanye pemasaran produk, dengan tata letak dan tipografi yang menarik perhatian.', thumbnail: '', banner: '', gallery: [], tahun: '2025', durasi: '', status: 'Selesai', unggulan: false }
  ],
  skills: [
    { id: 1, nama: 'Microsoft Excel', ikon: 'XLS', gambar: 'https://cdn.simpleicons.org/microsoftexcel/217346' },
    { id: 2, nama: 'Microsoft Word', ikon: 'DOC', gambar: 'https://cdn.simpleicons.org/microsoftword/2B579A' },
    { id: 3, nama: 'Google Sheets', ikon: 'GS', gambar: 'https://cdn.simpleicons.org/googlesheets/34A853' },
    { id: 4, nama: 'Google Docs', ikon: 'GD', gambar: 'https://cdn.simpleicons.org/googledocs/4285F4' },
    { id: 5, nama: 'Data Entry', ikon: 'DATA' },
    { id: 6, nama: 'Manajemen Arsip', ikon: 'ARS' },
    { id: 7, nama: 'Technical Support', ikon: 'TS' },
    { id: 8, nama: 'Troubleshooting', ikon: 'FIX' },
    { id: 9, nama: 'MySQL', ikon: 'SQL', gambar: 'https://cdn.simpleicons.org/mysql/4479A1' },
    { id: 10, nama: 'Analisis Sistem', ikon: 'SYS' },
    { id: 11, nama: 'Figma', ikon: 'FG', gambar: 'https://cdn.simpleicons.org/figma/F24E1E' },
    { id: 12, nama: 'Canva', ikon: 'CV', gambar: 'https://cdn.simpleicons.org/canva/00C4CC' },
    { id: 13, nama: 'HTML5', ikon: 'HTML', gambar: 'https://cdn.simpleicons.org/html5/E34F26' },
    { id: 14, nama: 'CSS3', ikon: 'CSS', gambar: 'https://cdn.simpleicons.org/css3/1572B6' },
    { id: 15, nama: 'JavaScript', ikon: 'JS', gambar: 'https://cdn.simpleicons.org/javascript/F7DF1E' },
    { id: 16, nama: 'Komunikasi', ikon: 'COM' },
    { id: 17, nama: 'Kerja Sama Tim', ikon: 'TEAM' },
    { id: 18, nama: 'Manajemen Waktu', ikon: 'TIME' },
    { id: 19, nama: 'Adaptasi', ikon: 'ADP' },
    { id: 20, nama: 'Problem Solving', ikon: 'PS' }
  ],
  certificates: [
    { id: 1, nama_sertifikat: 'Uji Kompetensi Keahlian', penerbit: 'SMK Assalaam Bandung', tahun: '2026', gambar: '', tautan_sertifikat: '' },
    { id: 2, nama_sertifikat: 'Kelas Industri', penerbit: 'PT Dwi Purwa Teknologi', tahun: '2025', gambar: '', tautan_sertifikat: '' }
  ],
  beyond: [
    { id: 1, nama: 'Photography', deskripsi: 'Mengabadikan momen melalui foto.', gambar: '' },
    { id: 2, nama: 'Music', deskripsi: 'Mendengarkan musik untuk mengisi energi.', gambar: '' },
    { id: 3, nama: 'Learning', deskripsi: 'Belajar dan mencoba hal-hal baru.', gambar: '' }
  ]
};
const STORAGE_KEY = 'isma-portfolio-data-v3';

// Pengganti structuredClone() -> lebih aman untuk browser/WebView lama
// (browser bawaan WhatsApp/Instagram, Android WebView versi lama, dll)
function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function getData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved
      ? { ...cloneData(defaultData), ...saved, beyond: saved.beyond || cloneData(defaultData.beyond) }
      : cloneData(defaultData);
  } catch {
    return cloneData(defaultData);
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}