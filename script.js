const CONTACT_FORM_ENDPOINT = 'https://formspree.io/f/xzdqkvra';

// Listing photo gallery swap
function swapPhoto(thumb) {
  const main = document.getElementById('main-photo');
  if (main) {
    main.src = thumb.src;
    thumb.closest('.listing-thumbs').querySelectorAll('img').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
  }
}

function swapPhotoSurrey(thumb) {
  const main = document.getElementById('main-photo-surrey');
  if (main) {
    main.src = thumb.src;
    thumb.closest('.listing-thumbs').querySelectorAll('img').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
  }
}

// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  // Close nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// Smooth close nav on outside click
document.addEventListener('click', (e) => {
  if (navLinks && !navLinks.contains(e.target) && !toggle.contains(e.target)) {
    navLinks.classList.remove('open');
  }
});

// Contact form — Formspree JSON POST (same endpoint as guide pages)
function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const success = document.getElementById('form-success');
  const errorEl = document.getElementById('form-error');
  const originalLabel = btn.textContent;

  if (success) success.style.display = 'none';
  if (errorEl) errorEl.style.display = 'none';

  btn.textContent = 'Sending...';
  btn.disabled = true;

  const payload = {
    name: form.name.value,
    email: form.email.value,
    phone: form.phone.value,
    interest: form.interest.value,
    message: form.message.value,
    _subject: 'New contact form: patmiazga.com'
  };

  fetch(CONTACT_FORM_ENDPOINT, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
    .then((res) => {
      if (!res.ok) throw new Error('Form submission failed');
      return res.json().catch(() => ({}));
    })
    .then(() => {
      btn.style.display = 'none';
      if (success) success.style.display = 'block';
      form.reset();
    })
    .catch(() => {
      btn.disabled = false;
      btn.textContent = originalLabel;
      btn.style.display = '';
      if (errorEl) errorEl.style.display = 'block';
    });
}

// Nav scroll effect
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    nav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
  } else {
    nav.style.boxShadow = 'none';
  }
});
