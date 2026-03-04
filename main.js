// ============================================
// EMS – European Mining Summit
// ============================================

// --- Navbar scroll effect ---
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('nav--scrolled', window.scrollY > 40);
});

// --- Mobile nav toggle ---
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// --- Countdown timer ---
const EVENT_DATE = new Date('2026-09-23T08:00:00+03:00'); // Helsinki time (EEST)

function updateCountdown() {
  const now = new Date();
  const diff = EVENT_DATE - now;

  if (diff <= 0) {
    document.getElementById('cd-days').textContent = '000';
    document.getElementById('cd-hours').textContent = '00';
    document.getElementById('cd-mins').textContent = '00';
    document.getElementById('cd-secs').textContent = '00';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  document.getElementById('cd-days').textContent = String(days).padStart(3, '0');
  document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cd-mins').textContent = String(mins).padStart(2, '0');
  document.getElementById('cd-secs').textContent = String(secs).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// --- Scroll reveal animations ---
const revealElements = document.querySelectorAll(
  '.feature, .speaker, .schedule__item, .event-details__card, .sponsor-tier, .form'
);

revealElements.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

revealElements.forEach(el => observer.observe(el));

// --- Form handling ---
function handleForm(formId, successId) {
  const form = document.getElementById(formId);
  if (!form) return;
  const success = document.getElementById(successId);

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending...';

    try {
      const res = await fetch('https://formspree.io/f/mreaepwd', {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        if (success) success.classList.add('show');
        form.reset();
      } else {
        btn.textContent = 'Error – try again';
      }
    } catch {
      btn.textContent = 'Error – try again';
    }

    btn.disabled = false;
    if (!btn.textContent.startsWith('Error')) {
      btn.textContent = 'Send Inquiry';
    }
  });
}

handleForm('sponsor-form', 'sponsor-success');
