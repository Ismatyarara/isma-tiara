(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = document.querySelectorAll('.section:not(.hero), .skill-group, .cert, .hobby-card, .stat-card, .contact-v2-message, .contact-v2-card');
  if (reduced || !('IntersectionObserver' in window)) return;
  document.body.classList.add('motion-ready');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }), { threshold: 0.12 });
  const observe = elements => elements.forEach(target => {
    if (target.classList.contains('is-visible')) return;
    target.classList.add('motion-reveal');
    observer.observe(target);
  });
  window.observePortfolioReveals = observe;
  observe(targets);
})();

(() => {
  const art = document.querySelector('#home .hero-art');
  if (!art) return;

  const badges = [...art.querySelectorAll('.float')];
  badges.forEach(badge => {
    if (badge.querySelector('.float-label')) return;
    const label = document.createElement('span');
    label.className = 'float-label';
    while (badge.firstChild) label.append(badge.firstChild);
    badge.append(label);
  });

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motionQuery.matches) return;
  art.classList.add('hero-motion-ready');

  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (!finePointer || window.innerWidth < 941) return;

  let pointerX = 0;
  let pointerY = 0;
  let frame = 0;
  let bounds;

  const update = () => {
    frame = 0;
    const x = pointerX / bounds.width * 24;
    const y = pointerY / bounds.height * 24;
    art.style.setProperty('--pointer-x', `${x}px`);
    art.style.setProperty('--pointer-y', `${y}px`);
    art.style.setProperty('--blob-x', `${x * -.2}px`);
    art.style.setProperty('--blob-y', `${y * -.2}px`);
    art.style.setProperty('--orbit-x', `${x * -.36}px`);
    art.style.setProperty('--orbit-y', `${y * -.36}px`);
    art.style.setProperty('--decor-x', `${x * -.5}px`);
    art.style.setProperty('--decor-y', `${y * -.5}px`);
    art.style.setProperty('--portrait-x', `${x * .18}px`);
    art.style.setProperty('--portrait-y', `${y * .18}px`);
    badges.forEach(badge => {
      const rect = badge.getBoundingClientRect();
      const dx = (bounds.left + bounds.width / 2) - (rect.left + rect.width / 2);
      const dy = (bounds.top + bounds.height / 2) - (rect.top + rect.height / 2);
      const towardX = pointerX + dx;
      const towardY = pointerY + dy;
      const distance = Math.hypot(towardX, towardY);
      const reach = Math.max(rect.width, rect.height) / 2 + 74;
      if (distance > reach) {
        badge.classList.remove('is-magnetic');
        badge.style.setProperty('--magnet-x', '0px');
        badge.style.setProperty('--magnet-y', '0px');
        return;
      }
      const strength = (1 - distance / reach) * 4.5;
      badge.classList.add('is-magnetic');
      badge.style.setProperty('--magnet-x', `${towardX / (distance || 1) * strength}px`);
      badge.style.setProperty('--magnet-y', `${towardY / (distance || 1) * strength}px`);
    });
  };

  art.addEventListener('pointerenter', () => { bounds = art.getBoundingClientRect(); }, { passive: true });
  art.addEventListener('pointermove', event => {
    if (!bounds) bounds = art.getBoundingClientRect();
    pointerX = event.clientX - bounds.left - bounds.width / 2;
    pointerY = event.clientY - bounds.top - bounds.height / 2;
    if (!frame) frame = requestAnimationFrame(update);
  }, { passive: true });
  art.addEventListener('pointerleave', () => {
    pointerX = 0;
    pointerY = 0;
    if (!frame) frame = requestAnimationFrame(update);
  }, { passive: true });
  window.addEventListener('resize', () => { bounds = null; }, { passive: true });
})();

(() => {
  const sections = [...document.querySelectorAll('#skills, #certificates')];
  if (!sections.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  const active = new Set();
  let frame = 0;
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) active.add(entry.target);
    else active.delete(entry.target);
  }), { rootMargin: '80px 0px' });
  sections.forEach(section => observer.observe(section));
  const update = () => {
    frame = 0;
    active.forEach(section => {
      const rect = section.getBoundingClientRect();
      const offset = Math.max(-16, Math.min(16, (window.innerHeight / 2 - (rect.top + rect.height / 2)) * .025));
      section.style.setProperty('--section-parallax-y', `${offset}px`);
    });
  };
  const requestUpdate = () => { if (!frame) frame = requestAnimationFrame(update); };
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  requestUpdate();
})();
