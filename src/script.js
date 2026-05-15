// tjSTAR — script.js

// ---- COUNTDOWN ----
const countdownTimer = document.getElementById('countdownTimer');
const countdownEl = document.getElementById('countdown');
if (countdownTimer) {
  const target = new Date('2026-05-20T08:40:00-04:00').getTime();
  function tick() {
    const now = Date.now();
    const diff = target - now;
    if (diff <= 0) {
      countdownTimer.textContent = 'Today!';
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const parts = [];
    if (d > 0) parts.push(d + 'd');
    parts.push(String(h).padStart(2, '0') + 'h');
    parts.push(String(m).padStart(2, '0') + 'm');
    parts.push(String(s).padStart(2, '0') + 's');
    countdownTimer.textContent = parts.join(' ');
  }
  tick();
  setInterval(tick, 1000);
}

// ---- NAV TOGGLE ----
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// ---- HERO PARTICLES ----
const canvas = document.getElementById('heroParticles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.floor((w * h) / 8000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.8 + 0.4,
        dx: (Math.random() - 0.5) * 0.15,
        dy: (Math.random() - 0.5) * 0.1 - 0.05,
        opacity: Math.random() * 0.5 + 0.1,
        flicker: Math.random() * Math.PI * 2
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const time = Date.now() * 0.001;
    particles.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;
      p.flicker += 0.02;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;
      const flick = Math.sin(p.flicker) * 0.15 + 0.85;
      const alpha = p.opacity * flick;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 240, 220, ${alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();
  window.addEventListener('resize', () => { resize(); createParticles(); });
}

// ---- SCROLL REVEAL ----
function setupReveals() {
  const els = document.querySelectorAll('.section__label, .section__heading, .section__text p, .section__media, .stat-card, .schedule-block, .check-list li');
  els.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

setupReveals();

// ---- NAV SCROLL STATE ----
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 40) {
      nav.style.background = 'rgba(20,18,16,0.97)';
      nav.classList.add('scrolled');
    } else {
      nav.style.background = 'rgba(20,18,16,0.92)';
      nav.classList.remove('scrolled');
    }
  });
}
