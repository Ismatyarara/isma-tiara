const AUTH_KEY = 'isma-portfolio-admin-auth'; // simpan { token, expires }
let adminData = null;
let authToken = null;
let tab = 'dashboard';
let editingId = null;
let galleryDraft = [];
let galleryPendingFiles = [];
let galleryPendingUrls = [];
let listPage = 1;
let pendingDeleteId = null;
let toastTimer;
const pageSize = 6;
const $ = selector => document.querySelector(selector);
const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
const labels = { projects: 'proyek', skills: 'skill', certificates: 'sertifikat', beyond: 'hobi' };
const fieldSets = {
  projects: [['kategori_id', 'Kategori proyek', 'select', ['Website', 'Design', 'Video', 'Photography']], ['nama_proyek', 'Nama proyek', 'text'], ['slug', 'Slug URL', 'text'], ['deskripsi_singkat', 'Deskripsi singkat', 'textarea'], ['deskripsi_lengkap', 'Project overview', 'textarea'], ['problem', 'Masalah yang diselesaikan (opsional)', 'optional-textarea'], ['solution', 'Solusi yang dibuat (opsional)', 'optional-textarea'], ['features', 'Fitur utama (satu fitur per baris, opsional)', 'optional-textarea'], ['thumbnail', 'Foto sampul proyek', 'file'], ['gallery', 'Galeri proyek (bisa beberapa foto)', 'files'], ['banner', 'Banner proyek', 'file'], ['teknologi', 'Teknologi (pisahkan dengan koma, opsional)', 'optional-text'], ['demo_url', 'Tautan demo (opsional)', 'optional-url'], ['github_url', 'Tautan GitHub (opsional)', 'optional-url'], ['tahun', 'Tahun', 'number'], ['durasi', 'Durasi', 'text'], ['status', 'Status', 'select', ['Draft', 'Proses', 'Selesai']], ['unggulan', 'Proyek unggulan', 'checkbox']],
  skills: [['nama', 'Nama skill', 'text'], ['ikon', 'Teks singkat bila tanpa foto', 'text'], ['gambar', 'Foto / ikon skill', 'file']],
  certificates: [['nama_sertifikat', 'Nama sertifikat', 'text'], ['penerbit', 'Penerbit', 'text'], ['tahun', 'Tahun', 'number'], ['gambar', 'Gambar / PDF sertifikat', 'file'], ['tautan_sertifikat', 'Tautan sertifikat', 'url']],
  beyond: [['nama', 'Nama hobi', 'text'], ['deskripsi', 'Deskripsi singkat', 'textarea'], ['gambar', 'Foto sampul hobi', 'file'], ['gallery', 'Galeri hobi (bisa beberapa foto)', 'files']]
};
function fieldMarkup([key, label, type, options], item) {
  const value = item[key] || '';
  if (type === 'textarea') return `<label>${label}<textarea name="${key}" required>${escapeHtml(value)}</textarea></label>`;
  if (type === 'optional-textarea') return `<label>${label}<textarea name="${key}" placeholder="Biarkan kosong bila belum tersedia.">${escapeHtml(value)}</textarea></label>`;
  if (type === 'optional-textarea') return `<label>${label}<textarea name="${key}" placeholder="Biarkan kosong bila belum tersedia.">${escapeHtml(value)}</textarea></label>`;
  if (type === 'select') return `<label>${label}<select name="${key}" required>${options.map(option => `<option ${option === value ? 'selected' : ''}>${option}</option>`).join('')}</select></label>`;
  if (type === 'checkbox') return `<label class="check"><input type="checkbox" name="${key}" ${item[key] ? 'checked' : ''}> ${label}</label>`;
  if (type === 'optional-url') return `<label>${label}<input type="url" name="${key}" value="${escapeHtml(value)}" placeholder="https://..."><small>Biarkan kosong bila belum ada.</small></label>`;
  if (type === 'optional-text') return `<label>${label}<input type="text" name="${key}" value="${escapeHtml(value)}" placeholder="HTML, CSS, JavaScript"><small>Pisahkan beberapa teknologi dengan koma.</small></label>`;
  if (type === 'files') return `<label>${label}<input type="file" name="${key}" accept="image/jpeg,image/png,image/webp" multiple><small>Pilih foto sebanyak yang diperlukan. Foto baru akan ditambahkan ke galeri lalu diunggah ke server saat disimpan.</small></label><div class="gallery-admin-preview" id="gallery-preview"></div>`;
  if (type === 'file') { const certificateFile = tab === 'certificates' && key === 'gambar'; const isPdf = certificateFile && item.gambar_tipe === 'application/pdf'; return `<label class="upload-field">${label}<span class="upload-dropzone"><input type="file" name="${key}" accept="${certificateFile ? 'image/jpeg,image/png,image/webp,application/pdf' : 'image/jpeg,image/png,image/webp'}"><span class="upload-icon">↑</span><b>${value ? 'Pilih file pengganti' : 'Pilih file atau jatuhkan di sini'}</b><small>${certificateFile ? 'JPG, PNG, WEBP, PDF · maks. 3 MB untuk PDF' : 'JPG, PNG, WEBP · maks. 4 MB'}</small></span><span class="single-file-preview">${value ? isPdf ? '<span class="pdf-preview">PDF tersimpan</span>' : `<img src="${escapeHtml(value)}" alt="Preview ${escapeHtml(label)}">` : ''}</span></label>`; }
  return `<label>${label}<input type="${type}" name="${key}" value="${escapeHtml(value)}" required></label>`;
}
function renderGalleryPreview() { const preview = $('#gallery-preview'); if (!preview) return; galleryPendingUrls.forEach(URL.revokeObjectURL); galleryPendingUrls = galleryPendingFiles.map(file => URL.createObjectURL(file)); const saved = galleryDraft.map((source, index) => `<figure><img src="${source}" alt="Foto galeri ${index + 1}"><button type="button" data-remove-gallery="${index}" aria-label="Hapus foto ${index + 1}">×</button></figure>`).join(''); const pending = galleryPendingUrls.map((source, index) => `<figure class="gallery-pending"><img src="${source}" alt="Foto baru ${index + 1}"><button type="button" data-remove-pending="${index}" aria-label="Batalkan foto baru ${index + 1}">×</button></figure>`).join(''); preview.innerHTML = saved || pending ? saved + pending : '<p>Belum ada foto galeri.</p>'; preview.querySelectorAll('[data-remove-gallery]').forEach(button => button.onclick = () => { galleryDraft.splice(Number(button.dataset.removeGallery), 1); renderGalleryPreview(); }); preview.querySelectorAll('[data-remove-pending]').forEach(button => button.onclick = () => { galleryPendingFiles.splice(Number(button.dataset.removePending), 1); renderGalleryPreview(); }); }
function drawForm(item = {}) { galleryDraft = Array.isArray(item.gallery) ? [...item.gallery] : []; galleryPendingFiles = []; $('#form-title').textContent = `${editingId ? 'Edit' : 'Tambah'} ${labels[tab]}`; const groups = tab === 'projects' ? { 0: 'Informasi proyek', 3: 'Cerita proyek', 8: 'Media & galeri', 11: 'Teknologi dan tautan', 15: 'Detail publikasi' } : tab === 'certificates' ? { 0: 'Informasi sertifikat', 3: 'Dokumen dan kredensial' } : tab === 'beyond' ? { 0: 'Informasi hobi', 2: 'Sampul & galeri' } : { 0: 'Informasi skill', 2: 'Logo skill' }; $('#form-fields').innerHTML = fieldSets[tab].map((field, index) => `${groups[index] ? `<p class="form-section-title">${groups[index]}</p>` : ''}${fieldMarkup(field, item)}`).join(''); renderGalleryPreview(); const galleryInput = document.querySelector('input[name="gallery"]'); if (galleryInput) galleryInput.onchange = () => { galleryPendingFiles = [...galleryPendingFiles, ...galleryInput.files]; renderGalleryPreview(); galleryInput.value = ''; }; document.querySelectorAll('.upload-dropzone input[type="file"]').forEach(input => { input.onchange = () => previewSingleFile(input); const zone = input.closest('.upload-dropzone'); zone.ondragover = event => { event.preventDefault(); zone.classList.add('is-dragging'); }; zone.ondragleave = () => zone.classList.remove('is-dragging'); zone.ondrop = event => { event.preventDefault(); zone.classList.remove('is-dragging'); if (event.dataTransfer.files.length) { input.files = event.dataTransfer.files; previewSingleFile(input); } }; }); }
function previewSingleFile(input) { const file = input.files?.[0]; const preview = input.closest('.upload-field')?.querySelector('.single-file-preview'); if (!preview || !file) return; const isPdf = file.type === 'application/pdf'; if (isPdf) { preview.innerHTML = '<span class="pdf-preview">PDF siap diunggah</span>'; return; } const source = URL.createObjectURL(file); preview.innerHTML = `<img src="${source}" alt="Preview ${escapeHtml(file.name)}">`; }
function itemTitle(item) { return item.nama_proyek || item.nama_sertifikat || item.nama; }
function itemMeta(item) { return item.kategori_id || item.penerbit || item.ikon || ''; }
function drawList() { const list = adminData[tab]; const query = ($('#list-search')?.value || '').trim().toLocaleLowerCase('id'); const filtered = list.filter(item => `${itemTitle(item)} ${itemMeta(item)} ${item.deskripsi_singkat || item.deskripsi || ''}`.toLocaleLowerCase('id').includes(query)); const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize)); listPage = Math.min(listPage, totalPages); const pageItems = filtered.slice((listPage - 1) * pageSize, listPage * pageSize); $('#list-count').textContent = `${filtered.length} item`; $('#list-caption').textContent = query ? `Hasil untuk “${escapeHtml(query)}”` : 'Semua data'; $('#admin-list').innerHTML = pageItems.length ? pageItems.map(item => { const image = item.thumbnail || item.gambar || ''; const galleryCount = Array.isArray(item.gallery) ? item.gallery.length : 0; return `<article class="admin-item"><div class="admin-item-main">${image && !(tab === 'certificates' && item.gambar_tipe === 'application/pdf') ? `<img class="admin-thumb" src="${escapeHtml(image)}" alt="" loading="lazy">` : `<span class="admin-thumb thumb-placeholder">${tab === 'projects' ? '▧' : tab === 'certificates' ? '▤' : tab === 'skills' ? '✳' : '♡'}</span>`}<div class="admin-item-copy"><b>${escapeHtml(itemTitle(item))}</b><span>${escapeHtml(itemMeta(item) || (tab === 'beyond' ? 'Hobi & galeri' : 'Belum ada kategori'))}${galleryCount ? ` · ${galleryCount} foto galeri` : ''}</span></div></div><div class="admin-item-actions"><button type="button" onclick="editItem(${item.id})">Edit</button><button type="button" class="delete-action" onclick="deleteItem(${item.id})">Hapus</button></div></article>`; }).join('') : `<div class="admin-empty"><span>${query ? '⌕' : '✦'}</span><b>${query ? 'Data tidak ditemukan' : 'Belum ada konten'}</b><small>${query ? 'Coba kata kunci lain.' : 'Tambahkan konten pertama menggunakan form di samping.'}</small></div>`; const pagination = $('#list-pagination'); pagination.innerHTML = filtered.length > pageSize ? `<span>Halaman ${listPage} dari ${totalPages}</span><div><button type="button" data-page="${listPage - 1}" ${listPage <= 1 ? 'disabled' : ''}>← Sebelumnya</button><button type="button" data-page="${listPage + 1}" ${listPage >= totalPages ? 'disabled' : ''}>Berikutnya →</button></div>` : ''; pagination.querySelectorAll('[data-page]').forEach(button => button.onclick = () => { listPage = Number(button.dataset.page); drawList(); }); }
function updateSummary() { $('#summary-projects').textContent = adminData.projects.length; $('#summary-certificates').textContent = adminData.certificates.length; $('#summary-skills').textContent = adminData.skills.length; $('#summary-photos').textContent = adminData.beyond.reduce((count, item) => count + (Array.isArray(item.gallery) ? item.gallery.length : 0), 0); const all = [...adminData.projects.map(item => ({ ...item, title: itemTitle(item), kind: 'Proyek', icon: '▧' })), ...adminData.certificates.map(item => ({ ...item, title: itemTitle(item), kind: 'Sertifikat', icon: '▤' })), ...adminData.skills.map(item => ({ ...item, title: itemTitle(item), kind: 'Skill', icon: '✳' })), ...adminData.beyond.map(item => ({ ...item, title: itemTitle(item), kind: 'Hobi', icon: '♡' }))].slice(-5).reverse(); $('#recent-count').textContent = `${all.length} item`; $('#recent-activity').innerHTML = all.length ? all.map(item => `<div class="recent-row"><span>${item.icon}</span><b>${escapeHtml(item.title)}</b><small>${item.kind}</small></div>`).join('') : '<p class="recent-empty">Konten yang kamu tambahkan akan muncul di sini.</p>'; }
function selectTab(nextTab) { tab = nextTab; editingId = null; listPage = 1; document.querySelectorAll('.tab').forEach(item => item.classList.toggle('active', item.dataset.tab === tab)); const dashboard = tab === 'dashboard'; $('#dashboard-view').hidden = !dashboard; $('#editor').hidden = dashboard; $('#page-title').textContent = dashboard ? 'Dashboard' : ({ projects: 'Kelola Proyek', certificates: 'Kelola Sertifikat', skills: 'Kelola Skills', beyond: 'Kelola Hobi & Galeri' }[tab]); if (!dashboard) { drawForm(); drawList(); } updateSummary(); $('#cms-sidebar').classList.remove('is-open'); $('#sidebar-scrim').classList.remove('is-visible'); }
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

function readOriginalFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Gagal membaca file.'));
    reader.readAsDataURL(file);
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
  pendingDeleteId = id;
  $('#delete-dialog').showModal();
};
async function confirmDelete() {
  const id = pendingDeleteId;
  if (id == null) return;
  const previous = adminData[tab];
  adminData[tab] = adminData[tab].filter(item => item.id !== id);
  $('#delete-confirm').disabled = true;
  try {
    await saveData(adminData, authToken);
  } catch (err) {
    adminData[tab] = previous; // rollback kalau gagal simpan
    showToast(err.message || 'Gagal menghapus item.', 'error');
    $('#delete-confirm').disabled = false;
    $('#delete-dialog').close();
    return;
  }
  $('#delete-confirm').disabled = false;
  $('#delete-dialog').close();
  pendingDeleteId = null;
  drawList();
  updateSummary();
  reset();
  showToast('Konten berhasil dihapus.');
}
function showToast(message, type = 'success') { const toast = $('#admin-toast'); toast.textContent = message; toast.className = `admin-toast is-visible ${type}`; clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3600); }

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
  document.querySelectorAll('.open-manager').forEach(button => button.onclick = () => selectTab('projects'));
  document.querySelectorAll('.open-certificates').forEach(button => button.onclick = () => selectTab('certificates'));
  document.querySelectorAll('.open-skills').forEach(button => button.onclick = () => selectTab('skills'));
  $('#list-search').oninput = () => { listPage = 1; drawList(); };
  $('#delete-confirm').onclick = confirmDelete;
  $('#delete-cancel').onclick = () => { pendingDeleteId = null; $('#delete-dialog').close(); };
  $('#delete-dialog').addEventListener('click', event => { if (event.target === $('#delete-dialog')) { pendingDeleteId = null; $('#delete-dialog').close(); } });
  $('#sidebar-collapse').onclick = () => { document.body.classList.toggle('sidebar-collapsed'); $('#sidebar-collapse').setAttribute('aria-label', document.body.classList.contains('sidebar-collapsed') ? 'Perluas sidebar' : 'Ciutkan sidebar'); };
  $('#mobile-menu').onclick = () => { $('#cms-sidebar').classList.add('is-open'); $('#sidebar-scrim').classList.add('is-visible'); };
  $('#sidebar-scrim').onclick = () => { $('#cms-sidebar').classList.remove('is-open'); $('#sidebar-scrim').classList.remove('is-visible'); };
  $('#logout').onclick = () => { localStorage.removeItem(AUTH_KEY); location.reload(); };

  $('#item-form').onsubmit = async event => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    const current = editingId ? adminData[tab].find(item => item.id === editingId) : {};
    const wasEditing = Boolean(editingId);
    const previousSnapshot = editingId ? JSON.parse(JSON.stringify(current)) : null;
    let pendingCreatedId = null;
    if (tab === 'projects') values.unggulan = form.elements.unggulan.checked;

    setFormBusy(true, 'Mengunggah gambar...');
    try {
      for (const key of ['thumbnail', 'banner', 'gambar']) {
        if (form.elements[key]) {
          const file = form.elements[key].files[0];
          if (file) {
            const isCertificatePdf = tab === 'certificates' && key === 'gambar' && file.type === 'application/pdf';
            if (isCertificatePdf && file.size > 3 * 1024 * 1024) throw new Error('Ukuran PDF sertifikat maksimal 3 MB.');
            if (!isCertificatePdf && file.size > 4 * 1024 * 1024) throw new Error('Ukuran gambar maksimal 4 MB.');
            if (!isCertificatePdf && !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Format gambar harus JPG, PNG, atau WEBP.');
            if (isCertificatePdf) values.gambar_tipe = 'application/pdf';
            else if (tab === 'certificates' && key === 'gambar') values.gambar_tipe = file.type;
            const dataUrl = isCertificatePdf ? await readOriginalFileAsDataUrl(file) : await readFileAsDataUrl(file);
            values[key] = await uploadImage(dataUrl, file.name);
          } else {
            values[key] = current[key] || '';
            if (tab === 'certificates') values.gambar_tipe = current.gambar_tipe || '';
          }
        }
      }

      if (form.elements.gallery) {
        const newUrls = galleryPendingFiles.length ? await uploadImages(galleryPendingFiles) : [];
        values.gallery = [...galleryDraft, ...newUrls];
      }

      let targetItem;
      if (editingId) {
        Object.assign(current, values);
        targetItem = current;
      } else {
        pendingCreatedId = Date.now();
        targetItem = { id: pendingCreatedId, ...values };
        adminData[tab].push(targetItem);
      }

      setFormBusy(true, 'Menyimpan data...');
      await saveData(adminData, authToken);
    } catch (err) {
      if (editingId && current) Object.assign(current, previousSnapshot);
      else if (pendingCreatedId != null) adminData[tab] = adminData[tab].filter(item => item.id !== pendingCreatedId);
      showToast(err.message || 'Terjadi kesalahan saat menyimpan.', 'error');
      setFormBusy(false);
      return;
    }

    setFormBusy(false);
    drawList();
    updateSummary();
    reset();
    showToast(wasEditing ? 'Perubahan berhasil disimpan.' : 'Konten berhasil ditambahkan.');
  };

  $('#cancel').onclick = reset;
}

async function bootAdminApp() {
  $('#login-screen').hidden = false;
  try {
    adminData = await getData();
  } catch (err) {
    showToast('Gagal memuat data dari server. Coba muat ulang halaman.', 'error');
    return;
  }
  initialiseApp();
}

const passwordToggle = $('#toggle-password');
if (passwordToggle) passwordToggle.onclick = () => {
  const input = $('#admin-password');
  const visible = input.type === 'text';
  input.type = visible ? 'password' : 'text';
  passwordToggle.textContent = visible ? 'Tampilkan' : 'Sembunyikan';
  passwordToggle.setAttribute('aria-label', visible ? 'Tampilkan password' : 'Sembunyikan password');
};
$('#login-form').onsubmit = async event => {
  event.preventDefault();
  const email = $('#admin-email').value.trim().toLowerCase();
  const password = $('#admin-password').value;
  const errorBox = $('#login-error');
  const submitButton = event.currentTarget.querySelector('button[type="submit"]');
  const submitLabel = submitButton?.querySelector('span');
  errorBox.textContent = ''; errorBox.classList.remove('success');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { errorBox.textContent = 'Masukkan alamat email yang valid.'; $('#admin-email').focus(); return; }
  if (!password) { errorBox.textContent = 'Masukkan password untuk melanjutkan.'; $('#admin-password').focus(); return; }
  if (submitButton) { submitButton.disabled = true; submitButton.classList.add('is-loading'); }
  if (submitLabel) submitLabel.textContent = 'Memeriksa akses…';
  const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ email, password }), signal: controller.signal, cache: 'no-store' });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw Object.assign(new Error(body.error || 'Server tidak dapat memproses login saat ini.'), { status: response.status });
    if (!body.token || !body.expires) throw new Error('Respons login tidak lengkap. Silakan coba lagi.');
    localStorage.setItem(AUTH_KEY, JSON.stringify({ token: body.token, expires: body.expires }));
    authToken = body.token; errorBox.textContent = 'Login berhasil. Membuka dashboard…'; errorBox.classList.add('success');
    await bootAdminApp();
  } catch (err) {
    if (err.name === 'AbortError') errorBox.textContent = 'Koneksi ke server terlalu lama. Periksa jaringan lalu coba lagi.';
    else if (err instanceof TypeError) errorBox.textContent = 'Tidak dapat terhubung ke server login. Coba muat ulang halaman atau periksa koneksi internet.';
    else if (err.status >= 500) errorBox.textContent = 'Server belum siap dikonfigurasi. Hubungi pemilik website untuk memeriksa pengaturan Vercel.';
    else errorBox.textContent = err.message || 'Login gagal. Periksa email dan password.';
  } finally {
    clearTimeout(timeout);
    if (submitButton) { submitButton.disabled = false; submitButton.classList.remove('is-loading'); }
    if (submitLabel) submitLabel.textContent = 'Log in';
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
