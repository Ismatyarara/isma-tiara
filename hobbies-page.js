(async () => {
  const $ = selector => document.querySelector(selector);
  const esc = ProjectMedia.escapeHtml;
  const slug = ProjectMedia.slugify;
  const data = await getData();
  const list = $('#hobby-list');
  const detail = $('#hobby-detail');
  const records = data.beyond || [];
  const seg = location.pathname.split('/').filter(Boolean);
  const wanted = new URLSearchParams(location.search).get('slug') || (seg[0] === 'hobbies' ? seg[1] : '');
  const item = records.find(record => slug(record.slug || record.nama) === slug(wanted));
  const photos = record => [...new Set([record.gambar, ...(Array.isArray(record.gallery) ? record.gallery : [])].map(ProjectMedia.imageUrl).filter(Boolean))];
  const dialog = $('#image-preview');
  $('#image-preview .dialog-close').onclick = () => dialog.close();
  dialog.onclick = event => { if (event.target === dialog) dialog.close(); };
  if (item) {
    $('#page-intro').hidden = true;
    list.hidden = true;
    detail.hidden = false;
    const images = photos(item);
    const cover = images[0];
    detail.innerHTML = `<a class="back-link" href="/hobbies.html">← Semua hobi</a><div class="hobby-heading">${cover ? ProjectMedia.imageMarkup(cover, item.nama, item.nama.slice(0, 2), 'hobby-cover-image') : `<div class="hobby-cover-fallback">${esc(item.nama.slice(0, 2))}</div>`}<div><p class="eyebrow">My little world</p><h1>${esc(item.nama)}</h1><p class="lead">${esc(item.deskripsi || 'Koleksi aktivitas dan momen yang saya nikmati.')}</p></div></div><section class="activity-gallery"><div class="gallery-heading"><div><p class="eyebrow">Gallery</p><h2>Moments &amp; activities</h2></div><span>${images.length} foto</span></div><div class="photo-grid">${images.length ? images.map((source, index) => `<button class="activity-photo" type="button" data-photo="${index}" aria-label="Perbesar foto ${index + 1}">${ProjectMedia.imageMarkup(source, `${item.nama}, foto ${index + 1}`, item.nama, 'gallery-photo-image')}</button>`).join('') : '<p class="empty-state">Belum ada foto aktivitas. Foto dapat ditambahkan dari Admin → Hobi.</p>'}</div></section>`;
    detail.querySelectorAll('[data-photo]').forEach(button => button.onclick = () => { const image = $('#preview-image'); image.src = images[Number(button.dataset.photo)]; image.alt = `${item.nama}, foto ${Number(button.dataset.photo) + 1}`; dialog.showModal(); });
  } else {
    list.innerHTML = records.length ? records.map((record, index) => {
      const image = photos(record)[0];
      return `<a class="detail-card hobby-card" href="/hobbies/${encodeURIComponent(slug(record.slug || record.nama))}"><div class="card-media">${image ? ProjectMedia.imageMarkup(image, record.nama, record.nama.slice(0, 2), 'card-image') : `<span class="document-placeholder">${esc(['📷', '♫', '📖', '✦'][index % 4])}</span>`}</div><div class="card-content"><span class="eyebrow">My little world</span><h2>${esc(record.nama)}</h2><p>${esc(record.deskripsi || '')}</p><span class="card-cta">Lihat Detail →</span></div></a>`;
    }).join('') : '<p class="empty-state">Belum ada hobi.</p>';
  }
})();
