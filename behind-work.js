(() => {
  const media = window.ProjectMedia;
  const categories = ['All', 'Design Process', 'Coding Process', 'Photography Process', 'Video Production', 'Creative Activities', 'Workspace'];
  const labels = {
    id: { All: 'Semua dokumentasi', 'Design Process': 'Proses Desain', 'Coding Process': 'Proses Coding', 'Photography Process': 'Proses Fotografi', 'Video Production': 'Produksi Video', 'Creative Activities': 'Aktivitas Kreatif', Workspace: 'Ruang Kerja', count: n => `${n} dokumentasi`, empty: 'Belum ada dokumentasi yang diunggah.', emptyFilter: 'Belum ada dokumentasi pada kategori ini.', story: 'Cerita di balik aktivitas', process: 'Proses pengerjaan', tools: 'Tools yang digunakan', gallery: 'Dokumentasi tambahan', noStory: 'Belum ada cerita yang ditambahkan.', noProcess: 'Belum ada tahapan yang ditambahkan.' },
    en: { All: 'All documentation', 'Design Process': 'Design Process', 'Coding Process': 'Coding Process', 'Photography Process': 'Photography Process', 'Video Production': 'Video Production', 'Creative Activities': 'Creative Activities', Workspace: 'Workspace', count: n => `${n} entries`, empty: 'No documentation has been uploaded yet.', emptyFilter: 'No documentation in this category yet.', story: 'The story behind it', process: 'Process', tools: 'Tools used', gallery: 'More documentation', noStory: 'No story has been added yet.', noProcess: 'No process details have been added yet.' }
  };
  const gallery = document.querySelector('#behindGallery');
  if (!gallery || !media) return;
  const filters = document.querySelector('#behindFilters');
  const count = document.querySelector('#behindCount');
  const detail = document.querySelector('#activityDetail');
  const lightbox = document.querySelector('#activityLightbox');
  let entries = [];
  let activeCategory = 'All';
  let activeImages = [];
  let imageIndex = 0;

  const lang = () => localStorage.getItem('isma-portfolio-language') === 'en' ? 'en' : 'id';
  const t = key => labels[lang()][key];
  const esc = media.escapeHtml;
  const imagesFor = item => [...new Set([item.gambar, ...(Array.isArray(item.gallery) ? item.gallery : [])].map(media.imageUrl).filter(Boolean))];
  const sortDate = value => {
    const parsed = Date.parse(value || '');
    if (!Number.isNaN(parsed)) return parsed;
    const year = String(value || '').match(/\b(?:19|20)\d{2}\b/);
    return year ? new Date(Number(year[0]), 0, 1).getTime() : -Infinity;
  };
  const imageTag = (src, alt, className) => `<img class="${className}" src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async" data-project-image data-fallback="BT">`;

  function renderFilters() {
    filters.innerHTML = categories.map(category => `<button type="button" class="behind-filter${activeCategory === category ? ' active' : ''}" data-category="${esc(category)}" aria-pressed="${activeCategory === category}">${esc(category === 'All' ? t('All') : t(category))}</button>`).join('');
    filters.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => {
      activeCategory = button.dataset.category;
      renderFilters();
      renderGallery();
    }));
  }

  function renderGallery() {
    const visible = entries.filter(item => activeCategory === 'All' || item.category === activeCategory);
    count.textContent = t('count')(visible.length);
    if (!visible.length) {
      gallery.innerHTML = `<div class="behind-empty">${esc(entries.length ? t('emptyFilter') : t('empty'))}</div>`;
      return;
    }
    const sizes = ['size-feature', 'size-standard', 'size-tall', 'size-medium', 'size-half'];
    gallery.innerHTML = visible.map((item, index) => `<button type="button" class="behind-card ${sizes[index % sizes.length]}" data-entry-id="${esc(item.id)}" aria-label="${esc(item.title)}">
      ${imageTag(item.images[0], item.title, 'behind-card-image')}
      <span class="behind-card-copy"><span class="behind-card-meta"><span class="behind-card-category">${esc(t(item.category) || item.category)}</span>${item.date ? `<time>${esc(item.date)}</time>` : ''}</span><strong>${esc(item.title)}</strong>${item.caption ? `<span class="behind-card-caption">${esc(item.caption)}</span>` : ''}</span>
    </button>`).join('');
    gallery.querySelectorAll('[data-entry-id]').forEach(button => button.addEventListener('click', () => openEntry(button.dataset.entryId)));
    window.observePortfolioReveals?.([gallery]);
  }

  function openEntry(id) {
    const item = entries.find(entry => String(entry.id) === String(id));
    if (!item) return;
    activeImages = item.images;
    const tools = item.tools ? String(item.tools).split(/[,\n]/).map(value => value.trim()).filter(Boolean) : [];
    document.querySelector('#activityContent').innerHTML = `<div class="activity-dialog-heading"><span class="behind-card-category">${esc(t(item.category) || item.category)}</span><h2 id="activityTitle">${esc(item.title)}</h2><p class="activity-dialog-date">${esc(item.date || '')}</p><p class="activity-dialog-caption">${esc(item.caption || '')}</p></div>
      <div class="activity-detail-grid"><div>${imageTag(item.images[0], item.title, 'activity-feature-image')}${item.images.length > 1 ? `<h3 class="activity-gallery-heading">${esc(t('gallery'))}</h3><div class="activity-gallery">${item.images.slice(1).map((src, index) => `<button type="button" class="activity-gallery-button" data-extra-image="${index + 1}" aria-label="Dokumentasi ${index + 2}">${imageTag(src, `${item.title} ${index + 2}`, '')}</button>`).join('')}</div>` : ''}</div>
      <div class="activity-detail-copy"><section><h3>${esc(t('story'))}</h3><p>${esc(item.story || t('noStory'))}</p></section><section><h3>${esc(t('process'))}</h3><p>${esc(item.process || t('noProcess'))}</p></section>${tools.length ? `<section><h3>${esc(t('tools'))}</h3><div class="activity-tools">${tools.map(tool => `<span>${esc(tool)}</span>`).join('')}</div></section>` : ''}</div></div>
      `;
    document.querySelector('#activityContent .activity-feature-image').addEventListener('click', () => openLightbox(0));
    document.querySelectorAll('[data-extra-image]').forEach(button => button.addEventListener('click', () => openLightbox(Number(button.dataset.extraImage))));
    detail.showModal();
    window.observePortfolioReveals?.([document.querySelector('#activityContent')]);
  }

  function updateLightbox() {
    const image = document.querySelector('#lightboxImage');
    image.src = activeImages[imageIndex];
    image.alt = `${entries.find(item => item.images.includes(activeImages[imageIndex]))?.title || 'Dokumentasi'} — ${imageIndex + 1}`;
    document.querySelector('#lightboxPosition').textContent = `${imageIndex + 1} / ${activeImages.length}`;
    document.querySelector('#lightboxPrevious').disabled = activeImages.length < 2;
    document.querySelector('#lightboxNext').disabled = activeImages.length < 2;
  }
  function openLightbox(index) { imageIndex = index; updateLightbox(); lightbox.showModal(); }
  function moveImage(delta) { if (!activeImages.length) return; imageIndex = (imageIndex + delta + activeImages.length) % activeImages.length; updateLightbox(); }
  document.querySelector('#activityClose').addEventListener('click', () => detail.close());
  detail.addEventListener('click', event => { if (event.target === detail) detail.close(); });
  document.querySelector('#lightboxClose').addEventListener('click', () => lightbox.close());
  document.querySelector('#lightboxPrevious').addEventListener('click', () => moveImage(-1));
  document.querySelector('#lightboxNext').addEventListener('click', () => moveImage(1));
  lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
  document.addEventListener('keydown', event => { if (!lightbox.open) return; if (event.key === 'ArrowLeft') moveImage(-1); if (event.key === 'ArrowRight') moveImage(1); });
  let touchStartX = null;
  lightbox.addEventListener('touchstart', event => { touchStartX = event.changedTouches[0]?.clientX ?? null; }, { passive: true });
  lightbox.addEventListener('touchend', event => { const endX = event.changedTouches[0]?.clientX; if (touchStartX !== null && Number.isFinite(endX) && Math.abs(endX - touchStartX) > 45) moveImage(endX < touchStartX ? 1 : -1); touchStartX = null; }, { passive: true });
  document.querySelector('#behindYear').textContent = new Date().getFullYear();
  window.addEventListener('storage', event => { if (event.key === 'isma-portfolio-language') { renderFilters(); renderGallery(); } });
  document.querySelector('.language-toggle').addEventListener('click', () => window.setTimeout(() => { renderFilters(); renderGallery(); }, 0));

  getData().then(data => {
    entries = (Array.isArray(data.behindWork) ? data.behindWork : []).map((item, index) => ({
      ...item,
      id: item.id ?? index,
      title: String(item.title || '').trim(),
      category: String(item.category || '').trim(),
      images: imagesFor(item),
    })).filter(item => item.title && item.category && item.images.length).sort((a, b) => sortDate(b.date) - sortDate(a.date));
    renderFilters();
    renderGallery();
  }).catch(() => { entries = []; renderFilters(); renderGallery(); });
})();
