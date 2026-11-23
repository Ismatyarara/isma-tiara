(() => {
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  function render(data) {
    const entries = Array.isArray(data?.workHistory) ? data.workHistory : [];
    const list = document.querySelector('#experienceList');
    const count = document.querySelector('#experience-stat');
    if (!list || !count) return;
    count.textContent = entries.length;
    list.innerHTML = entries.map((item, i) => {
      const organization = [item.organization, item.date].filter(Boolean).join(' · ');
      const skills = String(item.skills || '').split(',').map(skill => skill.trim()).filter(Boolean);
      const kind = /osis|organisasi/i.test(item.organization || '') ? 'Organization & Volunteer' : 'Work Experience';
      const icon = /osis|organisasi/i.test(item.organization || '') ? '♧' : /fadfad/i.test(item.organization || '') ? '▣' : /usaha/i.test(item.organization || '') ? '◇' : '⌘';
      return `<article class="panel exp-card motion-reveal" style="--card-index:${i}"><div class="icon">${icon}</div><p class="kind">${kind}</p><h3>${escapeHtml(item.title)}</h3><h4>${escapeHtml(organization)}</h4><p class="exp-description">${escapeHtml(item.description)}</p><div class="exp-skills">${skills.map(skill => `<span>${escapeHtml(skill)}</span>`).join('')}</div></article>`;
    }).join('');
    window.observePortfolioReveals?.(list.querySelectorAll('.exp-card'));
  }
  if (window.portfolioDataReady) render(window.homePortfolioData);
  else window.addEventListener('home-portfolio-ready', event => render(event.detail), { once: true });
})();
