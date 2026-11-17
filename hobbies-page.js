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
  const coverFor = record => ProjectMedia.imageUrl(record.gambar || '');
  const photos = record => {
    const cover = coverFor(record);
    return [...new Set((Array.isArray(record.gallery) ? record.gallery : []).map(ProjectMedia.imageUrl).filter(source => source && source !== cover))];
  };
  const dialog = $('#image-preview');
  const previewImage = $('#preview-image');
  let activePhoto = 0;
  let activePhotos = [];
  const showPhoto = index => {
    if (!activePhotos.length) return;
    activePhoto = (index + activePhotos.length) % activePhotos.length;
    previewImage.src = activePhotos[activePhoto];
    previewImage.alt = `${item?.nama || 'Aktivitas'}, foto ${activePhoto + 1}`;
    $('.dialog-counter').textContent = `${String(activePhoto + 1).padStart(2, '0')} / ${String(activePhotos.length).padStart(2, '0')}`;
    $('.dialog-prev').disabled = activePhotos.length < 2;
    $('.dialog-next').disabled = activePhotos.length < 2;
  };
  $('#image-preview .dialog-close').onclick = () => dialog.close();
  dialog.onclick = event => { if (event.target === dialog) dialog.close(); };
  $('.dialog-prev').onclick = () => showPhoto(activePhoto - 1);
  $('.dialog-next').onclick = () => showPhoto(activePhoto + 1);
  $('.dialog-prev').disabled = true;
  $('.dialog-next').disabled = true;
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    showPhoto(activePhoto + (event.key === 'ArrowRight' ? 1 : -1));
  });
  let touchStartX = 0;
  previewImage.addEventListener('touchstart', event => { touchStartX = event.changedTouches[0]?.clientX || 0; }, { passive: true });
  previewImage.addEventListener('touchend', event => {
    const endX = event.changedTouches[0]?.clientX || touchStartX;
    if (Math.abs(endX - touchStartX) > 45) showPhoto(activePhoto + (endX < touchStartX ? 1 : -1));
  }, { passive: true });
  if (item) {
    $('#page-intro').hidden = true;
    list.hidden = true;
    detail.hidden = false;
    const images = photos(item);
    activePhotos = images;
    const cover = coverFor(item);
    detail.innerHTML = `<a class="back-link" href="/hobbies.html">← Semua hobi</a><div class="hobby-heading">${cover ? ProjectMedia.imageMarkup(cover, item.nama, item.nama.slice(0, 2), 'hobby-cover-image') : `<div class="hobby-cover-fallback">${esc(item.nama.slice(0, 2))}</div>`}<div><p class="eyebrow">My little world</p><h1>${esc(item.nama)}</h1><p class="lead">${esc(item.deskripsi || 'Koleksi aktivitas dan momen yang saya nikmati.')}</p></div></div><section class="activity-gallery"><div class="gallery-heading"><div><p class="eyebrow">Gallery</p><h2>Moments &amp; activities</h2></div><span>${images.length} foto</span></div><div class="photo-grid">${images.length ? images.map((source, index) => `<button class="activity-photo" type="button" data-photo="${index}" aria-label="Perbesar foto ${index + 1}">${ProjectMedia.imageMarkup(source, `${item.nama}, foto ${index + 1}`, item.nama, 'gallery-photo-image')}</button>`).join('') : '<p class="empty-state">Belum ada foto aktivitas. Foto dapat ditambahkan dari Admin → Hobi.</p>'}</div></section>`;
    detail.querySelectorAll('[data-photo]').forEach(button => button.onclick = () => { showPhoto(Number(button.dataset.photo)); dialog.showModal(); });
  } else {
    list.innerHTML = records.length ? records.map((record, index) => {
      const image = coverFor(record);
      return `<a class="detail-card hobby-card" href="/hobbies/${encodeURIComponent(slug(record.slug || record.nama))}"><div class="card-media">${image ? ProjectMedia.imageMarkup(image, record.nama, record.nama.slice(0, 2), 'card-image') : `<span class="document-placeholder">${esc(['📷', '♫', '📖', '✦'][index % 4])}</span>`}</div><div class="card-content"><span class="eyebrow">My little world</span><h2>${esc(record.nama)}</h2><p>${esc(record.deskripsi || '')}</p><span class="card-cta">Lihat Detail →</span></div></a>`;
    }).join('') : '<p class="empty-state">Belum ada hobi.</p>';
  }
})();
