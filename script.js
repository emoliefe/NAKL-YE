/* ── Scroll progress ── */
const progressBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  progressBar.style.width = pct + '%';
}, { passive: true });

/* ── Navbar ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Hamburger ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  const bars = hamburger.querySelectorAll('span');
  if (open) {
    bars[0].style.transform = 'rotate(45deg) translate(5px,5px)';
    bars[1].style.opacity   = '0';
    bars[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
  } else {
    bars.forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
  }
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
  });
});

/* ── Counter animation ── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.round(ease * target);
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

/* ── Intersection Observer ── */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    if (e.target.classList.contains('reveal')) {
      e.target.classList.add('revealed');
    }
    if (e.target.classList.contains('counter')) {
      animateCounter(e.target);
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.reveal, .counter').forEach(el => io.observe(el));

/* Hero counters on page load (500ms delay) */
setTimeout(() => {
  document.querySelectorAll('.hero-stats .counter').forEach(el => {
    animateCounter(el);
    io.unobserve(el);
  });
}, 500);

/* ── Floating CTA ── */
const floatCta = document.getElementById('floatCta');
window.addEventListener('scroll', () => {
  floatCta.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

/* ── Multi-step form ── */
let currentStep = 1;
const totalSteps = 2;

function showStep(n) {
  document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
  const target = document.querySelector(`.form-step[data-step="${n}"]`);
  if (target) target.classList.add('active');
}

function nextStep() {
  const step = document.querySelector(`.form-step[data-step="${currentStep}"]`);
  const inputs = step.querySelectorAll('input[required], select[required]');
  let valid = true;
  inputs.forEach(inp => {
    if (!inp.value.trim()) { inp.focus(); valid = false; inp.style.borderColor = '#ef4444'; setTimeout(() => inp.style.borderColor = '', 2000); }
  });
  if (!valid) return;
  currentStep++;
  showStep(currentStep);
}

function prevStep() {
  currentStep--;
  showStep(currentStep);
}

function submitForm(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  btn.textContent = '⏳ Gönderiliyor...';
  btn.disabled = true;
  setTimeout(() => {
    showStep(3);
    showToast();
  }, 1000);
}

function showToast() {
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 5000);
}
