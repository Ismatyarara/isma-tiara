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
      '.hero>div>h2': 'Administrative Support, Data Entry & Front-End Developer',
      '.hero>div>p': 'Organized with data and comfortable with technology. I make administrative work and data management easier through practical digital solutions.',
      '.hero .actions .pill:first-child': 'View My Work →', '.hero .actions .pill:last-child': 'Contact Me ✉',
      '#about .about-copy .kicker': '✦ About Me', '#about .about-copy .section-title': 'I work with empathy, care, and purpose.',
      '#about .about-copy .section-copy': 'A Software Engineering graduate from SMK Assalaam Bandung with experience in administration and data management, technical support, school organizations, and small business operations.',
      '#projects .kicker': 'Featured Projects', '#projects .section-title': 'Selected work.', '#projects>.projects-head>.pill': 'View All Projects →',
      '#skills .kicker': 'Skills', '#skills .section-title': 'Tools and skills.', '#skills .section-copy': 'Skills I use to support each project.',
      '#certificates>div>div:first-child .kicker': 'Certificates', '#certificates>div>div:first-child .section-title': 'Certificates I have earned.',
      '#certificates>div>div:first-child>p>a': 'View certificate gallery →', '#certificates>div>div:last-child .section-title': 'Things I enjoy.',
      '#contact>div>h2': 'Let’s create something meaningful.', '#contact>div>p:not(.kicker)': 'Have a project or an idea, or just want to say hello? I would love to hear from you.',
      '#contact .actions .pill': 'Get In Touch →', '.maps-link': '📍 View on Google Maps ↗', '.cv-link': 'Download CV ↓',
    },
    id: {
      '.hero>div>.hello': 'Halo, saya ✨',
      '.hero>div>h2': 'Dukungan Administrasi, Data Entry & Front-End Developer',
      '.hero>div>p': 'Rapi dalam mengelola data dan sigap menggunakan teknologi. Saya membantu pekerjaan administrasi menjadi lebih mudah dengan solusi digital yang praktis.',
      '.hero .actions .pill:first-child': 'Lihat Karya →', '.hero .actions .pill:last-child': 'Hubungi Saya ✉',
      '#about .about-copy .kicker': '✦ Tentang Saya', '#about .about-copy .section-title': 'Saya bekerja dengan empati, teliti, dan penuh tujuan.',
      '#about .about-copy .section-copy': 'Lulusan Rekayasa Perangkat Lunak SMK Assalaam Bandung dengan pengalaman administrasi dan pengelolaan data, dukungan teknis, organisasi sekolah, serta usaha kecil.',
      '#projects .kicker': 'Proyek Pilihan', '#projects .section-title': 'Karya yang saya kerjakan.', '#projects>.projects-head>.pill': 'Lihat Semua Proyek →',
      '#skills .kicker': 'Keahlian', '#skills .section-title': 'Tools dan kemampuan saya.', '#skills .section-copy': 'Kemampuan yang saya gunakan untuk mendukung setiap proyek.',
      '#certificates>div>div:first-child .kicker': 'Sertifikat', '#certificates>div>div:first-child .section-title': 'Sertifikat yang saya raih.',
      '#certificates>div>div:first-child>p>a': 'Lihat galeri sertifikat →', '#certificates>div>div:last-child .section-title': 'Hal yang saya sukai.',
      '#contact>div>h2': 'Mari buat sesuatu yang bermakna.', '#contact>div>p:not(.kicker)': 'Jika kamu memiliki proyek, ide, atau ingin berkenalan, jangan ragu untuk menghubungi saya.',
      '#contact .actions .pill': 'Hubungi Saya →', '.maps-link': '📍 Lihat di Google Maps ↗', '.cv-link': 'Unduh CV ↓',
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
