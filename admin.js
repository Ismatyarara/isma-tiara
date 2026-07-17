const ADMIN_EMAIL = 'ismatiara51@gmail.com';
const ADMIN_PASSWORD = 'ismatiara0908';
const AUTH_KEY = 'isma-portfolio-admin-auth';
let adminData = getData();
let tab = 'dashboard';
let editingId = null;
const $ = selector => document.querySelector(selector);
const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
const labels = { projects: 'proyek', skills: 'skill', certificates: 'sertifikat', beyond: 'kartu Beyond Work' };
const fieldSets = {
  projects: [['kategori_id', 'Kategori proyek', 'select', ['Website', 'Design', 'Video', 'Photography']], ['nama_proyek', 'Nama proyek', 'text'], ['slug', 'Slug URL', 'text'], ['deskripsi_singkat', 'Deskripsi singkat', 'textarea'], ['deskripsi_lengkap', 'Deskripsi lengkap', 'textarea'], ['thumbnail', 'Foto sampul proyek', 'file'], ['gallery', 'Galeri proyek (bisa beberapa foto)', 'files'], ['banner', 'Banner proyek', 'file'], ['tahun', 'Tahun', 'number'], ['durasi', 'Durasi', 'text'], ['status', 'Status', 'select', ['Draft', 'Proses', 'Selesai']], ['unggulan', 'Proyek unggulan', 'checkbox']],
  skills: [['nama', 'Nama skill', 'text'], ['ikon', 'Teks singkat bila tanpa foto', 'text'], ['gambar', 'Foto / ikon skill', 'file']],
  certificates: [['nama_sertifikat', 'Nama sertifikat', 'text'], ['penerbit', 'Penerbit', 'text'], ['tahun', 'Tahun', 'number'], ['gambar', 'Gambar sertifikat', 'file'], ['tautan_sertifikat', 'Tautan sertifikat', 'url']],
  beyond: [['nama', 'Judul aktivitas', 'text'], ['deskripsi', 'Deskripsi singkat', 'textarea'], ['gambar', 'Foto aktivitas', 'file']]
};
function fieldMarkup([key, label, type, options], item) { const value = item[key] || ''; if (type === 'textarea') return `<label>${label}<textarea name="${key}" required>${escapeHtml(value)}</textarea></label>`; if (type === 'select') return `<label>${label}<select name="${key}" required>${options.map(option => `<option ${option === value ? 'selected' : ''}>${option}</option>`).join('')}</select></label>`; if (type === 'checkbox') return `<label class="check"><input type="checkbox" name="${key}" ${item[key] ? 'checked' : ''}> ${label}</label>`; if (type === 'files') return `<label>${label}<input type="file" name="${key}" accept="image/*" multiple><small>${value.length ? `${value.length} foto tersimpan — pilih foto baru untuk mengganti galeri.` : 'Pilih satu atau beberapa foto JPG, PNG, atau WEBP.'}</small></label>`; if (type === 'file') return `<label>${label}<input type="file" name="${key}" accept="image/*"><small>${value ? 'Gambar tersimpan — pilih file lain bila ingin mengganti.' : 'Format gambar JPG, PNG, atau WEBP.'}</small></label>`; return `<label>${label}<input type="${type}" name="${key}" value="${escapeHtml(value)}" required></label>`; }
function drawForm(item = {}) { $('#form-title').textContent = `${editingId ? 'Edit' : 'Tambah'} ${labels[tab]}`; $('#form-fields').innerHTML = fieldSets[tab].map(field => fieldMarkup(field, item)).join(''); }
function itemTitle(item) { return item.nama_proyek || item.nama_sertifikat || item.nama; }
function itemMeta(item) { return item.kategori_id || item.penerbit || item.ikon || ''; }
function drawList() { const list = adminData[tab]; $('#admin-list').innerHTML = list.length ? list.map(item => `<div class="admin-item"><div><b>${escapeHtml(itemTitle(item))}</b><span>${escapeHtml(itemMeta(item))}</span></div><p><button type="button" onclick="editItem(${item.id})">Edit</button><button type="button" onclick="deleteItem(${item.id})">Hapus</button></p></div>`).join('') : '<p>Belum ada data.</p>'; }
function updateSummary() { $('#summary-projects').textContent = adminData.projects.length; $('#summary-certificates').textContent = adminData.certificates.length; $('#summary-skills').textContent = adminData.skills.length; }
function selectTab(nextTab) { tab = nextTab; editingId = null; document.querySelectorAll('.tab').forEach(item => item.classList.toggle('active', item.dataset.tab === tab)); const dashboard = tab === 'dashboard'; $('#dashboard-view').hidden = !dashboard; $('#editor').hidden = dashboard; $('#page-title').textContent = dashboard ? 'Dashboard' : labels[tab][0].toUpperCase() + labels[tab].slice(1); if (!dashboard) { drawForm(); drawList(); } updateSummary(); }
function reset() { editingId = null; drawForm(); }

// --- Kompresi gambar ---
// Mengubah file gambar jadi base64 JPEG, dengan ukuran & kualitas yang bisa diatur.
// maxSize lebih kecil dan quality lebih rendah = file lebih ringan, agar lebih hemat kuota localStorage.
async function readFile(file, maxSize = 800, quality = 0.8) {
  if (!file) return null;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectURL = URL.createObjectURL(file);

    img.onload = () => {
      let { width, height } = img;

      if (width > height && width > maxSize) {
        height = Math.round((height * maxSize) / width);
        width = maxSize;
      } else if (height > maxSize) {
        width = Math.round((width * maxSize) / height);
        height = maxSize;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      URL.revokeObjectURL(objectURL);

      resolve(canvas.toDataURL("image/jpeg", quality));
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectURL);
      reject(new Error("Gagal membaca gambar."));
    };

    img.src = objectURL;
  });
}
function readFiles(files, maxSize = 800, quality = 0.8) { return Promise.all([...files].map(file => readFile(file, maxSize, quality))); }

// Menghitung ukuran total (dalam karakter) semua data yang akan disimpan.
function estimateSize(data) { return new Blob([JSON.stringify(data)]).size; }

// Mencoba menyimpan data. Kalau localStorage penuh (QuotaExceededError),
// otomatis kompres ulang gambar milik item yang baru diedit/ditambah dengan
// ukuran & kualitas lebih kecil, lalu coba simpan lagi — sampai batas percobaan.
async function saveWithRetry(item, rawFiles) {
  const attempts = [
    { maxSize: 800, quality: 0.8 },
    { maxSize: 600, quality: 0.65 },
    { maxSize: 450, quality: 0.5 },
    { maxSize: 320, quality: 0.4 },
  ];

  for (let i = 0; i < attempts.length; i++) {
    const { maxSize, quality } = attempts[i];

    // Kompres ulang hanya file gambar yang baru dipilih di percobaan > 0
    if (i > 0) {
      for (const key of Object.keys(rawFiles.single)) {
        const file = rawFiles.single[key];
        if (file) item[key] = await readFile(file, maxSize, quality);
      }
      if (rawFiles.gallery) {
        item.gallery = await readFiles(rawFiles.gallery, maxSize, quality);
      }
    }

    try {
      saveData(adminData);
      return true;
    } catch (err) {
      const isQuotaError = err && (err.name === 'QuotaExceededError' || err.name === 'NS_ERROR_DOM_QUOTA_REACHED');
      if (!isQuotaError || i === attempts.length - 1) {
        throw err;
      }
      // lanjut ke percobaan berikutnya dengan kompresi lebih agresif
    }
  }
  return false;
}

window.editItem = id => { editingId = id; drawForm(adminData[tab].find(item => item.id === id)); window.scrollTo({ top: 0, behavior: 'smooth' }); };
window.deleteItem = id => { if (confirm('Hapus item ini?')) { adminData[tab] = adminData[tab].filter(item => item.id !== id); saveData(adminData); drawList(); updateSummary(); reset(); } };

function initialiseApp() {
  $('#login-screen').hidden = true;
  $('#admin-app').hidden = false;
  selectTab('dashboard');
  document.querySelectorAll('.tab').forEach(button => button.onclick = () => selectTab(button.dataset.tab));
  $('.open-manager').onclick = () => selectTab('projects');
  $('.open-certificates').onclick = () => selectTab('certificates');
  $('#logout').onclick = () => { localStorage.removeItem(AUTH_KEY); location.reload(); };

  $('#item-form').onsubmit = async event => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    const current = editingId ? adminData[tab].find(item => item.id === editingId) : {};
    if (tab === 'projects') values.unggulan = form.elements.unggulan.checked;

    // Simpan referensi file mentah supaya bisa dikompres ulang kalau perlu
    const rawFiles = { single: {}, gallery: null };

    for (const key of ['thumbnail', 'banner', 'gambar']) {
      if (form.elements[key]) {
        const file = form.elements[key].files[0];
        rawFiles.single[key] = file || null;
        values[key] = file ? await readFile(file) : (current[key] || '');
      }
    }
    if (form.elements.gallery) {
      const files = form.elements.gallery.files;
      rawFiles.gallery = files.length ? files : null;
      values.gallery = files.length ? await readFiles(files) : (current.gallery || []);
    }

    let targetItem;
    if (editingId) {
      Object.assign(current, values);
      targetItem = current;
    } else {
      targetItem = { id: Date.now(), ...values };
      adminData[tab].push(targetItem);
    }

    try {
      await saveWithRetry(targetItem, rawFiles);
    } catch {
      alert('Ukuran gambar masih terlalu besar untuk penyimpanan browser meski sudah dikompres maksimal. Coba unggah foto dengan resolusi lebih kecil, atau hapus beberapa item/gambar lama untuk mengosongkan ruang.');
      return;
    }

    drawList();
    updateSummary();
    reset();
  };

  $('#cancel').onclick = reset;
}

$('#login-form').onsubmit = event => {
  event.preventDefault();
  const email = $('#admin-email').value.trim().toLowerCase();
  const password = $('#admin-password').value;
  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    $('#login-error').textContent = 'Email atau password tidak sesuai. Akses ditolak.';
    return;
  }
  localStorage.setItem(AUTH_KEY, 'authenticated');
  initialiseApp();
};

if (localStorage.getItem(AUTH_KEY) === 'authenticated') initialiseApp();