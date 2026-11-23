(() => {
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const monthIndex = value => {
    const month = String(value || '').toLowerCase().slice(0, 3);
    return ({ jan: 1, feb: 2, mar: 3, apr: 4, mei: 5, may: 5, jun: 6, jul: 7, agu: 8, aug: 8, sep: 9, okt: 10, oct: 10, nov: 11, des: 12, dec: 12 })[month] || 0;
  };
  const dateSortValue = value => {
    const text = String(value || '');
    const match = text.match(/([a-zA-Z]+)\s+(19\d{2}|20\d{2})/);
    if (match) return Number(match[2]) * 100 + monthIndex(match[1]);
    const year = text.match(/(?:19|20)\d{2}/);
    return year ? Number(year[0]) * 100 : 0;
  };
  const pointsMarkup = value => {
    const points = String(value || '').split(/[\r\n]+/).map(point => point.trim()).filter(Boolean);
    return points.length ? `<ul>${points.map(point => `<li>${escapeHtml(point)}</li>`).join('')}</ul>` : '';
  };
  function render(data) {
    const timeline = Array.isArray(data?.timeline) ? data.timeline : [];
    const professional = timeline.filter(item => item.kategori === 'Experience').sort((a, b) => dateSortValue(b.tanggal) - dateSortValue(a.tanggal));
    const educationAndOrganization = timeline.filter(item => ['Education', 'Organization'].includes(item.kategori)).sort((a, b) => dateSortValue(b.tanggal) - dateSortValue(a.tanggal));
    const experienceList = document.querySelector('#experienceList');
    const educationList = document.querySelector('#educationOrgList');
    const count = document.querySelector('#experience-stat');
    if (!experienceList || !educationList || !count) return;
    count.textContent = professional.length;
    const card = (item, index) => {
      const organization = item.instansi || item.institusi || item.organisasi || '';
      const badge = item.tipe || (item.kategori === 'Organization' ? 'Organization' : item.kategori === 'Education' ? 'Education' : 'Professional Experience');
      const icon = item.kategori === 'Education' ? '⌂' : item.kategori === 'Organization' ? '♧' : /fadfad/i.test(organization) ? '▣' : /usaha/i.test(organization) ? '◇' : '⌘';
      const skills = String(item.skills || '').split(/[\r\n,;|]+/).map(skill => skill.trim()).filter(Boolean);
      return `<article class="panel exp-card motion-reveal" style="--card-index:${index}"><div class="experience-card-top"><span class="icon" aria-hidden="true">${icon}</span><span class="experience-badge">${escapeHtml(badge)}</span></div><p class="experience-period"><time>${escapeHtml(item.tanggal || '')}</time></p><h3>${escapeHtml(item.judul || '')}</h3>${organization ? `<h4>${escapeHtml(organization)}</h4>` : ''}${pointsMarkup(item.deskripsi)}${skills.length ? `<div class="exp-skills">${skills.map(skill => `<span>${escapeHtml(skill)}</span>`).join('')}</div>` : ''}</article>`;
    };
    experienceList.innerHTML = professional.length ? professional.map(card).join('') : '<p class="empty">Belum ada pengalaman profesional.</p>';
    educationList.innerHTML = educationAndOrganization.length ? educationAndOrganization.map(card).join('') : '<p class="empty">Belum ada pendidikan atau organisasi.</p>';
    window.observePortfolioReveals?.(document.querySelectorAll('#experienceList .exp-card, #educationOrgList .exp-card'));
  }
  if (window.portfolioDataReady) render(window.homePortfolioData);
  else window.addEventListener('home-portfolio-ready', event => render(event.detail), { once: true });
})();
