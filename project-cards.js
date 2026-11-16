(function () {
  const media = window.ProjectMedia;
  const escape = media.escapeHtml;
  const technologies = project => {
    const value = project.teknologi ?? project.technologies ?? [];
    return (Array.isArray(value) ? value : String(value).split(/[,;|]/)).map(item => String(item).trim()).filter(Boolean);
  };
  const coverMarkup = (project, source) => source
    ? `<div class="project-laptop" aria-label="Preview ${escape(project.nama_proyek || 'proyek')}"><div class="project-laptop-screen">${media.imageMarkup(source, `Screenshot ${project.nama_proyek || 'proyek'}`, '', 'project-image motion-reveal-image')}</div><span class="project-laptop-camera" aria-hidden="true"></span></div>`
    : `<div class="project-laptop project-laptop-empty" role="img" aria-label="Sampul ${escape(project.nama_proyek || 'proyek')} belum diunggah"><div class="project-laptop-screen"><span>Sampul proyek belum diunggah</span></div></div>`;
  window.renderProjectCards = function (projects) {
    if (!Array.isArray(projects) || !projects.length) return '<p class="empty">Belum ada proyek.</p>';
    const language = localStorage.getItem('isma-portfolio-language') === 'en' ? 'en' : 'id';
    return projects.map((project, index) => {
      const title = escape(project.nama_proyek || 'Proyek');
      const category = escape(project.kategori_id || 'Project');
      const summary = escape(String(project.deskripsi_singkat || 'Buka untuk melihat detail proyek.').replace(/\*\*(.*?)\*\*/g, '$1').replace(/[*_`#]/g, '').replace(/\s+/g, ' ').trim());
      const href = `/projects/${encodeURIComponent(media.projectSlug(project))}`;
      const cover = media.cardCover(project);
      const galleryCount = media.galleryImages(project).length;
      const tech = technologies(project);
      const action = language === 'en' ? 'View project' : 'Lihat detail';
      return `<a class="project project-link motion-reveal" href="${href}" aria-label="${language === 'en' ? 'View project details for' : 'Lihat detail proyek'} ${title}" style="--project-order:${index}">
        <div class="project-media project-editorial-media"><div class="project-laptop-stage">${coverMarkup(project, cover)}</div>${galleryCount > 1 ? `<span class="project-image-count">${galleryCount} ${language === 'en' ? 'images' : 'gambar'} <i aria-hidden="true">↗</i></span>` : ''}</div>
        <div class="project-body"><div class="project-card-meta"><span class="tag">${category}</span>${project.tahun ? `<span class="project-year">${escape(project.tahun)}</span>` : ''}</div><h3>${title}</h3><p>${summary}</p>${tech.length ? `<div class="project-tech-list" aria-label="${language === 'en' ? 'Technologies' : 'Teknologi'}">${tech.slice(0, 4).map(item => `<span>${escape(item)}</span>`).join('')}</div>` : ''}<span class="project-more"><span data-language-id="Lihat detail" data-language-en="View project">${action}</span><i aria-hidden="true">↗</i></span></div>
      </a>`;
    }).join('');
  };
})();
