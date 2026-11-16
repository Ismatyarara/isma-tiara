(function () {
  const media = window.ProjectMedia;
  const escape = media.escapeHtml;
  const technologies = project => {
    const value = project.teknologi ?? project.technologies ?? [];
    return (Array.isArray(value) ? value : String(value).split(/[,;|]/)).map(item => String(item).trim()).filter(Boolean);
  };
  const coverMarkup = (project, source) => source
    ? media.imageMarkup(source, `Sampul ${project.nama_proyek || 'proyek'}`, '', 'project-image motion-reveal-image')
    : `<div class="project-media-empty" role="img" aria-label="Sampul ${escape(project.nama_proyek || 'proyek')} belum diunggah"><span>Sampul proyek belum diunggah</span></div>`;
  window.renderProjectCards = function (projects) {
    if (!Array.isArray(projects) || !projects.length) return '<p class="empty">Belum ada proyek.</p>';
    const language = localStorage.getItem('isma-portfolio-language') === 'en' ? 'en' : 'id';
    return projects.map((project, index) => {
      const title = escape(project.nama_proyek || 'Proyek');
      const category = escape(project.kategori_id || 'Project');
      const summary = escape(project.deskripsi_singkat || 'Buka untuk melihat detail proyek.');
      const href = `/projects/${encodeURIComponent(media.projectSlug(project))}`;
      const cover = media.cardCover(project);
      const galleryCount = media.galleryImages(project).length;
      const tech = technologies(project);
      const action = language === 'en' ? 'View project' : 'Lihat detail';
      return `<a class="project project-link motion-reveal" href="${href}" aria-label="${language === 'en' ? 'View project details for' : 'Lihat detail proyek'} ${title}" style="--project-order:${index}">
        <div class="project-media project-editorial-media">${coverMarkup(project, cover)}${galleryCount > 1 ? `<span class="project-image-count">${galleryCount} ${language === 'en' ? 'images' : 'gambar'} <i aria-hidden="true">↗</i></span>` : ''}</div>
        <div class="project-body"><div class="project-card-meta"><span class="tag">${category}</span>${project.tahun ? `<span class="project-year">${escape(project.tahun)}</span>` : ''}</div><h3>${title}</h3><p>${summary}</p>${tech.length ? `<div class="project-tech-list" aria-label="${language === 'en' ? 'Technologies' : 'Teknologi'}">${tech.slice(0, 4).map(item => `<span>${escape(item)}</span>`).join('')}</div>` : ''}<span class="project-more"><span data-language-id="Lihat detail" data-language-en="View project">${action}</span><i aria-hidden="true">↗</i></span></div>
      </a>`;
    }).join('');
  };
})();