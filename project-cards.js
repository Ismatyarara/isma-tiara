(function () {
  const media = window.ProjectMedia;
  window.renderProjectCards = function (projects) {
    if (!Array.isArray(projects) || !projects.length) return '<p class="empty">Belum ada proyek.</p>';
    return projects.map(project => {
      const title = media.escapeHtml(project.nama_proyek || 'Proyek');
      const category = media.escapeHtml(project.kategori_id || 'Project');
      const summary = media.escapeHtml(project.deskripsi_singkat || 'Buka untuk melihat detail proyek.');
      const href = `/projects/${encodeURIComponent(media.projectSlug(project))}`;
      return `<a class="panel project project-link" href="${href}" aria-label="Lihat detail proyek ${title}">
        <div class="project-media">${media.imageMarkup(media.cardCover(project), project.nama_proyek || 'Foto proyek', media.initials(project), 'project-image')}</div>
        <div class="project-body"><span class="tag">${category}</span><h3>${title}</h3><p>${summary}</p><span class="project-more">Lihat detail <span aria-hidden="true">→</span></span></div>
      </a>`;
    }).join('');
  };
})();
