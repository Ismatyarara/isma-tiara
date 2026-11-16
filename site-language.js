(() => {
  const button = document.querySelector('.language-toggle');
  if (!button) return;
  const labels = {
    en: ['Home', 'About', 'Experience', 'Projects', 'Education', 'Skills', 'Certificates', 'Hobbies', 'Location'],
    id: ['Beranda', 'Tentang', 'Pengalaman', 'Proyek', 'Pendidikan', 'Keahlian', 'Sertifikat', 'Hobi', 'Lokasi'],
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
      '#skills .kicker': 'Skills', '#skills .section-title': 'Tools and skills.', '#skills .section-copy': 'Skills I use to support each project.', '.skills-all-link': 'View All Skills →',
      '#hobbies .kicker': 'Hobbies', '#hobbies .section-title': 'Things I Enjoy', '#hobbies .section-copy': 'Small stories behind the things that keep me inspired.',
      '#certificates>div>div:first-child .kicker': 'Certificates', '#certificates>div>div:first-child .section-title': 'Certificates I have earned.', '#certificates .certificates-head .section-copy': 'Learning milestones and achievements that support my professional journey.', '.certificates-all-link': 'View All Certificates →',
      '#certificates>div>div:first-child>p>a': 'View certificate gallery →', '#certificates>div>div:last-child .section-title': 'Things I enjoy.',
      '#contact .contact-v2-message h2': 'Let’s create something meaningful.', '#contact .contact-v2-message>p:not(.contact-v2-eyebrow)': 'Have a project or an idea, or just want to say hello? I would love to hear from you.', '#contact .contact-v2-message .contact-v2-eyebrow': 'LET’S WORK TOGETHER', '#contact .contact-v2-card .contact-v2-eyebrow': 'GET IN TOUCH',
      '#contact .contact-v2-actions .contact-action-whatsapp span': 'Let’s Talk', '#contact .contact-v2-actions .contact-action-email span': 'Send Email', '.contact-cv-link': 'Download Latest CV ↓', '.cv-link': 'Download CV ↓',
    },
    id: {
      '.hero>div>.hello': 'Halo, saya ✨',
      '.hero>div>h2': 'Dukungan Administrasi, Data Entry & Front-End Developer',
      '.hero>div>p': 'Rapi dalam mengelola data dan sigap menggunakan teknologi. Saya membantu pekerjaan administrasi menjadi lebih mudah dengan solusi digital yang praktis.',
      '.hero .actions .pill:first-child': 'Lihat Karya →', '.hero .actions .pill:last-child': 'Hubungi Saya ✉',
      '#about .about-copy .kicker': '✦ Tentang Saya', '#about .about-copy .section-title': 'Saya bekerja dengan empati, teliti, dan penuh tujuan.',
      '#about .about-copy .section-copy': 'Lulusan Rekayasa Perangkat Lunak SMK Assalaam Bandung dengan pengalaman administrasi dan pengelolaan data, dukungan teknis, organisasi sekolah, serta usaha kecil.',
      '#projects .kicker': 'Proyek Pilihan', '#projects .section-title': 'Karya yang saya kerjakan.', '#projects>.projects-head>.pill': 'Lihat Semua Proyek →',
      '#skills .kicker': 'Keahlian', '#skills .section-title': 'Tools dan kemampuan saya.', '#skills .section-copy': 'Kemampuan yang saya gunakan untuk mendukung setiap proyek.', '.skills-all-link': 'Lihat Semua Skill →',
      '#hobbies .kicker': 'Hobi', '#hobbies .section-title': 'Hal-hal yang Saya Sukai', '#hobbies .section-copy': 'Cerita kecil di balik hal yang selalu memberi saya inspirasi.',
      '#certificates>div>div:first-child .kicker': 'Sertifikat', '#certificates>div>div:first-child .section-title': 'Sertifikat yang saya raih.', '#certificates .certificates-head .section-copy': 'Perjalanan belajar dan pencapaian yang mendukung langkah profesional saya.', '.certificates-all-link': 'Lihat Semua Sertifikat →',
      '#certificates>div>div:first-child>p>a': 'Lihat galeri sertifikat →', '#certificates>div>div:last-child .section-title': 'Hal yang saya sukai.',
      '#contact .contact-v2-message h2': 'Mari buat sesuatu yang bermakna.', '#contact .contact-v2-message>p:not(.contact-v2-eyebrow)': 'Jika kamu memiliki proyek, ide, atau ingin berkenalan, jangan ragu untuk menghubungi saya.', '#contact .contact-v2-message .contact-v2-eyebrow': 'AYO KERJA BERSAMA', '#contact .contact-v2-card .contact-v2-eyebrow': 'HUBUNGI SAYA',
      '#contact .contact-v2-actions .contact-action-whatsapp span': 'Ayo Ngobrol', '#contact .contact-v2-actions .contact-action-email span': 'Kirim Email', '.contact-cv-link': 'Unduh CV Terbaru ↓', '.cv-link': 'Unduh CV ↓',
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
    document.querySelectorAll('[data-language-id][data-language-en]').forEach(element => { element.textContent = language === 'id' ? element.dataset.languageId : element.dataset.languageEn; });
    localStorage.setItem('isma-portfolio-language', language);
  }
  button.addEventListener('click', () => { language = language === 'id' ? 'en' : 'id'; apply(); });
  apply();
})();