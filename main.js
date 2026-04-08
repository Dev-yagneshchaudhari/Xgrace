// ============================================================
// XRACE TECHNOLOGIES — Shared JS
// ============================================================

// ── PRELOADER ─────────────────────────────────────────────
window.addEventListener('load', () => {
  const pre = document.getElementById('preloader');
  if (pre) {
    setTimeout(() => {
      pre.style.opacity = '0';
      setTimeout(() => pre.remove(), 500);
    }, 1600);
  }
});

// ── NAVBAR SCROLL ─────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ── MOBILE MENU ───────────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.innerHTML = navLinks.classList.contains('open')
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-bars"></i>';
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
  });
}

// ── HERO SLIDER ────────────────────────────────────────────
const track    = document.getElementById('sliderTrack');
const prevBtn  = document.getElementById('prevBtn');
const nextBtn  = document.getElementById('nextBtn');
const dotsWrap = document.getElementById('sliderDots');
if (track) {
  const slides   = track.querySelectorAll('.slide');
  const dots     = dotsWrap ? dotsWrap.querySelectorAll('.dot') : [];
  let current    = 0;
  let autoTimer;

  function goTo(idx) {
    current = (idx + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    // Re-trigger animations
    slides[current].querySelectorAll('.slide-tag, .slide-content h1, .slide-sub, .btn-primary').forEach(el => {
      el.style.animation = 'none';
      el.offsetHeight; // reflow
      el.style.animation = '';
    });
  }

  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 4500);
  }
  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
  dots.forEach(d => {
    d.addEventListener('click', () => { goTo(+d.dataset.idx); resetAuto(); });
  });

  startAuto();
}

// ── SCROLL REVEAL ─────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');
const revObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revObs.observe(el));

// ── COUNTER ANIMATION ─────────────────────────────────────
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const val = Math.floor(progress * target);
    el.textContent = val + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const counterEls = document.querySelectorAll('[data-count]');
if (counterEls.length) {
  const cntObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target, +e.target.dataset.count);
        cntObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counterEls.forEach(el => cntObs.observe(el));
}

// ── ACTIVE NAV LINK ────────────────────────────────────────
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  if (a.getAttribute('href') === currentPage) a.classList.add('active');
  else a.classList.remove('active');
});
