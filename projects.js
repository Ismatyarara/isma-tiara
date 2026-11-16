(async function () {
  const data = await getData();
  const media = window.ProjectMedia;
  const $ = selector => document.querySelector(selector);
  const list = $('#projectList');
  const detail = $('#projectDetail');
  const browse = $('#projectBrowse');
  const tools = $('#projectTools');
  const esc = media.escapeHtml;
  let language = localStorage.getItem('isma-portfolio-language') === 'en' ? 'en' : 'id';
  const copy = {
    id: { back:'Kembali ke semua proyek', search:'Cari proyek…', all:'Semua', empty:'Belum ada proyek untuk ditampilkan.', noMatch:'Tidak ada proyek yang cocok dengan pencarian.', overview:'Ringkasan proyek', problem:'Tantangan', solution:'Solusi', features:'Fitur utama', technologies:'Teknologi', technologyEmpty:'Teknologi belum dicantumkan.', gallery:'Galeri proyek', view:'Lihat detail', year:'Tahun', status:'Status', duration:'Durasi', previous:'Proyek sebelumnya', next:'Proyek berikutnya', allProjects:'Jelajahi semua proyek', missingCover:'Sampul proyek belum diunggah', noDetails:'Detail belum ditambahkan.' },
    en: { back:'Back to all projects', search:'Search projects…', all:'All', empty:'No projects to display yet.', noMatch:'No projects match your search.', overview:'Project overview', problem:'Challenge', solution:'Solution', features:'Key features', technologies:'Technologies', technologyEmpty:'Technologies have not been listed.', gallery:'Project gallery', view:'View details', year:'Year', status:'Status', duration:'Duration', previous:'Previous project', next:'Next project', allProjects:'Explore all projects', missingCover:'Project cover has not been uploaded', noDetails:'Details have not been added.' }
  };
  const text = key => copy[language][key];
  const label = key => `<span data-language-id="${esc(copy.id[key])}" data-language-en="${esc(copy.en[key])}">${esc(text(key))}</span>`;
  const technologies = project => {
    const value = project.teknologi ?? project.technologies ?? [];
    return (Array.isArray(value) ? value : String(value).split(/[,;|\n]/)).map(item => String(item).trim()).filter(Boolean);
  };
  const listValues = value => (Array.isArray(value) ? value : String(value || '').split(/[\r\n;|]+/)).map(item => String(item).trim()).filter(Boolean);
  const safeExternalUrl = value => {
    try { const url = new URL(String(value || '')); return ['http:', 'https:'].includes(url.protocol) ? url.href : ''; }
    catch { return ''; }
  };
  const sourceMarkup = (project, source, alt, className = '') => source
    ? media.imageMarkup(source, alt, '', `${className} motion-reveal-image`.trim())
    : `<div class="project-media-empty" role="img" aria-label="${esc(text('missingCover'))}: ${esc(project.nama_proyek || '')}"><span>${esc(text('missingCover'))}</span></div>`;
  const technologyIcons = {
    html: ['html5','E34F26'], html5: ['html5','E34F26'], css: ['css3','1572B6'], css3: ['css3','1572B6'], js: ['javascript','F7DF1E'], javascript: ['javascript','F7DF1E'],
    mysql: ['mysql','4479A1'], figma: ['figma','F24E1E'], canva: ['canva','00C4CC'], php: ['php','777BB4'], python: ['python','3776AB'], react: ['react','61DAFB'],
  };
  const technologyMarkup = name => {
    const icon = technologyIcons[name.toLowerCase().replace(/\s+/g, '')];
    const logo = icon ? `<img src="https://cdn.simpleicons.org/${icon[0]}/${icon[1]}" alt="" loading="lazy" decoding="async" onerror="this.hidden=true">` : `<span class="technology-mark" aria-hidden="true">${esc(name.slice(0,2).toUpperCase())}</span>`;
    return `<span class="technology-chip">${logo}<b>${esc(name)}</b></span>`;
  };
  const renderCard = (project, index) => {
    const title = project.nama_proyek || 'Proyek';
    const cover = media.cardCover(project);
    const images = media.galleryImages(project);
    const tech = technologies(project);
    return `<a class="project-list-card motion-reveal" href="/projects/${encodeURIComponent(media.projectSlug(project))}" aria-label="${text('view')} ${esc(title)}" style="--project-order:${index}">
      <div class="project-list-media">${sourceMarkup(project, cover, `Sampul ${title}`, 'project-list-image')}${images.length > 1 ? `<span class="project-image-count">${images.length} ${language === 'en' ? 'images' : 'gambar'} ↗</span>` : ''}</div>
      <div class="project-list-body"><div class="project-card-meta"><span class="project-tag">${esc(project.kategori_id || 'Project')}</span>${project.tahun ? `<span class="project-year">${esc(project.tahun)}</span>` : ''}</div><h2>${esc(title)}</h2><p>${esc(project.deskripsi_singkat || '')}</p>${tech.length ? `<div class="project-tech-list">${tech.slice(0,4).map(item => `<span>${esc(item)}</span>`).join('')}</div>` : ''}<span class="project-more"><span data-language-id="Lihat detail" data-language-en="View details">${text('view')}</span><i aria-hidden="true">↗</i></span></div>
    </a>`;
  };
  const iconFor = title => technologyMarkup(title);


  function browseProjects() {
    const projects = Array.isArray(data.projects) ? data.projects : [];
    if (!projects.length) {
      tools.hidden = true;
      list.innerHTML = `<p class="projects-empty">${text('empty')}</p>`;
      return;
    }
    let category = text('all');
    const categories = [text('all'), ...new Set(projects.map(project => project.kategori_id).filter(Boolean))];
    tools.innerHTML = `<input class="project-search" id="projectSearch" type="search" placeholder="${text('search')}" aria-label="${text('search')}">${categories.map(value => `<button class="project-filter ${value === category ? 'active' : ''}" type="button" data-category="${esc(value)}" aria-pressed="${value === category}">${esc(value)}</button>`).join('')}`;
    const draw = () => {
      const query = $('#projectSearch').value.trim().toLocaleLowerCase();
      const rows = projects.filter(project => (category === text('all') || project.kategori_id === category) && `${project.nama_proyek || ''} ${project.deskripsi_singkat || ''}`.toLocaleLowerCase().includes(query));
      list.innerHTML = rows.map(renderCard).join('') || `<p class="projects-empty">${text('noMatch')}</p>`;
      window.observePortfolioReveals?.(list.querySelectorAll('.project-list-card, .project-list-media img'));
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
    const projects = Array.isArray(data.projects) ? data.projects : [];
    const currentIndex = projects.findIndex(item => media.projectSlug(item) === media.projectSlug(project));
    const cover = media.detailCover(project);
    const coverUrl = cover ? media.imageUrl(cover) : '';
    const images = media.galleryImages(project).filter(source => source !== coverUrl);
    const tech = technologies(project);
    const features = listValues(project.features ?? project.fitur_utama ?? project.fitur);
    const problem = project.problem || project.masalah || project.challenge || '';
    const solution = project.solution || project.solusi || '';
    const demo = safeExternalUrl(project.demo_url);
    const github = safeExternalUrl(project.github_url);
    const previous = currentIndex > 0 ? projects[currentIndex - 1] : null;
    const next = currentIndex >= 0 && currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;
    const navigation = (previous || next)
      ? `<nav class="case-navigation" aria-label="${language === 'en' ? 'Project navigation' : 'Navigasi proyek'}">${previous ? `<a class="case-nav-link case-nav-previous" href="/projects/${encodeURIComponent(media.projectSlug(previous))}"><span>← ${label('previous')}</span><strong>${esc(previous.nama_proyek)}</strong></a>` : `<a class="case-nav-link case-nav-previous" href="/projects.html"><span>← ${label('back')}</span></a>`}${next ? `<a class="case-nav-link case-nav-next" href="/projects/${encodeURIComponent(media.projectSlug(next))}"><span>${label('next')} →</span><strong>${esc(next.nama_proyek)}</strong></a>` : `<a class="case-nav-link case-nav-next" href="/projects.html"><span>${label('allProjects')} →</span></a>`}</nav>`
      : `<nav class="case-navigation"><a class="case-nav-link case-nav-next" href="/projects.html"><span>${label('allProjects')} →</span></a></nav>`;
    document.title = `${project.nama_proyek || 'Proyek'} — Isma Tiara Zalianti`;
    detail.innerHTML = `<a class="project-back" href="/projects.html"><span aria-hidden="true">←</span> ${label('back')}</a>
      <p class="detail-meta">${esc(project.kategori_id || 'Project')}${project.tahun ? ` · ${esc(project.tahun)}` : ''}</p>
      <h1 class="detail-title">${esc(project.nama_proyek || 'Proyek')}</h1>
      <p class="detail-lead">${esc(project.deskripsi_singkat || '')}</p>
      <figure class="case-cover">${sourceMarkup(project, cover, `Sampul ${project.nama_proyek || 'proyek'}`, 'case-cover-image')}${project.status ? `<figcaption>${esc(project.status)}</figcaption>` : ''}</figure>
      <div class="case-layout"><div class="case-main">
        <section class="case-section case-overview"><p class="case-section-label">${label('overview')}</p><div>${esc(project.deskripsi_lengkap || project.deskripsi_singkat || text('noDetails'))}</div></section>
        ${problem ? `<section class="case-section case-context case-challenge"><p class="case-section-label">${label('problem')}</p><div>${esc(problem)}</div></section>` : ''}
        ${solution ? `<section class="case-section case-context case-solution"><p class="case-section-label">${label('solution')}</p><div>${esc(solution)}</div></section>` : ''}
        ${features.length ? `<section class="case-section case-features"><p class="case-section-label">${label('features')}</p><ul>${features.map(item => `<li>${esc(item)}</li>`).join('')}</ul></section>` : ''}
        ${images.length ? `<section class="detail-gallery" aria-labelledby="galleryTitle"><h2 id="galleryTitle">${label('gallery')}</h2><div class="gallery-grid">${images.map((source, index) => `<button class="gallery-item motion-reveal" type="button" data-image-index="${index}" aria-label="${language === 'en' ? 'Open image' : 'Perbesar foto'} ${index + 1} ${esc(project.nama_proyek || 'proyek')}">${media.imageMarkup(source, `${project.nama_proyek || 'Proyek'} — foto ${index + 1}`, '', 'gallery-image motion-reveal-image')}</button>`).join('')}</div></section>` : ''}
      </div><aside class="case-sidebar"><section class="case-facts"><p class="case-section-label"><span data-language-id="Detail proyek" data-language-en="Project details">${language === 'en' ? 'Project details' : 'Detail proyek'}</span></p><dl><div><dt>${label('year')}</dt><dd>${esc(project.tahun || '—')}</dd></div>${project.status ? `<div><dt>${label('status')}</dt><dd>${esc(project.status)}</dd></div>` : ''}${project.durasi ? `<div><dt>${label('duration')}</dt><dd>${esc(project.durasi)}</dd></div>` : ''}<div><dt>${label('technologies')}</dt><dd>${tech.length ? `<div class="technology-list">${tech.map(iconFor).join('')}</div>` : `<span class="case-muted">${text('technologyEmpty')}</span>`}</dd></div></dl>${(demo || github) ? `<div class="detail-links">${demo ? `<a href="${esc(demo)}" target="_blank" rel="noopener noreferrer">${language === 'en' ? 'Live project ↗' : 'Lihat demo ↗'}</a>` : ''}${github ? `<a class="secondary" href="${esc(github)}" target="_blank" rel="noopener noreferrer">GitHub ↗</a>` : ''}</div>` : ''}</section></aside></div>${navigation}`;
    detail.querySelectorAll('[data-image-index]').forEach(button => button.addEventListener('click', () => {
      const image = images[Number(button.dataset.imageIndex)];
      const lightbox = $('#projectLightbox');
      const lightboxImage = $('#lightboxImage');
      lightboxImage.src = media.imageUrl(image);
      lightboxImage.alt = `${project.nama_proyek || 'Proyek'} — foto ${Number(button.dataset.imageIndex) + 1}`;
      lightbox.showModal();
    }));
    window.observePortfolioReveals?.(detail.querySelectorAll('.project-back, .detail-meta, .detail-title, .detail-lead, .case-cover, .case-section, .gallery-item, .gallery-item img, .case-sidebar, .case-navigation'));
    // Keep uploaded gallery media visible even if scroll-reveal observation is unavailable or delayed.
    const gallery = detail.querySelector('.detail-gallery');
    if (gallery) {
      gallery.classList.add('is-visible');
      gallery.querySelectorAll('.gallery-item, .gallery-image').forEach(image => image.classList.add('is-visible'));
    }
  }

  $('#projectYear').textContent = new Date().getFullYear();
  $('#lightboxClose').addEventListener('click', () => $('#projectLightbox').close());
  $('#projectLightbox').addEventListener('click', event => { if (event.target === $('#projectLightbox')) $('#projectLightbox').close(); });
  const projectPath = location.pathname.split('/').filter(Boolean);
  const wanted = new URLSearchParams(location.search).get('slug') || (projectPath[0] === 'projects' ? projectPath[1] : '');
  let requestedSlug = wanted;
  try { requestedSlug = decodeURIComponent(wanted); } catch { /* show the not-found state */ }
  const selected = wanted ? data.projects.find(project => media.projectSlug(project) === media.slugify(requestedSlug)) : null;
  if (selected) detailProject(selected);
  else if (wanted) {
    browse.hidden = true; tools.hidden = true; list.hidden = true; detail.hidden = false;
    document.title = 'Proyek tidak ditemukan — Isma Tiara Zalianti';
    detail.innerHTML = `<section class="projects-empty"><h1>Proyek tidak ditemukan</h1><p>Proyek ini mungkin sudah dihapus atau tautannya berubah.</p><a class="project-back" href="/projects.html">← Kembali ke semua proyek</a></section>`;
  } else browseProjects();
})();
