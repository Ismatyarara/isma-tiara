(function () {
  const escapeHtml = value => String(value ?? '').replace(/[&<>\"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));

  function slugify(value) {
    return String(value ?? '')
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function projectSlug(project) {
    return slugify(project?.slug || project?.nama_proyek) || `project-${project?.id ?? 'detail'}`;
  }

  function imageUrl(source) {
    const value = String(source ?? '').trim();
    if (!value) return '';
    if (/^(https?:\/\/|\/\/|data:image\/|blob:)/i.test(value)) return value;
    return `/${value.replace(/^(\.\/|\/)+/, '')}`;
  }

  function initials(project) {
    return String(project?.nama_proyek || 'PR')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(word => word[0] || '')
      .join('')
      .toUpperCase() || 'PR';
  }

  function cardCover(project) {
    return project?.thumbnail || project?.banner || project?.gallery?.[0] || '';
  }

  function detailCover(project) {
    return project?.banner || project?.thumbnail || project?.gallery?.[0] || '';
  }

  function galleryImages(project) {
    const values = [detailCover(project), project?.banner, project?.thumbnail, ...(Array.isArray(project?.gallery) ? project.gallery : [])];
    const seen = new Set();
    return values.map(imageUrl).filter(value => {
      if (!value || seen.has(value)) return false;
      seen.add(value);
      return true;
    });
  }

  function imageMarkup(source, alt, fallback, className) {
    const url = imageUrl(source);
    if (!url) return `<span class="project-placeholder ${className || ''}" role="img" aria-label="${escapeHtml(alt)}">${escapeHtml(fallback)}</span>`;
    return `<img class="${className || ''}" src="${escapeHtml(url)}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async" data-project-image data-fallback="${escapeHtml(fallback)}">`;
  }

  document.addEventListener('error', event => {
    const image = event.target;
    if (!(image instanceof HTMLImageElement) || !image.hasAttribute('data-project-image')) return;
    const fallback = document.createElement('span');
    fallback.className = `${image.className} project-placeholder`.trim();
    fallback.setAttribute('role', 'img');
    fallback.setAttribute('aria-label', image.alt || 'Gambar proyek tidak tersedia');
    fallback.textContent = image.dataset.fallback || 'PR';
    image.replaceWith(fallback);
  }, true);

  window.ProjectMedia = { escapeHtml, slugify, projectSlug, imageUrl, initials, cardCover, detailCover, galleryImages, imageMarkup };
})();
