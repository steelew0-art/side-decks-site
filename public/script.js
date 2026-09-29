const form = document.querySelector('#projectForm');
const input = document.querySelector('#projectFiles');
const fileList = document.querySelector('#fileList');
const status = document.querySelector('#formStatus');
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('#mainNav');
const maxFiles = 8;
const maxSize = 10 * 1024 * 1024;

navToggle?.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('#mainNav a').forEach(link => link.addEventListener('click', () => {
  mainNav.classList.remove('open');
  navToggle?.setAttribute('aria-expanded', 'false');
}));

input.addEventListener('change', () => {
  fileList.innerHTML = '';
  const files = [...input.files];
  if (files.length > maxFiles) {
    status.textContent = `Please choose no more than ${maxFiles} files.`;
    status.className = 'status error'; status.style.display = 'block';
    input.value = '';
    return;
  }
  for (const file of files) {
    const item = document.createElement('div');
    item.className = 'file-item';
    item.textContent = `${file.name} · ${(file.size / 1024 / 1024).toFixed(1)} MB`;
    fileList.appendChild(item);
  }
  status.style.display = 'none';
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  status.style.display = 'none';
  const files = [...input.files];
  if (files.some(f => f.size > maxSize)) {
    status.textContent = 'Each uploaded file must be 10 MB or smaller.';
    status.className = 'status error'; status.style.display = 'block'; return;
  }
  const submit = form.querySelector('button[type=submit]');
  submit.disabled = true; submit.textContent = 'Sending…';
  try {
    const response = await fetch('/api/quote', { method: 'POST', body: new FormData(form) });
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.message || 'Unable to send.');
    form.reset(); fileList.innerHTML = '';
    status.textContent = data.message; status.className = 'status'; status.style.display = 'block';
    status.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } catch (err) {
    status.textContent = err.message || 'Something went wrong. Please try again.';
    status.className = 'status error'; status.style.display = 'block';
  } finally { submit.disabled = false; submit.innerHTML = 'Send Project Inquiry <span>→</span>'; }
});

document.querySelector('#year').textContent = new Date().getFullYear();
