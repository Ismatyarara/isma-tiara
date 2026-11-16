(async () => {
  const data = await getData();
  const $ = selector => document.querySelector(selector);
  const esc = ProjectMedia.escapeHtml;
  $('#year').textContent = new Date().getFullYear();

  $('#projectList').innerHTML = renderProjectCards((data.projects || []).slice(0, 4));

  const profileSkills = [
    'Laravel (PHP)', 'Instalasi Windows', 'Dasar Jaringan Komputer',
    'Quality Checking', 'Numbering & Labeling', 'Quality Control Dasar',
    'Proses Produksi Garment', 'Ketelitian & Fokus', 'Inisiatif',
    'Pelayanan Pelanggan', 'AI Prompt Engineer', 'Graphic Design',
    'Photography', 'Video Editing', 'UI/UX Design',
  ];
  const skillMap = new Map((data.skills || []).map(skill => [skill.nama.trim().toLowerCase(), skill]));
  profileSkills.forEach(name => {
    const key = name.toLowerCase();
    if (!skillMap.has(key)) skillMap.set(key, { nama: name });
  });
  const skills = [...skillMap.values()];
  const categories = [
    { title: 'IT Support & Administration', match: /microsoft|google|data entry|arsip|technical support|troubleshoot|mysql|analisis sistem|laravel|windows|jaringan/i },
    { title: 'Development & Design', match: /figma|canva|html|css|javascript|ui|ai prompt|graphic design|photography|video editing/i },
    { title: 'Production & Quality Control', match: /quality|numbering|garment|ketelitian|fokus/i },
    { title: 'Communication & Workstyle', match: /komunikasi|kerja sama|waktu|adaptasi|problem solving|inisiatif|pelayanan pelanggan/i },
  ];
  const glyphs = [
    [/entry|arsip|quality|numbering/, '<rect x="4" y="4" width="16" height="17" rx="3"/><path d="M8 9h8M8 13h5M8 17h3"/>'],
    [/support|troubleshoot|windows|jaringan/, '<path d="M4 13v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="12" width="4" height="7" rx="2"/><rect x="17" y="12" width="4" height="7" rx="2"/><path d="M17 19a5 5 0 0 1-5 3h-1"/>'],
    [/mysql|database/, '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v7c0 1.7 3.6 3 8 3M20 5v4M4 12v6c0 1.7 3.6 3 8 3"/><path d="M16 15h5v6h-5zM16 18h5"/>'],
    [/analisis|system/, '<circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M8 7l3 8m5-8-3 8M8 6h8"/>'],
    [/excel|word|sheets|docs/, '<rect x="4" y="3" width="16" height="18" rx="3"/><path d="M8 8h8M8 12h8M8 16h5"/>'],
    [/laravel|javascript|html|css/, '<path d="m8 5-6 7 6 7M16 5l6 7-6 7M14 3l-4 18"/>'],
    [/figma|canva|graphic|design/, '<path d="M12 3 3 8l9 5 9-5-9-5ZM3 12l9 5 9-5M3 16l9 5 9-5"/>'],
    [/photography|camera/, '<path d="M4 7h3l2-3h6l2 3h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"/><circle cx="12" cy="13" r="4"/>'],
    [/video|editing/, '<path d="M4 5h16v14H4zM4 9h16M8 5l2 4m3-4 2 4m3-4 2 4M8 19l2-4m3 4 2-4m3 4 2-4"/>'],
    [/ui\//, '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 9h18M8 9v11"/>'],
    [/komunikasi|pelayanan/, '<path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8 8 0 0 1-3-.6L4 20l1.5-4A7.2 7.2 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z"/><path d="M8 12h.01M12 12h.01M16 12h.01"/>'],
    [/tim|adaptasi/, '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2M4 5l3 1-1 3"/>'],
    [/problem|inisiatif|ai prompt/, '<path d="M9 18h6m-5 3h4m-2-19a7 7 0 0 0-4 13c.7.5 1 1.2 1 2h6c0-.8.3-1.5 1-2a7 7 0 0 0-4-13Z"/><path d="m12 5 .7 2.1L15 8l-2.3.8L12 11l-.7-2.2L9 8l2.3-.9L12 5Z"/>'],
  ];
  const iconSvg = name => {
    const rule = glyphs.find(([pattern]) => pattern.test(name));
    const content = rule?.[1] || '<circle cx="12" cy="12" r="8"/><path d="M12 8v8m-4-4h8"/>';
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${content}</svg>`;
  };
  const skillMarkup = skill => {
    const fallback = `<span class="skill-glyph" ${skill.gambar ? 'hidden' : ''}>${iconSvg(skill.nama)}</span>`;
    const icon = skill.gambar
      ? `<span class="skill-icon"><img data-skill-logo src="${esc(ProjectMedia.imageUrl(skill.gambar))}" alt="" loading="lazy" decoding="async">${fallback}</span>`
      : `<span class="skill-icon">${fallback}</span>`;
    return `<article class="skill-item">${icon}<span class="skill-name">${esc(skill.nama)}</span></article>`;
  };
  $('#skillList').innerHTML = categories.map((category, index) => {
    const items = skills.filter(skill => category.match.test(skill.nama));
    return `<section class="skill-category"><header class="skill-category-head"><span class="skill-category-number">0${index + 1}</span><h3>${esc(category.title)}</h3><span class="skill-count">${items.length} skills</span></header><div class="skill-items">${items.map(skillMarkup).join('')}</div></section>`;
  }).join('');
  $('#skillList').querySelectorAll('[data-skill-logo]').forEach(image => image.addEventListener('error', () => {
    image.closest('.skill-icon')?.classList.add('is-broken');
    const glyph = image.nextElementSibling;
    if (glyph) glyph.hidden = false;
  }, { once: true }));

  $('#certificateList').innerHTML = (data.certificates || []).slice(0, 3).map((certificate, index) => {
    const slug = ProjectMedia.slugify(certificate.slug || certificate.nama_sertifikat);
    const isPdf = certificate.gambar_tipe === 'application/pdf' || /\.pdf(?:$|[?#])/i.test(String(certificate.gambar || certificate.tautan_sertifikat || ''));
    const preview = certificate.gambar && !isPdf
      ? ProjectMedia.imageMarkup(certificate.gambar, certificate.nama_sertifikat, 'Certificate', 'certificate-thumb')
      : `<div class="certificate-art ${isPdf ? 'is-pdf' : ''}"><span class="certificate-art-label">${isPdf ? 'DOCUMENT' : 'LEARNING MILESTONE'}</span><b>${isPdf ? 'PDF' : 'CERTIFICATE'}</b><small>${esc(certificate.tahun || 'PORTFOLIO')}</small><i aria-hidden="true">✦</i></div>`;
    return `<a class="certificate-card" href="/certificates/${encodeURIComponent(slug)}"><div class="certificate-visual">${preview}<span class="certificate-view-icon" aria-hidden="true">↗</span></div><div class="certificate-card-body"><div class="certificate-card-meta"><span>${esc(certificate.penerbit || 'Certificate')}</span><b>${esc(certificate.tahun || '')}</b></div><h3>${esc(certificate.nama_sertifikat)}</h3><span class="certificate-card-cta">Lihat sertifikat <span aria-hidden="true">→</span></span></div></a>`;
  }).join('') || '<p class="empty">Belum ada sertifikat.</p>';

  $('#hobbyList').innerHTML = (data.beyond || []).map((hobby, index) => {
    const cover = hobby.gambar || (hobby.gallery || [])[0];
    const preview = cover
      ? ProjectMedia.imageMarkup(cover, hobby.nama, hobby.nama.slice(0, 2), 'hobby-tile-image')
      : `<span class="hobby-tile-placeholder">${['📷', '♫', '📖', '✦'][index % 4]}</span>`;
    return `<a class="hobby-tile" href="/hobbies/${encodeURIComponent(ProjectMedia.slugify(hobby.slug || hobby.nama))}"><div class="hobby-tile-media">${preview}</div><div class="hobby-tile-copy"><b>${esc(hobby.nama)}</b><small>Lihat detail <span aria-hidden="true">→</span></small></div></a>`;
  }).join('') || '<p class="empty">Belum ada hobi.</p>';
})();
