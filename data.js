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
    { id: 1, nama: 'Photography', deskripsi: 'Mengabadikan momen melalui foto.', gambar: '', gallery: [] },
    { id: 2, nama: 'Music', deskripsi: 'Mendengarkan musik untuk mengisi energi.', gambar: '', gallery: [] },
    { id: 3, nama: 'Learning', deskripsi: 'Belajar dan mencoba hal-hal baru.', gambar: '', gallery: [] }
  ],
  timeline: [
    { id: 1, judul: 'SMK Assalaam Bandung', kategori: 'Education', tanggal: 'Jul 2023 – Mei 2026', instansi: 'Rekayasa Perangkat Lunak (RPL)', deskripsi: 'Kelas Industri bersama PT Dwi Purwa Teknologi.\nUji Kompetensi Keahlian melalui proyek aplikasi kesehatan HealTack.\nProyek P5 berupa pengabdian masyarakat.', skills: 'Kelas Industri, Uji Kompetensi Keahlian (UKK), P5', gambar: '', gallery: [] },
    { id: 2, judul: 'Technical Support (PKL)', kategori: 'Experience', tipe: 'PKL', tanggal: 'Sep 2025 – Nov 2025', instansi: 'UIN Sunan Gunung Djati Bandung (PTIPD)', deskripsi: 'Terlibat dalam pengembangan sistem inventaris dan manajemen ruangan.\nMengelola data entry akun mahasiswa dan dokumentasi.\nMelakukan monitoring laboratorium komputer dan dukungan teknis ujian ICT.\nMengelola kebutuhan logistik operasional divisi.', skills: 'Technical Support, Data Entry, Troubleshooting', gambar: '', gallery: [] },
    { id: 3, judul: 'Ketua Divisi Lingkungan Kesehatan', kategori: 'Organization', tipe: 'Organization', tanggal: 'Jul 2023 – Agu 2025', instansi: 'OSIS SMK Assalaam Bandung', deskripsi: 'Merencanakan program kerja, anggaran, dan pelaksanaan kegiatan.\nMengoordinasikan pembagian tugas dan jadwal operasional.\nMenangani kegiatan UKS dan koordinasi antar divisi sekolah.', skills: 'Koordinasi, Perencanaan Program, Manajemen Operasional', gambar: '', gallery: [] },
    { id: 4, judul: 'Staf Penjualan & Distribusi', kategori: 'Experience', tipe: 'Usaha', tanggal: 'Agu 2026 – Okt 2026', instansi: 'Usaha Kue & Roti', deskripsi: 'Menjual produk melalui stan dan titip jual di lima sekolah.\nMengatur jadwal pengantaran.\nMencatat modal, pengeluaran, dan pemasukan.\nMelayani pelanggan dan menjaga kualitas produk.', skills: 'Distribusi, Pencatatan Keuangan, Pelayanan Pelanggan', gambar: '', gallery: [] },
    { id: 5, judul: 'Helper Produksi (Numbering & Pemeriksaan Kain)', kategori: 'Experience', tipe: 'Harian Lepas', tanggal: 'Okt 2026 – Nov 2026', instansi: 'PT Fadfad', deskripsi: 'Memeriksa kain hasil produksi untuk mengidentifikasi cacat atau ketidaksesuaian.\nMelakukan penomoran (numbering) pada kain.\nMemasang name tag sebagai identitas kain.\nMembantu persiapan dan pemeriksaan hasil potongan kain.', skills: 'Quality Checking, Numbering & Labeling, Proses Produksi Garment', gambar: '', gallery: [] }
  ],
  experienceEducationVersion: 0,
  behindWork: [],
  collaboration: [{ id: 1, availability: 'Tidak ditampilkan', email: 'ismatiarazalianti32@gmail.com', whatsapp: '+6281298536421', github: 'https://github.com/Ismatyarara', linkedin: '', instagram: 'https://www.instagram.com/tiararie_e/' }]
};

// Pengganti structuredClone() -> lebih aman untuk browser/WebView lama
function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

// Ambil data dari backend (Vercel Blob, lewat /api/portfolio).
// Kalau belum pernah disimpan sama sekali (baru pertama deploy) atau request gagal
// (misal offline), pakai defaultData supaya halaman tetap tampil.
window.portfolioDataReady = false;
async function getData() {
  let data;
  try {
    const response = await fetch('/api/portfolio', { cache: 'no-store' });
    if (!response.ok) throw new Error('Gagal mengambil data dari server.');
    const saved = await response.json();
    data = !saved ? cloneData(defaultData) : {
      ...cloneData(defaultData),
      ...saved,
      beyond: saved.beyond || cloneData(defaultData.beyond),
      timeline: Array.isArray(saved.timeline) ? saved.timeline : cloneData(defaultData.timeline),
      behindWork: Array.isArray(saved.behindWork) ? saved.behindWork : cloneData(defaultData.behindWork),
      collaboration: (Array.isArray(saved.collaboration) && saved.collaboration.length ? saved.collaboration : cloneData(defaultData.collaboration)).map((item, index) => ({ ...item, id: item.id ?? index + 1 })),
    };
  } catch (err) {
    console.error('getData() gagal, pakai data default:', err);
    data = cloneData(defaultData);
  }
  if (Number(data.experienceEducationVersion) !== 1) {
    const requiredEntries = defaultData.timeline.filter(item => ['Education', 'Experience', 'Organization'].includes(item.kategori));
    const matched = new Set();
    const existing = Array.isArray(data.timeline) ? data.timeline : [];
    const normalizedTitle = value => String(value || '').trim().toLocaleLowerCase('id');
    data.timeline = requiredEntries.map(seed => {
      let index = existing.findIndex(item => normalizedTitle(item.judul) === normalizedTitle(seed.judul));
      if (index < 0) index = existing.findIndex(item => String(item.id) === String(seed.id) && ['Education', 'Experience', 'Organization'].includes(item.kategori));
      if (index < 0 || matched.has(index)) return cloneData(seed);
      matched.add(index);
      const current = existing[index];
      return { ...current, ...cloneData(seed), id: current.id ?? seed.id, gambar: current.gambar || seed.gambar || '', gallery: Array.isArray(current.gallery) ? current.gallery : [...(seed.gallery || [])] };
    }).concat(existing.filter((_, index) => !matched.has(index)));
    data.experienceEducationVersion = 1;
  }
  window.portfolioDataReady = true;
  window.dispatchEvent(new Event('portfolio:data-ready'));
  return data;
}
// Simpan seluruh data ke backend. Butuh token admin yang valid (lihat admin.js).
// Melempar error kalau gagal, supaya pemanggil bisa menampilkan pesan ke user.
async function saveData(data, token) {
  const response = await fetch('/api/portfolio', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || 'Gagal menyimpan data ke server.');
  }

  return true;
}
