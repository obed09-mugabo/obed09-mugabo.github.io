/*
  Site Tourisme - Interactions
  - Menu hamburger
  - Slider page d'accueil
  - Validation des formulaires (réservation, contact)
  - Lien actif dans la navigation
*/

document.addEventListener('DOMContentLoaded', () => {
  initializeThemeToggle();
  initializeActiveNavLink();
  initializeHamburgerMenu();
  initializeHeroSlider();
  initializeReservationFormValidation();
  initializeContactFormValidation();
});

function initializeActiveNavLink() {
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === current) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function initializeHamburgerMenu() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Ferme le menu sur navigation
  menu.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    })
  );
}

function initializeHeroSlider() {
  const slider = document.querySelector('.slider');
  if (!slider) return;

  const slidesTrack = slider.querySelector('.slides');
  const slides = Array.from(slider.querySelectorAll('.slide'));
  const prevBtn = slider.querySelector('[data-dir="prev"]');
  const nextBtn = slider.querySelector('[data-dir="next"]');

  let index = 0;

  function update() {
    const offset = -index * 100;
    slidesTrack.style.transform = `translateX(${offset}%)`;
  }

  function goNext() {
    index = (index + 1) % slides.length;
    update();
  }
  function goPrev() {
    index = (index - 1 + slides.length) % slides.length;
    update();
  }

  nextBtn?.addEventListener('click', goNext);
  prevBtn?.addEventListener('click', goPrev);

  // Auto-play
  let autoplay = setInterval(goNext, 5000);
  slider.addEventListener('mouseenter', () => clearInterval(autoplay));
  slider.addEventListener('mouseleave', () => (autoplay = setInterval(goNext, 5000)));
}

function initializeReservationFormValidation() {
  const form = document.getElementById('reservation-form');
  if (!form) return;

  const nameInput = form.querySelector('input[name="name"]');
  const emailInput = form.querySelector('input[name="email"]');
  const phoneInput = form.querySelector('input[name="phone"]');
  const dateInput = form.querySelector('input[name="date"]');
  const peopleInput = form.querySelector('input[name="people"]');
  const messageInput = form.querySelector('textarea[name="message"]');
  const feedback = form.querySelector('[data-feedback]');

  // Empêche la sélection d'une date passée (attribut min dynamique)
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.setAttribute('min', `${yyyy}-${mm}-${dd}`);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const errors = [];

    // Nom
    if (!nameInput.value.trim()) errors.push('Le nom est requis.');

    // Email
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!email) errors.push("L'email est requis.");
    else if (!emailRegex.test(email)) errors.push("L'email n'est pas valide.");

    // Téléphone (basique)
    const phone = phoneInput.value.trim();
    const phoneRegex = /^[0-9+()\-\s]{6,}$/;
    if (!phone) errors.push('Le numéro de téléphone est requis.');
    else if (!phoneRegex.test(phone)) errors.push('Le numéro de téléphone est invalide.');

    // Date (future)
    const dateVal = dateInput.value;
    if (!dateVal) errors.push('La date est requise.');
    else {
      const selected = new Date(dateVal);
      const today = new Date();
      today.setHours(0,0,0,0);
      if (selected < today) errors.push('La date doit être dans le futur.');
    }

    // Nombre de personnes
    const people = parseInt(peopleInput.value, 10);
    if (!Number.isFinite(people) || people < 1) errors.push('Le nombre de personnes doit être au moins 1.');

    // Message facultatif — pas de validation stricte
    if (messageInput.value.length > 800) errors.push('Le message est trop long (800 caractères max).');

    if (errors.length) {
      feedback.className = 'error';
      feedback.textContent = errors.join(' ');
      feedback.hidden = false;
      return;
    }

    // Simulation d'envoi pour démo
    feedback.className = 'success';
    feedback.textContent = 'Votre réservation a bien été enregistrée. Vous recevrez un email de confirmation.';
    feedback.hidden = false;
    form.reset();
  });
}

function initializeContactFormValidation() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = form.querySelector('input[name="name"]');
  const emailInput = form.querySelector('input[name="email"]');
  const messageInput = form.querySelector('textarea[name="message"]');
  const feedback = form.querySelector('[data-feedback]');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const errors = [];

    if (!nameInput.value.trim()) errors.push('Le nom est requis.');

    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!email) errors.push("L'email est requis.");
    else if (!emailRegex.test(email)) errors.push("L'email n'est pas valide.");

    if (!messageInput.value.trim()) errors.push('Le message est requis.');

    if (errors.length) {
      feedback.className = 'error';
      feedback.textContent = errors.join(' ');
      feedback.hidden = false;
      return;
    }

    feedback.className = 'success';
    feedback.textContent = 'Merci pour votre message. Nous reviendrons vers vous rapidement.';
    feedback.hidden = false;
    form.reset();
  });
}

// Thème (clair/sombre) avec persistance
function initializeThemeToggle() {
  const root = document.documentElement;
  let toggle = document.getElementById('theme-toggle');

  // Si le bouton n'existe pas (page custom), on le crée et on l'insère dans le header
  if (!toggle) {
    const headerNav = document.querySelector('.header .nav');
    if (headerNav) {
      toggle = document.createElement('button');
      toggle.id = 'theme-toggle';
      toggle.className = 'theme-toggle';
      toggle.setAttribute('aria-label', 'Activer le mode sombre');
      toggle.setAttribute('title', 'Mode sombre');
      const navToggle = document.getElementById('nav-toggle');
      if (navToggle && navToggle.parentNode === headerNav) {
        headerNav.insertBefore(toggle, navToggle);
      } else {
        headerNav.appendChild(toggle);
      }
    }
  }
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  let theme = stored || (prefersDark ? 'dark' : 'light');
  applyTheme(theme);
  updateToggleIcon(theme);

  toggle?.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    applyTheme(theme);
    updateToggleIcon(theme);
    localStorage.setItem('theme', theme);
  });

  function applyTheme(nextTheme) {
    root.setAttribute('data-theme', nextTheme);
  }

  function updateToggleIcon(currentTheme) {
    if (!toggle) return;
    if (currentTheme === 'dark') {
      toggle.setAttribute('aria-label', 'Activer le mode clair');
      toggle.setAttribute('title', 'Mode clair');
      toggle.innerHTML = getSunIcon();
    } else {
      toggle.setAttribute('aria-label', 'Activer le mode sombre');
      toggle.setAttribute('title', 'Mode sombre');
      toggle.innerHTML = getMoonIcon();
    }
  }

  function getMoonIcon() {
    return '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/></svg>';
  }
  function getSunIcon() {
    return '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
  }
}

