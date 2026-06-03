// ============================================================
//  M VASANTH PORTFOLIO — script.js
// ============================================================
'use strict';
/* ── Custom Cursor ── */
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;
document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});
function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();
document.querySelectorAll('a, button, .skill-card, .about-card, .orbit-icon').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
    cursorFollower.style.transform = 'translate(-50%,-50%) scale(1.5)';
    cursorFollower.style.opacity = '0.3';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    cursorFollower.style.transform = 'translate(-50%,-50%) scale(1)';
    cursorFollower.style.opacity = '0.8';
  });
});
/* ── Particle Canvas ── */
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
const particles = [];
const PARTICLE_COUNT = 80;
class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.hue = Math.random() > 0.6 ? 190 : 270; // cyan or purple
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${this.opacity})`;
    ctx.fill();
  }
}
for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0, 212, 255, ${0.07 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();
/* ── Navbar scroll ── */
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  // Active nav link
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) current = section.id;
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
});
/* ── Hamburger ── */
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksEl.classList.toggle('open');
});
navLinksEl.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
  });
});
/* ── Typewriter ── */
const words = ['beautiful websites.', 'stunning UI/UX.', 'AI-powered apps.', 'digital experiences.', 'your dream project.'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const twEl = document.getElementById('typewriter');
function typewrite() {
  const word = words[wordIndex];
  if (!isDeleting) {
    twEl.textContent = word.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === word.length) { isDeleting = true; setTimeout(typewrite, 1600); return; }
  } else {
    twEl.textContent = word.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      setTimeout(typewrite, 400);
      return;
    }
  }
  setTimeout(typewrite, isDeleting ? 50 : 80);
}
typewrite();
/* ── Scroll Reveal ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Animate skill bars when visible
      entry.target.querySelectorAll('.skill-fill').forEach(fill => {
        fill.style.width = fill.dataset.width + '%';
      });
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
/* ── Also trigger skill bar animation for skill cards ── */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(fill => {
        setTimeout(() => { fill.style.width = fill.dataset.width + '%'; }, 300);
      });
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.skill-card').forEach(card => skillObserver.observe(card));
/* ── Counter animation ── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1500;
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(animateCounter);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) counterObserver.observe(heroStats);
/* ── Contact form ── */
const form = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
form.addEventListener('submit', e => {
  e.preventDefault();
  const btn = document.getElementById('submit-btn');
  btn.disabled = true;
  btn.querySelector('span').textContent = 'Sending...';
  // Simulate send (replace with real backend/EmailJS etc.)
  setTimeout(() => {
    formSuccess.style.display = 'block';
    form.reset();
    btn.disabled = false;
    btn.querySelector('span').textContent = 'Send Message';
    setTimeout(() => { formSuccess.style.display = 'none'; }, 5000);
  }, 1500);
});
/* ── Smooth tilt on skill/about cards ── */
document.querySelectorAll('.skill-card, .about-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-8px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    card.style.transformStyle = 'preserve-3d';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
/* ── Glitch text on hero name hover ── */
const nameChars = document.querySelectorAll('.name-char');
nameChars.forEach(char => {
  char.addEventListener('mouseenter', () => {
    char.style.animation = 'none';
    char.style.textShadow = '0 0 20px rgba(0,212,255,0.8)';
    char.style.transform = 'translateY(-5px) scale(1.2)';
    char.style.transition = 'all 0.2s ease';
    setTimeout(() => {
      char.style.textShadow = '';
      char.style.transform = '';
    }, 300);
  });
});
/* ── Page load animation ── */
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  setTimeout(() => { document.body.style.opacity = '1'; }, 50);
});