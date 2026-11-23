(() => {
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const form = document.querySelector('#collaborationForm');
  const note = document.querySelector('#formMessage');
  const started = Date.now();
  document.querySelector('#formStartedAt').value = String(started);
  document.querySelector('#collabYear').textContent = new Date().getFullYear();

  function safeUrl(value) {
    try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : ''; } catch { return ''; }
  }
  function addContact(list, { label, value, href, icon }) {
    if (!value || !href) return;
    list.push(`<a class="contact-link" href="${esc(href)}"${href.startsWith('https:') ? ' target="_blank" rel="noopener noreferrer"' : ''}><span class="contact-icon" aria-hidden="true">${esc(icon)}</span><span class="contact-link-copy"><strong>${esc(label)}</strong><small>${esc(value)}</small></span></a>`);
  }
  function render(data) {
    const info = data?.collaboration?.[0] || {};
    const list = [];
    if (info.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email)) addContact(list, { label: 'Email', value: info.email, href: `mailto:${info.email}`, icon: '@' });
    const digits = String(info.whatsapp || '').replace(/\D/g, '');
    if (digits) addContact(list, { label: 'WhatsApp', value: info.whatsapp, href: `https://wa.me/${digits}`, icon: 'WA' });
    const github = safeUrl(info.github);
    if (github) addContact(list, { label: 'GitHub', value: github.replace(/^https?:\/\//, ''), href: github, icon: 'GH' });
    const linkedin = safeUrl(info.linkedin);
    if (linkedin) addContact(list, { label: 'LinkedIn', value: linkedin.replace(/^https?:\/\//, ''), href: linkedin, icon: 'in' });
    const instagram = safeUrl(info.instagram);
    if (instagram) addContact(list, { label: 'Instagram', value: instagram.replace(/^https?:\/\//, ''), href: instagram, icon: 'IG' });
    addContact(list, { label: 'Portfolio website', value: location.host, href: location.origin, icon: 'IT' });
    document.querySelector('#contactLinks').innerHTML = list.join('');
    const availability = String(info.availability || '').trim();
    const badge = document.querySelector('#availability');
    if (availability && availability !== 'Tidak ditampilkan') {
      document.querySelector('#availabilityText').textContent = availability;
      badge.hidden = false;
    } else badge.hidden = true;
  }

  getData().then(render).catch(() => render({}));
  form.addEventListener('input', event => event.target.removeAttribute('aria-invalid'));
  form.addEventListener('submit', async event => {
    event.preventDefault();
    note.textContent = '';
    note.removeAttribute('data-state');
    const requiredFields = [...form.querySelectorAll('[required]')];
    const invalid = requiredFields.find(field => !field.value.trim() || !field.checkValidity());
    if (invalid) {
      invalid.setAttribute('aria-invalid', 'true');
      note.textContent = invalid.validity.typeMismatch ? 'Gunakan alamat email yang valid.' : 'Lengkapi semua kolom dengan benar.';
      note.dataset.state = 'error';
      invalid.focus();
      return;
    }
    const button = document.querySelector('#submitMessage');
    const values = Object.fromEntries(new FormData(form));
    values.startedAt = started;
    button.disabled = true;
    button.querySelector('span:first-child').textContent = 'Mengirim…';
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) throw new Error(result.error || 'Pesan belum berhasil dikirim. Coba lagi nanti.');
      note.textContent = result.emailStatus === 'sent' ? 'Pesan berhasil dikirim. Terima kasih sudah menghubungi.' : result.emailStatus === 'failed' ? 'Pesan sudah tersimpan di inbox portfolio, tetapi notifikasi email admin gagal dikirim.' : 'Pesan berhasil masuk ke inbox portfolio. Notifikasi email belum aktif.';
      note.dataset.state = 'success';
      form.reset();
      document.querySelector('#formStartedAt').value = String(Date.now());
    } catch (error) {
      note.textContent = error.message || 'Koneksi gagal. Pesan belum terkirim.';
      note.dataset.state = 'error';
    } finally {
      button.disabled = false;
      button.querySelector('span:first-child').textContent = 'Kirim pesan';
    }
  });
})();
