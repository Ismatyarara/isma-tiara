(() => {
  const html = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealSelector = [
    '.about-copy', '.journey', '.exp-card', '.edu-banner', '.stat-card',
    '.project-link', '.project-list-card', '.skill-category', '.cert-link', '.hobby-card',
    '.contact-v2-message', '.contact-v2-card', '.location-card', '.location-map',
    '.detail-grid > .detail-card', '.detail-gallery', '.activity-photo', '.hobby-heading',
    '.certificate-detail', '.certificate-layout', '.case-section', '.case-sidebar',
    '.case-navigation', '.detail-hero', '.detail-meta', '.detail-title', '.detail-lead',
    '.case-cover', '.project-back',
  ].join(',');
  const imageSelector = [
    '.project-media img', '.project-list-media img', '.detail-cover img', '.case-cover img',
    '.gallery-grid img', '.photo-grid img', '.card-media img', '.hobby-cover-image',
    '.certificate-preview-image', '.certificate-image',
  ].join(',');

  let observer = null;
  let mutationObserver = null;

  const reveal = roots => {
    if (!observer || reduced) return;
    const targets = new Set();
    roots.forEach(root => {
      if (!(root instanceof Element)) return;
      if (root.matches(revealSelector) || root.matches(imageSelector)) targets.add(root);
      root.querySelectorAll(`${revealSelector},${imageSelector}`).forEach(target => targets.add(target));
    });

    targets.forEach(target => {
      if (target.classList.contains('is-visible')) return;
      const isImage = target.matches(imageSelector);
      target.classList.add(isImage ? 'motion-reveal-image' : 'motion-reveal');
      const siblingIndex = [...(target.parentElement?.children || [])].indexOf(target);
      target.style.setProperty('--reveal-delay', `${Math.min(Math.max(siblingIndex, 0), 3) * 45}ms`);
      observer.observe(target);
    });
  };

  window.observePortfolioReveals = elements => reveal(elements);
  if (!reduced && 'IntersectionObserver' in window) {
    try {
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0, rootMargin: '0px 0px 80px 0px' });
      reveal(document.querySelectorAll(`${revealSelector},${imageSelector}`));
      html.classList.add('motion-ready');
      mutationObserver = new MutationObserver(records => records.forEach(record => reveal(record.addedNodes)));
      mutationObserver.observe(document.body, { childList: true, subtree: true });
    } catch {
      html.classList.remove('motion-ready');
      mutationObserver?.disconnect();
      observer?.disconnect();
      observer = null;
    }
  }

  let pageLoaded = document.readyState === 'complete';
  let dataReady = typeof window.portfolioDataReady !== 'boolean' || window.portfolioDataReady;
  const finishLoader = () => {
    if (!html.classList.contains('portfolio-first-visit') || !pageLoaded || !dataReady) return;
    html.classList.add('portfolio-loader-leaving');
    window.setTimeout(() => html.classList.remove('portfolio-first-visit', 'portfolio-loader-leaving'), reduced ? 0 : 360);
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
  let bounds = null;
  let badgeCenters = [];
  const cacheGeometry = () => {
    bounds = art.getBoundingClientRect();
    badgeCenters = badges.map(badge => {
      const rect = badge.getBoundingClientRect();
      return { x: rect.left + rect.width / 2 - bounds.left - bounds.width / 2, y: rect.top + rect.height / 2 - bounds.top - bounds.height / 2 };
    });
  };
  const update = () => {
    frame = 0;
    if (!bounds) return;
    const x = pointerX / bounds.width * 12;
    const y = pointerY / bounds.height * 12;
    art.style.setProperty('--blob-x', `${x * -.2}px`);
    art.style.setProperty('--blob-y', `${y * -.2}px`);
    art.style.setProperty('--orbit-x', `${x * -.3}px`);
    art.style.setProperty('--orbit-y', `${y * -.3}px`);
    art.style.setProperty('--decor-x', `${x * -.4}px`);
    art.style.setProperty('--decor-y', `${y * -.4}px`);
    art.style.setProperty('--portrait-x', `${x * .12}px`);
    art.style.setProperty('--portrait-y', `${y * .12}px`);
    badges.forEach((badge, index) => {
      const center = badgeCenters[index];
      const dx = pointerX - center.x;
      const dy = pointerY - center.y;
      const distance = Math.hypot(dx, dy);
      const reach = 115;
      if (distance >= reach) {
        badge.classList.remove('is-magnetic');
        badge.style.setProperty('--magnet-x', '0px');
        badge.style.setProperty('--magnet-y', '0px');
        return;
      }
      const strength = (1 - distance / reach) * 3;
      badge.classList.add('is-magnetic');
      badge.style.setProperty('--magnet-x', `${dx / (distance || 1) * strength}px`);
      badge.style.setProperty('--magnet-y', `${dy / (distance || 1) * strength}px`);
    });
  };
  const scheduleUpdate = () => { if (!frame) frame = requestAnimationFrame(update); };
  art.addEventListener('pointerenter', cacheGeometry, { passive: true });
  art.addEventListener('pointermove', event => {
    if (!bounds) cacheGeometry();
    pointerX = event.clientX - bounds.left - bounds.width / 2;
    pointerY = event.clientY - bounds.top - bounds.height / 2;
    scheduleUpdate();
  }, { passive: true });
  art.addEventListener('pointerleave', () => {
    pointerX = 0;
    pointerY = 0;
    ['--blob-x','--blob-y','--orbit-x','--orbit-y','--decor-x','--decor-y','--portrait-x','--portrait-y'].forEach(property => art.style.setProperty(property, '0px'));
    badges.forEach(badge => {
      badge.classList.remove('is-magnetic');
      badge.style.setProperty('--magnet-x', '0px');
      badge.style.setProperty('--magnet-y', '0px');
    });
  }, { passive: true });
  window.addEventListener('resize', () => { bounds = null; badgeCenters = []; }, { passive: true });
})();
