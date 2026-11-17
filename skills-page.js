(() => {
  const $ = selector => document.querySelector(selector);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const initials = value => String(value || 'SK').split(/\s+/).map(word => word[0]).join('').slice(0,2);
  const button = $('.language-toggle');
  let language = localStorage.getItem('isma-portfolio-language') === 'en' ? 'en' : 'id';
  const copy = {
    id: { eyebrow:'Skills & Tools', title:'Semua Skill', intro:'Tools dan kemampuan yang mendukung pekerjaan administrasi, pengelolaan data, dan solusi digital.', back:'← Portfolio', groups:['Office & Administrasi','IT Support & Development','Creative & Design','Professional Skills','Lainnya'] },
    en: { eyebrow:'Skills & Tools', title:'All Skills', intro:'The tools and abilities I use across administration, data management, and digital solutions.', back:'← Portfolio', groups:['Office & Administration','IT Support & Development','Creative & Design','Professional Skills','Other skills'] },
  };
  const updateCopy = () => {
    const strings = copy[language];
    document.documentElement.lang = language;
    $('[data-i18n="eyebrow"]').textContent = strings.eyebrow;
    $('[data-i18n="title"]').textContent = strings.title;
    $('[data-i18n="intro"]').textContent = strings.intro;
    $('.back-link').textContent = strings.back;
    button.textContent = language === 'id' ? 'ID / EN' : 'EN / ID';
    button.setAttribute('aria-label', language === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia');
  };
  const icon = skill => `<span class="skill-icon ${skill.gambar?'':'is-fallback'}">${skill.gambar?`<img src="${esc(skill.gambar)}" alt="" loading="lazy" onerror="this.parentElement.classList.add('is-fallback');this.remove()">`:''}<span class="skill-fallback">${esc(initials(skill.nama))}</span></span>`;
  async function render() {
    const data = await getData();
    const definitions = [
      /excel|word|sheets|docs|data entry|arsip|administrasi/i,
      /technical|troubleshoot|mysql|sistem|html|css|javascript|php|laravel|network|hardware|software|windows/i,
      /figma|canva|graphic|design|visual/i,
      /komunikasi|team|tim|manajemen waktu|adaptasi|problem|customer|pelayanan|kerja sama/i,
    ];
    const remaining = [...(data.skills || [])];
    const groups = definitions.map(pattern => {
      const entries = remaining.filter(skill => pattern.test(skill.nama || ''));
      entries.forEach(skill => remaining.splice(remaining.indexOf(skill), 1));
      return entries;
    });
    if (remaining.length) groups.push(remaining);
    $('#allSkillGroups').innerHTML = groups.map((skills,index) => `<section class="all-skill-group"><header class="all-skill-group-head"><div><p class="all-skill-group-kicker">${String(index + 1).padStart(2,'0')} / CATEGORY</p><h2>${copy[language].groups[index]}</h2></div><span class="all-skill-count">${skills.length} ${language === 'id' ? 'skill' : 'skills'}</span></header><div class="all-skill-grid">${skills.map(skill => `<article class="all-skill-item">${icon(skill)}<span>${esc(skill.nama)}</span></article>`).join('')}</div></section>`).filter((_, index) => groups[index]?.length).join('');
    window.observePortfolioReveals?.($('#allSkillGroups').querySelectorAll('.all-skill-group, .all-skill-item'));
  }
  button.addEventListener('click', () => { language = language === 'id' ? 'en' : 'id'; localStorage.setItem('isma-portfolio-language', language); updateCopy(); render(); });
  $('#skillsYear').textContent = new Date().getFullYear();
  updateCopy();
  render();
})();
