(async function () {
  const data = await getData();
  const media = window.ProjectMedia;
  const $ = selector => document.querySelector(selector);
  const list = $('#projectList');
  const detail = $('#projectDetail');
  const browse = $('#projectBrowse');
  const tools = $('#projectTools');
  const safeExternalUrl = value => {
    try {
      const url = new URL(String(value || ''));
      return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
    } catch { return ''; }
  };
  const technologies = project => {
    const value = project.teknologi ?? project.technologies ?? [];
    const items = Array.isArray(value) ? value : String(value).split(/[,;|]/);
    return items.map(item => String(item).trim()).filter(Boolean);
  };
  const projectPath = location.pathname.split('/').filter(Boolean);
  const wanted = new URLSearchParams(location.search).get('slug') || (projectPath[0] === 'projects' ? projectPath[1] : '');
  let requestedSlug = wanted;
  try { requestedSlug = decodeURIComponent(wanted); } catch { /* malformed URL will show the not-found state */ }
  const selected = wanted ? data.projects.find(project => media.projectSlug(project) === media.slugify(requestedSlug)) : null;
  const esc = media.escapeHtml;

  function mediaElement(project, source, alt, className) {
    return media.imageMarkup(source, alt, media.initials(project), className);
  }

  function browseProjects() {
    const projects = Array.isArray(data.projects) ? data.projects : [];
    if (!projects.length) {
      tools.hidden = true;
      list.innerHTML = '<p class="projects-empty">Belum ada proyek untuk ditampilkan.</p>';
      return;
    }
    let category = 'Semua';
    const categories = ['Semua', ...new Set(projects.map(project => project.kategori_id).filter(Boolean))];
    tools.innerHTML = `<input class="project-search" id="projectSearch" type="search" placeholder="Cari proyek…" aria-label="Cari proyek">${categories.map(value => `<button class="project-filter ${value === category ? 'active' : ''}" type="button" data-category="${esc(value)}" aria-pressed="${value === category}">${esc(value)}</button>`).join('')}`;

    const draw = () => {
      const query = $('#projectSearch').value.trim().toLocaleLowerCase();
      const rows = projects.filter(project => (category === 'Semua' || project.kategori_id === category) && `${project.nama_proyek || ''} ${project.deskripsi_singkat || ''}`.toLocaleLowerCase().includes(query));
      list.innerHTML = rows.map(project => {
        const slug = media.projectSlug(project);
        return `<a class="project-list-card" href="/projects/${encodeURIComponent(slug)}" aria-label="Buka detail ${esc(project.nama_proyek || 'proyek')}">
          <div class="project-list-media">${mediaElement(project, media.cardCover(project), `Foto ${project.nama_proyek || 'proyek'}`, '')}</div>
          <div class="project-list-body"><span class="project-tag">${esc(project.kategori_id || 'Project')}</span><h2>${esc(project.nama_proyek || 'Proyek')}</h2><p>${esc(project.deskripsi_singkat || 'Pilih untuk melihat detail proyek.')}</p><span class="project-more">Lihat detail proyek <span aria-hidden="true">→</span></span></div>
        </a>`;
      }).join('') || '<p class="projects-empty">Tidak ada proyek yang cocok dengan pencarian.</p>';
    };
    draw();
    $('#projectSearch').addEventListener('input', draw);
    tools.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => {
      category = button.dataset.category;
      tools.querySelectorAll('[data-category]').forEach(item => {
        const active = item.dataset.category === category;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      draw();
    }));
  }

  function detailProject(project) {
    browse.hidden = true;
    tools.hidden = true;
    list.hidden = true;
    detail.hidden = false;
    const images = media.galleryImages(project);
    const cover = media.detailCover(project);
    const tech = technologies(project);
    const demo = safeExternalUrl(project.demo_url);
    const github = safeExternalUrl(project.github_url);
    document.title = `${project.nama_proyek || 'Proyek'} — Isma Tiara Zalianti`;
    const duration = project.durasi || '—';
    const yearStatus = [project.tahun, project.status].filter(Boolean).join(' · ') || '—';
    detail.innerHTML = `<a class="project-back" href="/projects.html"><span aria-hidden="true">←</span> Kembali ke semua proyek</a>
      <p class="detail-meta">${esc(project.kategori_id || 'Project')}${project.tahun ? ` · ${esc(project.tahun)}` : ''}</p>
      <h1 class="detail-title">${esc(project.nama_proyek || 'Proyek')}</h1>
      <p class="detail-lead">${esc(project.deskripsi_singkat || '')}</p>
      <div class="detail-layout">
        <div>
          <div class="detail-cover">${mediaElement(project, cover, `Sampul ${project.nama_proyek || 'proyek'}`, '')}</div>
          ${images.length ? `<section class="detail-gallery" aria-labelledby="galleryTitle"><h2 id="galleryTitle">Galeri proyek</h2><div class="gallery-grid">${images.map((source, index) => `<button class="gallery-item" type="button" data-image-index="${index}" aria-label="Perbesar foto ${index + 1} dari ${esc(project.nama_proyek || 'proyek')}">${media.imageMarkup(source, `${project.nama_proyek || 'Proyek'} — foto ${index + 1}`, media.initials(project), '')}</button>`).join('')}</div></section>` : ''}
        </div>
        <aside>
          <section class="detail-copy"><h2>Tentang proyek</h2><p>${esc(project.deskripsi_lengkap || project.deskripsi_singkat || 'Deskripsi proyek belum ditambahkan.')}</p></section>
          <section class="detail-facts" aria-label="Informasi proyek">
            <div class="detail-fact"><b>Kategori</b><span>${esc(project.kategori_id || '—')}</span></div>
            <div class="detail-fact"><b>Tahun & status</b><span>${esc(yearStatus)}</span></div>
            <div class="detail-fact"><b>Durasi</b><span>${esc(duration)}</span></div>
            <div class="detail-fact"><b>Teknologi</b>${tech.length ? `<div class="technology-list">${tech.map(item => `<span>${esc(item)}</span>`).join('')}</div>` : '<span>Belum ditambahkan.</span>'}</div>
            ${(demo || github) ? `<div class="detail-links">${demo ? `<a href="${esc(demo)}" target="_blank" rel="noopener noreferrer">Lihat demo ↗</a>` : ''}${github ? `<a class="secondary" href="${esc(github)}" target="_blank" rel="noopener noreferrer">Kode di GitHub ↗</a>` : ''}</div>` : ''}
          </section>
        </aside>
      </div>`;
    detail.querySelectorAll('[data-image-index]').forEach(button => button.addEventListener('click', () => {
      const image = images[Number(button.dataset.imageIndex)];
      const lightbox = $('#projectLightbox');
      const lightboxImage = $('#lightboxImage');
      lightboxImage.src = image;
      lightboxImage.alt = `${project.nama_proyek || 'Proyek'} — foto ${Number(button.dataset.imageIndex) + 1}`;
      lightbox.showModal();
    }));
  }

  $('#projectYear').textContent = new Date().getFullYear();
  $('#lightboxClose').addEventListener('click', () => $('#projectLightbox').close());
  $('#projectLightbox').addEventListener('click', event => {
    if (event.target === $('#projectLightbox')) $('#projectLightbox').close();
  });
  if (selected) detailProject(selected);
  else if (wanted) {
    browse.hidden = true;
    tools.hidden = true;
    list.hidden = true;
    detail.hidden = false;
    document.title = 'Proyek tidak ditemukan — Isma Tiara Zalianti';
    detail.innerHTML = `<section class="projects-empty"><h1>Proyek tidak ditemukan</h1><p>Proyek ini mungkin sudah dihapus atau tautannya berubah.</p><a class="project-back" href="/projects.html">← Kembali ke semua proyek</a></section>`;
  } else browseProjects();
})();
