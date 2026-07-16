const defaultData = {
  projects: [
    { id: 1, kategori_id: 'Mobile App', nama_proyek: 'HealTrack', slug: 'healtrack', deskripsi_singkat: 'Aplikasi layanan kesehatan dengan jadwal konsultasi dan pengingat minum obat.', deskripsi_lengkap: 'Proyek Uji Kompetensi Keahlian berupa aplikasi layanan kesehatan dengan fitur manajemen jadwal dan notifikasi pengingat minum obat otomatis.', thumbnail: '', banner: '', gallery: [], tahun: '2026', durasi: 'Proyek UKK', status: 'Selesai', unggulan: true },
    { id: 2, kategori_id: 'Website', nama_proyek: 'Sistem Inventaris & Ruangan', slug: 'sistem-inventaris', deskripsi_singkat: 'Sistem untuk membantu pemantauan inventaris dan manajemen ruangan kampus.', deskripsi_lengkap: 'Dikembangkan bersama tim saat Program Praktik Kerja Lapangan untuk meningkatkan efisiensi pemantauan fasilitas.', thumbnail: '', banner: '', gallery: [], tahun: '2025', durasi: 'PKL', status: 'Selesai', unggulan: false }
  ],
  skills: [
    { id: 1, nama: 'Microsoft Excel', ikon: 'XLS' }, { id: 2, nama: 'Microsoft Word', ikon: 'DOC' }, { id: 3, nama: 'Google Sheets', ikon: 'GS' }, { id: 4, nama: 'Google Docs', ikon: 'GD' }, { id: 5, nama: 'Data Entry', ikon: 'DATA' }, { id: 6, nama: 'Manajemen Arsip', ikon: 'ARS' }, { id: 7, nama: 'Technical Support', ikon: 'TS' }, { id: 8, nama: 'Troubleshooting', ikon: 'FIX' }, { id: 9, nama: 'MySQL', ikon: 'SQL' }, { id: 10, nama: 'Analisis Sistem', ikon: 'SYS' }, { id: 11, nama: 'Figma', ikon: 'FG' }, { id: 12, nama: 'Canva', ikon: 'CV' }, { id: 13, nama: 'HTML5', ikon: 'HTML' }, { id: 14, nama: 'CSS3', ikon: 'CSS' }, { id: 15, nama: 'JavaScript', ikon: 'JS' }, { id: 16, nama: 'Komunikasi', ikon: 'COM' }, { id: 17, nama: 'Kerja Sama Tim', ikon: 'TEAM' }, { id: 18, nama: 'Manajemen Waktu', ikon: 'TIME' }, { id: 19, nama: 'Adaptasi', ikon: 'ADP' }, { id: 20, nama: 'Problem Solving', ikon: 'PS' }
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
function getData() { try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)); return saved ? { ...structuredClone(defaultData), ...saved, beyond: saved.beyond || structuredClone(defaultData.beyond) } : structuredClone(defaultData); } catch { return structuredClone(defaultData); } }
function saveData(data) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
