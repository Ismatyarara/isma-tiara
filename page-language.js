(() => {
  const toggle = document.querySelector('.language-toggle');
  if (!toggle) return;
  let language = localStorage.getItem('isma-portfolio-language') === 'en' ? 'en' : 'id';
  const apply = () => {
    document.documentElement.lang = language;
    toggle.textContent = language === 'id' ? 'ID / EN' : 'EN / ID';
    toggle.setAttribute('aria-label', language === 'id' ? 'Ganti ke Bahasa Inggris' : 'Switch to Bahasa Indonesia');
    const copy = language === 'en'
      ? { '← Portfolio': '← Portfolio', '← Semua sertifikat': '← All certificates', '← Semua hobi': '← All hobbies', '← Kembali ke semua proyek': '← Back to all projects', 'Lihat detail proyek': 'View project details', 'Lihat Sertifikat ↗': 'View Certificate ↗', 'Lihat Detail →': 'View Details →', 'Detail': 'Details', 'Penerbit': 'Issuer', 'Tahun': 'Year', 'Buka PDF di tab baru ↗': 'Open PDF in new tab ↗', 'Buka kredensial ↗': 'Open credential ↗', 'Belum ada sertifikat.': 'No certificates yet.', 'Belum ada hobi.': 'No hobbies yet.', 'Hobi & Minat': 'Hobbies & Interests', 'Koleksi proyek web, desain, dan aplikasi. Pilih karya untuk membaca detail serta melihat galeri yang terkait dengan proyek tersebut.': 'A collection of web, design, and app projects. Choose a project to see its details and image gallery.', 'Lihat detail proyek →': 'View project details →', 'Lihat detail proyek': 'View project details', 'Lihat di Google Maps ↗': 'View on Google Maps ↗' }
      : { '← Portfolio': '← Portfolio', '← All certificates': '← Semua sertifikat', '← All hobbies': '← Semua hobi', '← Back to all projects': '← Kembali ke semua proyek', 'View project details': 'Lihat detail proyek', 'View Certificate ↗': 'Lihat Sertifikat ↗', 'View Details →': 'Lihat Detail →', 'Details': 'Detail', 'Issuer': 'Penerbit', 'Year': 'Tahun', 'Open PDF in new tab ↗': 'Buka PDF di tab baru ↗', 'Open credential ↗': 'Buka kredensial ↗', 'No certificates yet.': 'Belum ada sertifikat.', 'No hobbies yet.': 'Belum ada hobi.', 'Hobbies & Interests': 'Hobi & Minat', 'A collection of web, design, and app projects. Choose a project to see its details and image gallery.': 'Koleksi proyek web, desain, dan aplikasi. Pilih karya untuk membaca detail serta melihat galeri yang terkait dengan proyek tersebut.', 'View project details →': 'Lihat detail proyek →', 'View project details': 'Lihat detail proyek', 'View on Google Maps ↗': 'Lihat di Google Maps ↗' };
    document.querySelectorAll('.back-link,.project-back,.card-cta,.project-more,.certificate-info .eyebrow,.certificate-info dt,.action-link,.empty-state,.detail-hero .eyebrow,.project-intro,.maps-link').forEach(element => {
      if (!element.dataset.languageOriginal) element.dataset.languageOriginal = element.textContent;
      const original = element.dataset.languageOriginal.trim();
      element.textContent = copy[original] || original;
    });
    localStorage.setItem('isma-portfolio-language', language);
  };
  toggle.addEventListener('click', () => { language = language === 'id' ? 'en' : 'id'; apply(); });
  apply();
})();
