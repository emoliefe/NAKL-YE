/* ══════════════════════════════════════════════════
   VIPro Moving — Complete JavaScript
   ══════════════════════════════════════════════════ */

'use strict';

/* ── DOM REFERENCES ── */
const scrollBar     = document.getElementById('scroll-progress');
const navbar        = document.getElementById('navbar');
const hamburger     = document.getElementById('hamburger');
const navLinks      = document.getElementById('nav-links');
const floatingCta   = document.getElementById('floating-cta');
const toast         = document.getElementById('toast');
const toastClose    = document.getElementById('toast-close');
const quoteForm     = document.getElementById('quote-form');
const formProgress  = document.getElementById('form-progress-fill');
const resetFormBtn  = document.getElementById('reset-form');

/* ══════════════════════
   SCROLL PROGRESS BAR
══════════════════════ */
function updateScrollProgress() {
  const scrollTop    = window.scrollY;
  const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
  const pct          = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollBar.style.width = pct.toFixed(2) + '%';
}

/* ══════════════════════
   NAVBAR SCROLL STATE
══════════════════════ */
function updateNavbar() {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}

/* ══════════════════════
   FLOATING CTA
══════════════════════ */
function updateFloatingCta() {
  floatingCta.classList.toggle('visible', window.scrollY > 400);
}

/* ══════════════════════
   COMBINED SCROLL HANDLER
══════════════════════ */
window.addEventListener('scroll', () => {
  updateScrollProgress();
  updateNavbar();
  updateFloatingCta();
}, { passive: true });

// Run once on load
updateScrollProgress();
updateNavbar();
updateFloatingCta();

/* ══════════════════════
   HAMBURGER MENU
══════════════════════ */
hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  navLinks.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu when a nav link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (navLinks.classList.contains('open') && !navbar.contains(e.target)) {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ══════════════════════
   INTERSECTION OBSERVER — REVEAL
══════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ══════════════════════
   EASING FUNCTION
══════════════════════ */
function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

/* ══════════════════════
   NUMBER COUNTER ANIMATION
══════════════════════ */
function animateCounter(el, target, duration) {
  const start = performance.now();
  const startVal = 0;

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutQuart(progress);
    const current = Math.round(startVal + (target - startVal) * eased);

    // Format with commas for large numbers
    el.textContent = target >= 1000
      ? current.toLocaleString()
      : current.toString();

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target >= 1000
        ? target.toLocaleString()
        : target.toString();
    }
  }

  requestAnimationFrame(step);
}

/* ══════════════════════
   HERO STATS — TRIGGER ON LOAD
══════════════════════ */
function startHeroCounters() {
  document.querySelectorAll('.hero-stats .stat-number').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    if (!isNaN(target)) {
      animateCounter(el, target, 1800);
    }
  });
}

// Start after a short delay so animation is visible
setTimeout(startHeroCounters, 500);

/* ══════════════════════
   SCROLL-TRIGGERED COUNTERS (Why Us / Big Stat)
══════════════════════ */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      if (!isNaN(target)) {
        animateCounter(el, target, 2000);
      }
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

/* ══════════════════════
   MULTI-STEP FORM
══════════════════════ */
let currentStep = 1;
const totalSteps = 2; // 3rd is success

function getStepEl(n) {
  return document.getElementById('step-' + n);
}

function getIndicator(n) {
  return document.querySelector('.step-indicator[data-step="' + n + '"]');
}

function updateFormProgress(step) {
  const pct = step === 1 ? 33.33 : step === 2 ? 66.66 : 100;
  if (formProgress) formProgress.style.width = pct + '%';

  // Update step indicators
  document.querySelectorAll('.step-indicator').forEach(ind => {
    const s = parseInt(ind.dataset.step, 10);
    ind.classList.remove('active', 'done');
    if (s === step) ind.classList.add('active');
    if (s < step)  ind.classList.add('done');
  });
}

function showStep(n) {
  document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
  const target = getStepEl(n);
  if (target) {
    target.classList.add('active');
  }
  currentStep = n;
  updateFormProgress(n);
}

/* ── VALIDATION HELPERS ── */
function showError(fieldId, errId, msg) {
  const field = document.getElementById(fieldId);
  const err   = document.getElementById(errId);
  if (field) field.classList.add('error');
  if (err)   err.textContent = msg;
}

function clearError(fieldId, errId) {
  const field = document.getElementById(fieldId);
  const err   = document.getElementById(errId);
  if (field) field.classList.remove('error');
  if (err)   err.textContent = '';
}

function clearAllErrors() {
  document.querySelectorAll('.floating-field input, .floating-field select').forEach(el => {
    el.classList.remove('error');
  });
  document.querySelectorAll('.field-error').forEach(el => {
    el.textContent = '';
  });
}

function validateStep1() {
  let valid = true;
  clearAllErrors();

  const name  = document.getElementById('f-name');
  const phone = document.getElementById('f-phone');
  const email = document.getElementById('f-email');

  if (!name || !name.value.trim()) {
    showError('f-name', 'err-name', 'Please enter your full name.');
    valid = false;
  } else if (name.value.trim().length < 2) {
    showError('f-name', 'err-name', 'Name must be at least 2 characters.');
    valid = false;
  }

  if (!phone || !phone.value.trim()) {
    showError('f-phone', 'err-phone', 'Please enter your phone number.');
    valid = false;
  } else if (!/^[\d\s\-\+\(\)]{7,20}$/.test(phone.value.trim())) {
    showError('f-phone', 'err-phone', 'Please enter a valid phone number.');
    valid = false;
  }

  if (!email || !email.value.trim()) {
    showError('f-email', 'err-email', 'Please enter your email address.');
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    showError('f-email', 'err-email', 'Please enter a valid email address.');
    valid = false;
  }

  return valid;
}

function validateStep2() {
  let valid = true;
  clearAllErrors();

  const from = document.getElementById('f-from');
  const to   = document.getElementById('f-to');
  const date = document.getElementById('f-date');
  const type = document.getElementById('f-type');

  if (!from || !from.value.trim()) {
    showError('f-from', 'err-from', 'Please enter your current city/state.');
    valid = false;
  }

  if (!to || !to.value.trim()) {
    showError('f-to', 'err-to', 'Please enter your destination city/state.');
    valid = false;
  }

  if (!date || !date.value) {
    showError('f-date', 'err-date', 'Please select a move date.');
    valid = false;
  }

  if (!type || !type.value) {
    showError('f-type', 'err-type', 'Please select your move type.');
    valid = false;
  }

  return valid;
}

/* ── STEP 1: NEXT ── */
const next1 = document.getElementById('next-1');
if (next1) {
  next1.addEventListener('click', () => {
    if (validateStep1()) {
      showStep(2);
    }
  });
}

/* ── STEP 2: BACK ── */
const back2 = document.getElementById('back-2');
if (back2) {
  back2.addEventListener('click', () => {
    clearAllErrors();
    showStep(1);
  });
}

/* ── STEP 2: NEXT (SUBMIT) ── */
const next2 = document.getElementById('next-2');
if (next2) {
  next2.addEventListener('click', () => {
    if (validateStep2()) {
      submitForm();
    }
  });
}

/* ── FORM SUBMISSION ── */
function submitForm() {
  const btn = document.getElementById('next-2');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Sending...';
  }

  // Simulate API call
  setTimeout(() => {
    showStep(3);
    updateFormProgress(3);
    showToast();

    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Submit Request →';
    }
  }, 1200);
}

/* ── RESET FORM ── */
if (resetFormBtn) {
  resetFormBtn.addEventListener('click', () => {
    if (quoteForm) quoteForm.reset();
    clearAllErrors();
    showStep(1);
    updateFormProgress(1);
  });
}

/* ── CLEAR ERRORS ON INPUT ── */
document.querySelectorAll('.floating-field input, .floating-field select').forEach(el => {
  el.addEventListener('input', () => {
    el.classList.remove('error');
    const errId = 'err-' + el.id.replace('f-', '');
    const errEl = document.getElementById(errId);
    if (errEl) errEl.textContent = '';
  });
});

/* ── SET MIN DATE FOR DATE INPUT ── */
const dateInput = document.getElementById('f-date');
if (dateInput) {
  const today = new Date();
  const year  = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day   = String(today.getDate()).padStart(2, '0');
  dateInput.min = `${year}-${month}-${day}`;
}

/* ══════════════════════
   TOAST NOTIFICATION
══════════════════════ */
let toastTimeout = null;

function showToast() {
  if (!toast) return;
  if (toastTimeout) clearTimeout(toastTimeout);
  toast.classList.add('show');

  toastTimeout = setTimeout(() => {
    hideToast();
  }, 5000);
}

function hideToast() {
  if (!toast) return;
  toast.classList.remove('show');
  if (toastTimeout) {
    clearTimeout(toastTimeout);
    toastTimeout = null;
  }
}

if (toastClose) {
  toastClose.addEventListener('click', hideToast);
}

/* ══════════════════════
   SMOOTH SCROLL FOR NAV LINKS
══════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ══════════════════════
   INITIAL FORM STATE
══════════════════════ */
updateFormProgress(1);
