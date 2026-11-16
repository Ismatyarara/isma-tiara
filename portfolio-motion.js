(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = document.querySelectorAll('.section:not(.hero), .skill-group, .cert, .hobby-card');
  if (reduced || !('IntersectionObserver' in window)) return;
  document.body.classList.add('motion-ready');
  targets.forEach(target => target.classList.add('motion-reveal'));
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }), { threshold: 0.12 });
  targets.forEach(target => observer.observe(target));
})();
