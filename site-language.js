(() => {
  const button = document.querySelector('.language-toggle');
  if (!button) return;
  const labels = {
    en: ['Home', 'About', 'Experience', 'Projects', 'Education', 'Skills', 'Certificates', 'Hobbies'],
    id: ['Beranda', 'Tentang', 'Pengalaman', 'Proyek', 'Pendidikan', 'Keahlian', 'Sertifikat', 'Hobi'],
  };
  const translations = {
    en: {
      '.hero>div>.hello': "Hello, I'm ✨",
      '.hero>div>h2': 'Administrative Support, IT Support & Front-End Developer',
      '.hero>div>p': 'Detail-oriented in data management, technical support, and production quality checks. Quick to learn and comfortable working collaboratively.',
      '.hero .actions .pill:first-child': 'View My Work →', '.hero .actions .pill:last-child': 'Contact Me ✉',
      '#about .about-copy .kicker': '✦ About Me', '#about .about-copy .section-title': 'Detail-oriented, adaptable, and ready to learn.',
      '#about .about-copy .section-copy': 'A Software Engineering graduate with experience in technical support, garment quality inspection, data administration, and customer service. Comfortable with documentation, distribution planning, and teamwork; ready to grow across technology, administration, production, and service roles.',
      '#projects .kicker': 'Featured Projects', '#projects .section-title': 'Selected work.', '#projects>.projects-head>.pill': 'View All Projects →',
      '#skills .kicker': 'Skills', '#skills .section-title': 'Tools and skills.', '#skills .section-copy': 'Skills I use to support each project.',
      '#certificates>div>div:first-child .kicker': 'Certificates', '#certificates>div>div:first-child .section-title': 'Certificates I have earned.',
      '#certificates>div>div:first-child>p>a': 'View certificate gallery →', '#certificates>div>div:last-child .section-title': 'Things I enjoy.',
      '#contact>div>h2': 'Let’s create something meaningful.', '#contact>div>p:not(.kicker)': 'Have a project or an idea, or just want to say hello? I would love to hear from you.',
      '#contact .actions .pill': 'Get In Touch →', '.location-copy .kicker': 'MY LOCATION', '.location-copy>p:not(.kicker)': 'West Java, Indonesia', '.location-copy .pill': 'Open in Google Maps ↗', '.cv-link': 'Download CV ↓',
    },
    id: {
      '.hero>div>.hello': 'Halo, saya ✨',
      '.hero>div>h2': 'Dukungan Administrasi, IT Support & Front-End Developer',
      '.hero>div>p': 'Teliti mengelola data, memberi dukungan teknis, dan memeriksa kualitas produksi. Cepat belajar dan terbiasa bekerja bersama tim.',
      '.hero .actions .pill:first-child': 'Lihat Karya →', '.hero .actions .pill:last-child': 'Hubungi Saya ✉',
      '#about .about-copy .kicker': '✦ Tentang Saya', '#about .about-copy .section-title': 'Teliti, adaptif, dan siap belajar.',
      '#about .about-copy .section-copy': 'Lulusan Rekayasa Perangkat Lunak dengan pengalaman di dukungan teknis, pemeriksaan kualitas produksi garmen, administrasi data, dan pelayanan pelanggan. Terbiasa membuat dokumentasi, mengatur distribusi, dan berkoordinasi dalam tim. Siap berkembang di bidang teknologi, administrasi, produksi, maupun layanan.',
      '#projects .kicker': 'Proyek Pilihan', '#projects .section-title': 'Karya yang saya kerjakan.', '#projects>.projects-head>.pill': 'Lihat Semua Proyek →',
      '#skills .kicker': 'Keahlian', '#skills .section-title': 'Tools dan kemampuan saya.', '#skills .section-copy': 'Kemampuan yang saya gunakan untuk mendukung setiap proyek.',
      '#certificates>div>div:first-child .kicker': 'Sertifikat', '#certificates>div>div:first-child .section-title': 'Sertifikat yang saya raih.',
      '#certificates>div>div:first-child>p>a': 'Lihat galeri sertifikat →', '#certificates>div>div:last-child .section-title': 'Hal yang saya sukai.',
      '#contact>div>h2': 'Mari buat sesuatu yang bermakna.', '#contact>div>p:not(.kicker)': 'Jika kamu memiliki proyek, ide, atau ingin berkenalan, jangan ragu untuk menghubungi saya.',
      '#contact .actions .pill': 'Hubungi Saya →', '.location-copy .kicker': 'Lokasi Saya', '.location-copy>p:not(.kicker)': 'Jawa Barat, Indonesia', '.location-copy .pill': 'Lihat di Google Maps ↗', '.cv-link': 'Unduh CV ↓',
    },
  };
  let language = localStorage.getItem('isma-portfolio-language') === 'en' ? 'en' : 'id';
  function apply() {
    document.documentElement.lang = language;
    button.textContent = language === 'id' ? 'ID / EN' : 'EN / ID';
    button.setAttribute('aria-label', language === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia');
    document.querySelectorAll('.nav-links a').forEach((link, i) => { if (labels[language][i]) link.textContent = labels[language][i]; });
    for (const [selector, content] of Object.entries(translations[language])) {
      const element = document.querySelector(selector);
      if (!element) continue;
      if (!element.dataset.original) element.dataset.original = element.innerHTML;
      element.innerHTML = content;
    }
    if (language === 'id') {
      for (const [selector, content] of Object.entries(translations.en)) {
        const element = document.querySelector(selector);
        if (element?.dataset.original) element.innerHTML = element.dataset.original;
      }
      document.querySelectorAll('.nav-links a').forEach((link, i) => { const idLabels = ['Home', 'About', 'Experience', 'Projects', 'Education', 'Skills', 'Certificates', 'Hobbies']; if (idLabels[i] && !link.dataset.baseLabel) link.dataset.baseLabel = idLabels[i]; if (link.dataset.baseLabel) link.textContent = link.dataset.baseLabel; });
    }
    localStorage.setItem('isma-portfolio-language', language);
  }
  button.addEventListener('click', () => { language = language === 'id' ? 'en' : 'id'; apply(); });
  apply();
})();
