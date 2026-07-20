const AUTH_KEY = 'isma-portfolio-admin-auth'; // simpan { token, expires }
let adminData = null;
let authToken = null;
let tab = 'dashboard';
let editingId = null;
let galleryDraft = [];
let galleryPendingFiles = [];
let galleryPendingUrls = [];
const MAX_GALLERY_IMAGES = 8;
const $ = selector => document.querySelector(selector);
const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
const labels = { projects: 'proyek', skills: 'skill', certificates: 'sertifikat', beyond: 'kartu Beyond Work' };
const fieldSets = {
  projects: [['kategori_id', 'Kategori proyek', 'select', ['Website', 'Design', 'Video', 'Photography']], ['nama_proyek', 'Nama proyek', 'text'], ['slug', 'Slug URL', 'text'], ['deskripsi_singkat', 'Deskripsi singkat', 'textarea'], ['deskripsi_lengkap', 'Deskripsi lengkap', 'textarea'], ['thumbnail', 'Foto sampul proyek', 'file'], ['gallery', 'Galeri proyek (bisa beberapa foto)', 'files'], ['banner', 'Banner proyek', 'file'], ['demo_url', 'Tautan demo (opsional)', 'optional-url'], ['github_url', 'Tautan GitHub (opsional)', 'optional-url'], ['tahun', 'Tahun', 'number'], ['durasi', 'Durasi', 'text'], ['status', 'Status', 'select', ['Draft', 'Proses', 'Selesai']], ['unggulan', 'Proyek unggulan', 'checkbox']],
  skills: [['nama', 'Nama skill', 'text'], ['ikon', 'Teks singkat bila tanpa foto', 'text'], ['gambar', 'Foto / ikon skill', 'file']],
  certificates: [['nama_sertifikat', 'Nama sertifikat', 'text'], ['penerbit', 'Penerbit', 'text'], ['tahun', 'Tahun', 'number'], ['gambar', 'Gambar sertifikat', 'file'], ['tautan_sertifikat', 'Tautan sertifikat', 'url']],
  beyond: [['nama', 'Judul aktivitas', 'text'], ['deskripsi', 'Deskripsi singkat', 'textarea'], ['gambar', 'Foto aktivitas', 'file']]
};
function fieldMarkup([key, label, type, options], item) {
  const value = item[key] || '';
  if (type === 'textarea') return `<label>${label}<textarea name="${key}" required>${escapeHtml(value)}</textarea></label>`;
  if (type === 'select') return `<label>${label}<select name="${key}" required>${options.map(option => `<option ${option === value ? 'selected' : ''}>${option}</option>`).join('')}</select></label>`;
  if (type === 'checkbox') return `<label class="check"><input type="checkbox" name="${key}" ${item[key] ? 'checked' : ''}> ${label}</label>`;
  if (type === 'optional-url') return `<label>${label}<input type="url" name="${key}" value="${escapeHtml(value)}" placeholder="https://..."><small>Biarkan kosong bila belum ada.</small></label>`;
  if (type === 'files') return `<label>${label}<input type="file" name="${key}" accept="image/jpeg,image/png,image/webp" multiple><small>Pilih hingga ${MAX_GALLERY_IMAGES} foto. Foto baru akan ditambahkan ke galeri lalu diunggah ke server saat disimpan.</small></label><div class="gallery-admin-preview" id="gallery-preview"></div>`;
  if (type === 'file') return `<label>${label}<input type="file" name="${key}" accept="image/jpeg,image/png,image/webp"><small>${value ? 'Gambar tersimpan — pilih file lain bila ingin mengganti.' : 'Format gambar JPG, PNG, atau WEBP.'}</small></label>`;
  return `<label>${label}<input type="${type}" name="${key}" value="${escapeHtml(value)}" required></label>`;
}
function renderGalleryPreview() { const preview = $('#gallery-preview'); if (!preview) return; galleryPendingUrls.forEach(URL.revokeObjectURL); galleryPendingUrls = galleryPendingFiles.map(file => URL.createObjectURL(file)); const saved = galleryDraft.map((source, index) => `<figure><img src="${source}" alt="Foto galeri ${index + 1}"><button type="button" data-remove-gallery="${index}" aria-label="Hapus foto ${index + 1}">×</button></figure>`).join(''); const pending = galleryPendingUrls.map((source, index) => `<figure class="gallery-pending"><img src="${source}" alt="Foto baru ${index + 1}"><button type="button" data-remove-pending="${index}" aria-label="Batalkan foto baru ${index + 1}">×</button></figure>`).join(''); preview.innerHTML = saved || pending ? saved + pending : '<p>Belum ada foto galeri.</p>'; preview.querySelectorAll('[data-remove-gallery]').forEach(button => button.onclick = () => { galleryDraft.splice(Number(button.dataset.removeGallery), 1); renderGalleryPreview(); }); preview.querySelectorAll('[data-remove-pending]').forEach(button => button.onclick = () => { galleryPendingFiles.splice(Number(button.dataset.removePending), 1); renderGalleryPreview(); }); }
function drawForm(item = {}) { galleryDraft = Array.isArray(item.gallery) ? [...item.gallery] : []; galleryPendingFiles = []; $('#form-title').textContent = `${editingId ? 'Edit' : 'Tambah'} ${labels[tab]}`; $('#form-fields').innerHTML = fieldSets[tab].map(field => fieldMarkup(field, item)).join(''); renderGalleryPreview(); const galleryInput = document.querySelector('input[name="gallery"]'); if (galleryInput) galleryInput.onchange = () => { galleryPendingFiles = [...galleryInput.files]; if (galleryDraft.length + galleryPendingFiles.length > MAX_GALLERY_IMAGES) { alert(`Galeri maksimal ${MAX_GALLERY_IMAGES} foto.`); galleryPendingFiles = []; galleryInput.value = ''; } renderGalleryPreview(); }; }
function itemTitle(item) { return item.nama_proyek || item.nama_sertifikat || item.nama; }
function itemMeta(item) { return item.kategori_id || item.penerbit || item.ikon || ''; }
function drawList() { const list = adminData[tab]; $('#admin-list').innerHTML = list.length ? list.map(item => `<div class="admin-item"><div><b>${escapeHtml(itemTitle(item))}</b><span>${escapeHtml(itemMeta(item))}</span></div><p><button type="button" onclick="editItem(${item.id})">Edit</button><button type="button" onclick="deleteItem(${item.id})">Hapus</button></p></div>`).join('') : '<p>Belum ada data.</p>'; }
function updateSummary() { $('#summary-projects').textContent = adminData.projects.length; $('#summary-certificates').textContent = adminData.certificates.length; $('#summary-skills').textContent = adminData.skills.length; }
function selectTab(nextTab) { tab = nextTab; editingId = null; document.querySelectorAll('.tab').forEach(item => item.classList.toggle('active', item.dataset.tab === tab)); const dashboard = tab === 'dashboard'; $('#dashboard-view').hidden = !dashboard; $('#editor').hidden = dashboard; $('#page-title').textContent = dashboard ? 'Dashboard' : labels[tab][0].toUpperCase() + labels[tab].slice(1); if (!dashboard) { drawForm(); drawList(); } updateSummary(); }
function reset() { editingId = null; drawForm(); }

// --- Baca file jadi base64 JPEG, dengan resize ringan hanya kalau gambar aslinya lebih besar dari batas ---
// Tidak ada lagi kompresi agresif seperti versi localStorage lama (itu penyebab foto buram).
// Batas dinaikkan karena sekarang tersimpan di Vercel Blob Storage, bukan localStorage browser.
async function readFileAsDataUrl(file, maxSize = 1600, quality = 0.88) {
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
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(objectURL);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => { URL.revokeObjectURL(objectURL); reject(new Error('Gagal membaca gambar.')); };
    img.src = objectURL;
  });
}

// Upload satu gambar (dataURL base64) ke /api/upload, hasilnya URL Vercel Blob.
async function uploadImage(dataUrl, filename) {
  const [, contentType, base64Body] = dataUrl.match(/^data:([^;]+);base64,(.*)$/) || [];
  if (!base64Body) throw new Error('Format gambar tidak dikenali.');

  const response = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
    body: JSON.stringify({ filename, contentType, dataBase64: base64Body }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || 'Gagal mengunggah gambar.');
  }
  const { url } = await response.json();
  return url;
}

// Upload beberapa file sekaligus (dipakai untuk galeri), mengembalikan array URL.
async function uploadImages(files) {
  const urls = [];
  for (const file of files) {
    const dataUrl = await readFileAsDataUrl(file, 1400, 0.85);
    urls.push(await uploadImage(dataUrl, file.name));
  }
  return urls;
}

window.editItem = id => { editingId = id; drawForm(adminData[tab].find(item => item.id === id)); window.scrollTo({ top: 0, behavior: 'smooth' }); };
window.deleteItem = async id => {
  if (!confirm('Hapus item ini?')) return;
  const previous = adminData[tab];
  adminData[tab] = adminData[tab].filter(item => item.id !== id);
  try {
    await saveData(adminData, authToken);
  } catch (err) {
    adminData[tab] = previous; // rollback kalau gagal simpan
    alert(err.message || 'Gagal menghapus item.');
    return;
  }
  drawList();
  updateSummary();
  reset();
};

function setFormBusy(busy, message) {
  const submitButton = $('#item-form button[type="submit"]');
  if (submitButton) submitButton.disabled = busy;
  const status = $('#form-status');
  if (status) status.textContent = busy ? (message || 'Menyimpan...') : '';
}

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

    setFormBusy(true, 'Mengunggah gambar...');
    try {
      for (const key of ['thumbnail', 'banner', 'gambar']) {
        if (form.elements[key]) {
          const file = form.elements[key].files[0];
          if (file) {
            const dataUrl = await readFileAsDataUrl(file);
            values[key] = await uploadImage(dataUrl, file.name);
          } else {
            values[key] = current[key] || '';
          }
        }
      }

      if (form.elements.gallery) {
        if (galleryPendingFiles.length + galleryDraft.length > MAX_GALLERY_IMAGES) {
          alert(`Galeri maksimal ${MAX_GALLERY_IMAGES} foto. Hapus foto yang tidak diperlukan atau pilih lebih sedikit foto.`);
          setFormBusy(false);
          return;
        }
        const newUrls = galleryPendingFiles.length ? await uploadImages(galleryPendingFiles) : [];
        values.gallery = [...galleryDraft, ...newUrls];
      }

      let targetItem;
      if (editingId) {
        Object.assign(current, values);
        targetItem = current;
      } else {
        targetItem = { id: Date.now(), ...values };
        adminData[tab].push(targetItem);
      }

      setFormBusy(true, 'Menyimpan data...');
      await saveData(adminData, authToken);
    } catch (err) {
      alert(err.message || 'Terjadi kesalahan saat menyimpan.');
      setFormBusy(false);
      return;
    }

    setFormBusy(false);
    drawList();
    updateSummary();
    reset();
  };

  $('#cancel').onclick = reset;
}

async function bootAdminApp() {
  $('#login-screen').hidden = false;
  try {
    adminData = await getData();
  } catch (err) {
    alert('Gagal memuat data dari server. Coba muat ulang halaman.');
    return;
  }
  initialiseApp();
}

$('#login-form').onsubmit = async event => {
  event.preventDefault();
  const email = $('#admin-email').value.trim().toLowerCase();
  const password = $('#admin-password').value;
  const errorBox = $('#login-error');
  errorBox.textContent = '';

  const submitButton = event.currentTarget.querySelector('button[type="submit"]');
  if (submitButton) submitButton.disabled = true;

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const body = await response.json();
    if (!response.ok) throw new Error(body.error || 'Login gagal.');

    localStorage.setItem(AUTH_KEY, JSON.stringify({ token: body.token, expires: body.expires }));
    authToken = body.token;
    await bootAdminApp();
  } catch (err) {
    errorBox.textContent = err.message || 'Email atau password tidak sesuai. Akses ditolak.';
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
};

(function checkExistingSession() {
  try {
    const saved = JSON.parse(localStorage.getItem(AUTH_KEY) || 'null');
    if (saved && saved.token && saved.expires > Date.now()) {
      authToken = saved.token;
      bootAdminApp();
    }
  } catch {
    localStorage.removeItem(AUTH_KEY);
  }
})();