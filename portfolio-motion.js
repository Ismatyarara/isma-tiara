(() => {
  const html = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealSelector = [
    '.section:not(.hero)', '.exp-card', '.project-link', '.project-list-card', '.skill-category', '.skill-chip',
    '.cert', '.cert-link', '.hobby-card', '.detail-card', '.all-skill-group', '.all-skill-item',
    '.detail-gallery', '.gallery-item', '.activity-photo', '.photo-grid', '.hobby-heading', '.activity-gallery', '.certificate-detail', '.certificate-info', '.certificate-layout', '.case-section', '.case-sidebar', '.case-navigation', '.detail-hero', '.detail-meta', '.detail-title', '.detail-lead', '.case-cover', '.project-back',
  ].join(',');
  const imageSelector = [
    '.project-media img', '.project-list-media img', '.detail-cover img', '.case-cover img', '.gallery-grid img',
    '.photo-grid img', '.card-media img', '.hobby-cover-image', '.certificate-preview-image', '.certificate-image',
  ].join(',');
  let observer = null;
  let mutationObserver = null;

  const reveal = elements => {
    if (reduced || !observer) return;
    const candidates = new Set();
    elements.forEach(root => {
      if (!(root instanceof Element)) return;
      if (root.matches(revealSelector) || root.matches(imageSelector)) candidates.add(root);
      root.querySelectorAll(`${revealSelector},${imageSelector}`).forEach(item => candidates.add(item));
    });
    candidates.forEach((target, index) => {
      if (target.classList.contains('is-visible')) return;
      const isImage = target.matches(imageSelector);
      target.classList.add(isImage ? 'motion-reveal-image' : 'motion-reveal');
      if (!target.dataset.reveal) {
        const siblingIndex = [...(target.parentElement?.children || [])].indexOf(target);
        const variant = isImage ? (siblingIndex % 2 ? 'image-right' : 'image-left')
          : target.matches('.project-link,.project-list-card') ? (siblingIndex % 2 ? 'from-right' : 'from-left')
          : target.matches('.cert-link,.detail-card,.certificate-view') ? (siblingIndex % 2 ? 'zoom' : 'blur')
          : target.matches('.hobby-card,.photo-grid,.all-skill-item') ? (siblingIndex % 2 ? 'zoom' : 'from-up')
          : ['from-up','from-left','from-right','blur','zoom'][siblingIndex % 5];
        target.dataset.reveal = variant;
      }
      if (!isImage) target.classList.add(`reveal-${target.dataset.reveal}`);
      const delayIndex = target.parentElement ? [...target.parentElement.children].indexOf(target) : index;
      target.style.setProperty('--reveal-delay', `${Math.max(0, Math.min(delayIndex, 6)) * 55}ms`);
      observer.observe(target);
    });
  };

  window.observePortfolioReveals = elements => reveal(elements);
  if (!reduced && 'IntersectionObserver' in window) {
    document.body.classList.add('motion-ready');
    observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.12, rootMargin: '0px 0px -4% 0px' });
    reveal(document.querySelectorAll(`${revealSelector},${imageSelector}`));
    mutationObserver = new MutationObserver(records => records.forEach(record => reveal(record.addedNodes)));
    mutationObserver.observe(document.body, { childList: true, subtree: true });
  }

  html.classList.add('motion-system-ready');
  let pageLoaded = document.readyState === 'complete';
  let dataReady = typeof window.portfolioDataReady !== 'boolean' || window.portfolioDataReady;
  const finishLoader = () => {
    if (!html.classList.contains('portfolio-first-visit') || !pageLoaded || !dataReady) return;
    html.classList.add('portfolio-loader-leaving');
    window.setTimeout(() => html.classList.remove('portfolio-first-visit', 'portfolio-loader-leaving'), reduced ? 0 : 440);
  };
  if (!pageLoaded) window.addEventListener('load', () => { pageLoaded = true; finishLoader(); }, { once: true });
  if (!dataReady) window.addEventListener('portfolio:data-ready', () => { dataReady = true; finishLoader(); }, { once: true });
  finishLoader();
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
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  art.classList.add('hero-motion-ready');
  if (!window.matchMedia('(pointer: fine)').matches || window.innerWidth < 941) return;

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
      const dx = bounds.left + bounds.width / 2 - (rect.left + rect.width / 2);
      const dy = bounds.top + bounds.height / 2 - (rect.top + rect.height / 2);
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
    pointerX = 0; pointerY = 0;
    if (!frame) frame = requestAnimationFrame(update);
  }, { passive: true });
  window.addEventListener('resize', () => { bounds = null; }, { passive: true });
})();

(() => {
  const sections = [...document.querySelectorAll('#projects, #skills, #certificates, .project-hero, .project-detail')];
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