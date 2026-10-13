(async () => {
  const $ = selector => document.querySelector(selector);
  const esc = ProjectMedia.escapeHtml;
  const slug = ProjectMedia.slugify;
  const data = await getData();
  const list = $('#certificate-list');
  const detail = $('#certificate-detail');
  const pdfUrl = value => /\.pdf(?:$|[?#])/i.test(String(value || ''));
  const sourceFor = certificate => certificate.gambar || (pdfUrl(certificate.tautan_sertifikat) ? certificate.tautan_sertifikat : '');
  const seg = location.pathname.split('/').filter(Boolean);
  const wanted = new URLSearchParams(location.search).get('slug') || (seg[0] === 'certificates' ? seg[1] : '');
  const records = data.certificates || [];
  const item = records.find(record => slug(record.slug || record.nama_sertifikat) === slug(wanted));
  const openPreview = source => {
    const dialog = $('#image-preview');
    $('#preview-image').src = ProjectMedia.imageUrl(source);
    dialog.showModal();
  };
  $('#image-preview .dialog-close').onclick = () => $('#image-preview').close();
  $('#image-preview').onclick = event => { if (event.target === $('#image-preview')) $('#image-preview').close(); };
  if (item) {
    $('#page-intro').hidden = true;
    list.hidden = true;
    detail.hidden = false;
    const source = sourceFor(item);
    const pdf = source && (item.gambar_tipe === 'application/pdf' || pdfUrl(source));
    const renderFile = !source
      ? '<div class="file-missing" role="status"><b>File sertifikat belum tersedia.</b><span>Tambahkan gambar atau PDF melalui Admin → Sertifikat.</span></div>'
      : pdf
        ? `<div class="document-frame"><iframe title="Dokumen ${esc(item.nama_sertifikat)}" src="${esc(ProjectMedia.imageUrl(source))}"></iframe><a class="action-link" href="${esc(ProjectMedia.imageUrl(source))}" target="_blank" rel="noopener noreferrer">Buka PDF di tab baru ↗</a></div>`
        : `<button class="certificate-image-button" type="button" aria-label="Perbesar ${esc(item.nama_sertifikat)}">${ProjectMedia.imageMarkup(source, item.nama_sertifikat, 'File sertifikat tidak dapat dimuat', 'certificate-image')}</button>`;
    detail.innerHTML = `<a class="back-link" href="/certificates.html">← Semua sertifikat</a><p class="eyebrow">${esc(item.penerbit || 'Certificate')}</p><h1>${esc(item.nama_sertifikat)}</h1><div class="certificate-layout"><div class="certificate-view">${renderFile}</div><aside class="certificate-info"><p class="eyebrow">Detail</p><h2>${esc(item.nama_sertifikat)}</h2><dl><div><dt>Penerbit</dt><dd>${esc(item.penerbit || 'Belum dicantumkan')}</dd></div><div><dt>Tahun</dt><dd>${esc(item.tahun || 'Belum dicantumkan')}</dd></div></dl>${item.tautan_sertifikat && item.tautan_sertifikat !== source ? `<a class="action-link" href="${esc(item.tautan_sertifikat)}" target="_blank" rel="noopener noreferrer">Buka kredensial ↗</a>` : ''}</aside></div>`;
    const imageButton = detail.querySelector('.certificate-image-button');
    if (imageButton) imageButton.onclick = () => openPreview(source);
  } else {
    list.innerHTML = records.length ? records.map(certificate => {
      const source = sourceFor(certificate);
      const image = source && !(certificate.gambar_tipe === 'application/pdf' || pdfUrl(source));
      return `<a class="detail-card" href="/certificates/${encodeURIComponent(slug(certificate.slug || certificate.nama_sertifikat))}"><div class="card-media">${image ? ProjectMedia.imageMarkup(source, certificate.nama_sertifikat, 'Sertifikat', 'card-image') : `<span class="document-placeholder">${source ? 'PDF' : '✦'}</span>`}</div><div class="card-content"><span class="eyebrow">${esc(certificate.penerbit || 'Certificate')}</span><h2>${esc(certificate.nama_sertifikat)}</h2><p>${esc(certificate.tahun || '')}</p><span class="card-cta">Lihat Sertifikat ↗</span></div></a>`;
    }).join('') : '<p class="empty-state">Belum ada sertifikat.</p>';
  }
})();
