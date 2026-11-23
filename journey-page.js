(async function () {
  const data = await getData();
  const media = window.ProjectMedia;
  const $ = selector => document.querySelector(selector);
  const esc = media.escapeHtml;
  const categories = ['All', 'Education', 'Experience', 'Projects', 'Learning Journey', 'Achievements'];
  const categoryText = {
    id: { All: 'Semua', Education: 'Pendidikan', Experience: 'Pengalaman', Projects: 'Proyek', 'Learning Journey': 'Perjalanan Belajar', Achievements: 'Pencapaian' },
    en: { All: 'All', Education: 'Education', Experience: 'Experience', Projects: 'Projects', 'Learning Journey': 'Learning Journey', Achievements: 'Achievements' }
  };
  let language = localStorage.getItem('isma-portfolio-language') === 'en' ? 'en' : 'id';
  let activeCategory = 'All';

  const asList = value => (Array.isArray(value) ? value : String(value || '').split(/[\r\n,;|]+/))
    .map(item => String(item || '').trim()).filter(Boolean);
  const parseYear = value => {
    const date = String(value || '').trim();
    const parsed = Date.parse(date);
    if (!Number.isNaN(parsed)) return new Date(parsed).getFullYear();
    const match = date.match(/\b(?:19|20)\d{2}\b/);
    return match ? Number(match[0]) : null;
  };
  const uniqueImages = values => [...new Set(values.map(media.imageUrl).filter(Boolean))];
  const entries = () => {
    const custom = (Array.isArray(data.timeline) ? data.timeline : []).map((item, index) => ({
      id: `timeline-${item.id ?? index}`,
      category: item.kategori || 'Experience',
      title: item.judul || 'Perjalanan',
      date: item.tanggal || item.tahun || item.date || '',
      description: item.deskripsi || '',
      organization: item.institusi || item.organisasi || '',
      tags: asList(item.skills || item.skill),
      images: uniqueImages([item.gambar || '', ...(Array.isArray(item.gallery) ? item.gallery : [])]),
      order: index
    }));
    const projects = (Array.isArray(data.projects) ? data.projects : []).map((project, index) => ({
      id: `project-${project.id ?? index}`,
      category: 'Projects',
      title: project.nama_proyek || 'Proyek',
      date: project.tahun || '',
      description: project.deskripsi_singkat || project.deskripsi_lengkap || '',
      organization: project.kategori_id || '',
      tags: asList(project.teknologi ?? project.technologies),
      images: uniqueImages([media.detailCover(project), ...(Array.isArray(project.gallery) ? project.gallery : [])]),
      order: 100000 + index,
      details: project.deskripsi_lengkap || ''
    }));
    const achievements = (Array.isArray(data.certificates) ? data.certificates : []).map((certificate, index) => ({
      id: `achievement-${certificate.id ?? index}`,
      category: 'Achievements',
      title: certificate.nama_sertifikat || 'Sertifikat',
      date: certificate.tahun || '',
      description: certificate.penerbit ? `Penerbit: ${certificate.penerbit}` : '',
      organization: certificate.penerbit || '',
      tags: [],
      images: certificate.gambar_tipe === 'application/pdf' ? [] : uniqueImages([certificate.gambar || '']),
      document: certificate.gambar_tipe === 'application/pdf' ? media.imageUrl(certificate.gambar) : media.imageUrl(certificate.tautan_sertifikat),
      order: 200000 + index
    }));
    const skills = Array.isArray(data.skills) ? data.skills : [];
    const learning = skills.length ? [{
      id: 'learning-skills', category: 'Learning Journey', title: 'Skills & Tools', date: '',
      description: language === 'en' ? 'Skills and tools listed in this portfolio. Learning dates are not specified.' : 'Kemampuan dan tools yang tercantum di portfolio. Tanggal belajar tidak dicantumkan.',
      organization: '', tags: skills.map(skill => skill.nama).filter(Boolean),
      images: uniqueImages(skills.map(skill => skill.gambar || '')), order: 300000
    }] : [];
    return [...custom, ...projects, ...achievements, ...learning].map((entry, index) => ({ ...entry, stableOrder: index }))
      .sort((a, b) => {
        const yearA = parseYear(a.date);
        const yearB = parseYear(b.date);
        if (yearA == null && yearB != null) return 1;
        if (yearA != null && yearB == null) return -1;
        if (yearA !== yearB) return yearA - yearB;
        return a.order - b.order || a.stableOrder - b.stableOrder;
      });
  };

  const applyLanguage = () => {
    document.documentElement.lang = language;
    const toggle = $('.language-toggle');
    toggle.textContent = language === 'id' ? 'ID / EN' : 'EN / ID';
    toggle.setAttribute('aria-label', language === 'id' ? 'Ganti ke Bahasa Inggris' : 'Switch to Bahasa Indonesia');
    document.querySelectorAll('[data-language-id][data-language-en]').forEach(node => {
      node.textContent = language === 'id' ? node.dataset.languageId : node.dataset.languageEn;
    });
  };

  const renderFilters = () => {
    $('#journeyFilters').innerHTML = categories.map(category => `<button class="journey-filter ${category === activeCategory ? 'active' : ''}" type="button" data-category="${esc(category)}" aria-pressed="${category === activeCategory}">${esc(categoryText[language][category])}</button>`).join('');
    $('#journeyFilters').querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => {
      activeCategory = button.dataset.category;
      render();
    }));
  };

  const cardMarkup = (entry, index) => {
    const image = entry.images[0] || '';
    const tags = entry.tags.length ? `<div class="growth-tags">${entry.tags.map(tag => `<span class="growth-tag">${esc(tag)}</span>`).join('')}</div>` : '';
    const preview = image ? `<img class="growth-card-image growth-image" src="${esc(image)}" alt="${esc(entry.title)}" loading="lazy" decoding="async">` : '';
    const dateLabel = entry.date || (language === 'en' ? 'Date not specified' : 'Tanggal belum dicantumkan');
    return `<article class="growth-item motion-reveal" style="--timeline-order:${index}">
      <div class="growth-card"><div class="growth-card-top"><span class="growth-category">${esc(categoryText[language][entry.category] || entry.category)}</span></div>
        <div class="growth-card-content ${image ? '' : 'no-image'}"><div><h2>${esc(entry.title)}</h2>${entry.organization ? `<p class="growth-organization">${esc(entry.organization)}</p>` : ''}${entry.description ? `<p class="growth-description">${esc(entry.description)}</p>` : ''}${tags}</div>${preview}</div>
        <button class="growth-detail-button" type="button" data-detail-index="${index}">${language === 'en' ? 'View details' : 'Lihat detail'} <span aria-hidden="true">↗</span></button>
      </div><span class="growth-axis" aria-hidden="true"><i></i></span><time class="growth-date">${esc(dateLabel)}</time>
    </article>`;
  };

  const openDetail = entry => {
    const images = entry.images.length ? `<div class="journey-detail-gallery">${entry.images.map((source, index) => media.imageMarkup(source, `${entry.title} — dokumentasi ${index + 1}`, 'Dokumentasi tidak tersedia', 'growth-image')).join('')}</div>` : '';
    const tags = entry.tags.length ? `<div class="growth-tags">${entry.tags.map(tag => `<span class="growth-tag">${esc(tag)}</span>`).join('')}</div>` : '';
    const docLink = entry.document ? `<p><a class="journey-back" href="${esc(entry.document)}" target="_blank" rel="noopener noreferrer">${language === 'en' ? 'Open document ↗' : 'Buka dokumen ↗'}</a></p>` : '';
    $('#journeyDetailContent').innerHTML = `<span class="growth-category">${esc(categoryText[language][entry.category] || entry.category)}</span><p class="journey-detail-date">${esc(entry.date || (language === 'en' ? 'Date not specified' : 'Tanggal belum dicantumkan'))}</p><h2 id="journeyDetailTitle">${esc(entry.title)}</h2>${entry.organization ? `<p class="growth-organization">${esc(entry.organization)}</p>` : ''}${entry.details ? `<p class="journey-detail-description">${esc(entry.details)}</p>` : ''}${entry.description ? `<p class="journey-detail-description">${esc(entry.description)}</p>` : ''}${tags}${images}${docLink}`;
    $('#journeyDetail').showModal();
    window.observePortfolioReveals?.($('#journeyDetailContent').querySelectorAll('.growth-image'));
  };

  function render() {
    renderFilters();
    const allEntries = entries();
    const visible = activeCategory === 'All' ? allEntries : allEntries.filter(entry => entry.category === activeCategory);
    $('#journeyCount').textContent = language === 'en' ? `${visible.length} milestones` : `${visible.length} perjalanan`;
    $('#growthTimeline').innerHTML = visible.length ? visible.map(cardMarkup).join('') : `<p class="journey-empty">${language === 'en' ? 'No timeline entries in this category yet.' : 'Belum ada perjalanan pada kategori ini.'}</p>`;
    $('#growthTimeline').querySelectorAll('[data-detail-index]').forEach(button => button.addEventListener('click', () => openDetail(visible[Number(button.dataset.detailIndex)])));
    window.observePortfolioReveals?.($('#growthTimeline').querySelectorAll('.growth-item, .growth-image'));
    applyLanguage();
  }

  $('#journeyYear').textContent = new Date().getFullYear();
  $('.language-toggle').addEventListener('click', () => {
    language = language === 'id' ? 'en' : 'id';
    localStorage.setItem('isma-portfolio-language', language);
    render();
  });
  $('.journey-dialog-close').addEventListener('click', () => $('#journeyDetail').close());
  $('#journeyDetail').addEventListener('click', event => { if (event.target === $('#journeyDetail')) $('#journeyDetail').close(); });
  render();
})();
