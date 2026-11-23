(function () {
  const categories = [
    { key: 'all', label: 'All Projects' },
    { key: 'Website', label: 'Website' },
    { key: 'Mobile App', label: 'Mobile App' },
    { key: 'Design', label: 'Design' },
    { key: 'Video', label: 'Video' },
    { key: 'Photography', label: 'Photography' }
  ];

  function categoryFor(project) {
    const category = String(project?.kategori_id || '').trim().toLocaleLowerCase();
    if (/mobile|application|\bapp\b/.test(category)) return 'Mobile App';
    if (/website|\bweb\b/.test(category)) return 'Website';
    if (/design|\bui\b|\bux\b|graphic/.test(category)) return 'Design';
    if (/video|film/.test(category)) return 'Video';
    if (/photograph|\bphoto\b/.test(category)) return 'Photography';
    return '';
  }

  function filterProjects(projects, category = 'all', query = '') {
    const search = String(query).trim().toLocaleLowerCase();
    return (Array.isArray(projects) ? projects : []).filter(project =>
      (category === 'all' || categoryFor(project) === category) &&
      String(project?.nama_proyek || '').toLocaleLowerCase().includes(search)
    );
  }

  function paginateProjects(projects, page = 1, pageSize = 6) {
    const items = Array.isArray(projects) ? projects : [];
    const size = Math.max(1, Math.floor(Number(pageSize) || 6));
    const totalPages = Math.max(1, Math.ceil(items.length / size));
    const currentPage = Math.min(Math.max(1, Math.floor(Number(page) || 1)), totalPages);
    return {
      page: currentPage,
      pageSize: size,
      totalItems: items.length,
      totalPages,
      items: items.slice((currentPage - 1) * size, currentPage * size)
    };
  }

  function visiblePages(totalPages, page, windowSize = 5) {
    const count = Math.max(1, Math.floor(Number(totalPages) || 1));
    const size = Math.min(count, Math.max(1, Math.floor(Number(windowSize) || 5)));
    const current = Math.min(Math.max(1, Math.floor(Number(page) || 1)), count);
    const first = Math.max(1, Math.min(current - Math.floor(size / 2), count - size + 1));
    return Array.from({ length: size }, (_, index) => first + index);
  }

  const model = { categories, categoryFor, filterProjects, paginateProjects, visiblePages };
  if (typeof window !== 'undefined') window.ProjectGallery = model;
  if (typeof module !== 'undefined' && module.exports) module.exports = model;
})();
