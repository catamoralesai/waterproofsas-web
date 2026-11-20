// ===== MOBILE NAV TOGGLE =====
const navToggle = document.querySelector('.nav-toggle');
const siteNav   = document.querySelector('.site-nav');

navToggle?.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
});

// Close nav when a link is clicked (mobile)
siteNav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.site-nav a[href^="#"]');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === '#' + entry.target.id
        );
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => observer.observe(s));

// ===== FOOTER YEAR =====
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== CONTACT FORM — submits to Google Forms via hidden iframe =====
const contactForm   = document.getElementById('contacto-form');
const submitBtn     = document.getElementById('form-submit-btn');
const successMsg    = document.getElementById('form-success');
const gformIframe   = document.getElementById('gform_target');

function validateForm(form) {
  const nombre  = form.querySelector('#nombre').value.trim();
  const email   = form.querySelector('#email').value.trim();
  const mensaje = form.querySelector('#mensaje').value.trim();
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!nombre)              { alert('Por favor ingresa tu nombre.'); return false; }
  if (!emailRe.test(email)) { alert('Por favor ingresa un correo válido.'); return false; }
  if (!mensaje)             { alert('Por favor escribe un mensaje.'); return false; }
  return true;
}

contactForm?.addEventListener('submit', e => {
  if (!validateForm(contactForm)) { e.preventDefault(); return; }

  // Show loading state
  submitBtn.textContent = 'Enviando...';
  submitBtn.disabled = true;
});

// Google Forms redirects into the hidden iframe — we catch that load event
gformIframe?.addEventListener('load', () => {
  // Iframe loads once on page init (blank) — only act after a real submission
  if (!submitBtn?.disabled) return;

  successMsg.style.display = 'block';
  submitBtn.style.display  = 'none';
  contactForm.reset();

  // Reset after 6 seconds
  setTimeout(() => {
    successMsg.style.display = 'none';
    submitBtn.style.display  = '';
    submitBtn.textContent    = 'Enviar mensaje';
    submitBtn.disabled       = false;
  }, 6000);
});

// ===== SCROLL-IN ANIMATIONS (respects reduced motion) =====
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const animEls = document.querySelectorAll(
    '.servicio-card, .cliente-item, .porque-item, .stat-card'
  );
  const fadeIn = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        fadeIn.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    fadeIn.observe(el);
  });
}
