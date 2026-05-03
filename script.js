/* ============================================================
   HARSH SACHAN PORTFOLIO — script.js
   Features: Typing animation, Scroll animations, Dark/Light
   mode toggle, Form validation, Scroll-to-top, Navbar scroll
   ============================================================ */

'use strict';

// ─── THEME TOGGLE ───────────────────────────────────────────
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const htmlEl      = document.documentElement;

// Load saved preference
const savedTheme = localStorage.getItem('portfolioTheme') || 'dark';
htmlEl.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = htmlEl.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  htmlEl.setAttribute('data-theme', next);
  localStorage.setItem('portfolioTheme', next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}

// ─── NAVBAR SCROLL ──────────────────────────────────────────
const mainNav = document.getElementById('mainNav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    mainNav.classList.add('scrolled');
  } else {
    mainNav.classList.remove('scrolled');
  }
  updateActiveNavLink();
  handleScrollTop();
});

// Active nav link on scroll
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

function updateActiveNavLink() {
  let currentId = '';
  sections.forEach(sec => {
    const top = sec.getBoundingClientRect().top;
    if (top <= 100) currentId = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentId}`) {
      link.classList.add('active');
    }
  });
}

// Close mobile menu on nav link click
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    const menu = document.getElementById('navMenu');
    if (menu.classList.contains('show')) {
      const bsCollapse = bootstrap.Collapse.getInstance(menu);
      if (bsCollapse) bsCollapse.hide();
    }
  });
});

// ─── TYPING ANIMATION ───────────────────────────────────────
const typedEl = document.getElementById('typedText');
const phrases = [
  'ML-Powered Applications',
  'Full Stack Web Apps',
  'Data Science Solutions',
  'AI-Driven Products',
  'RAG & LLM Systems',
];

let phraseIdx  = 0;
let charIdx    = 0;
let isDeleting = false;
let isPaused   = false;

function typeLoop() {
  const current = phrases[phraseIdx];

  if (isPaused) {
    setTimeout(typeLoop, 1400);
    isPaused = false;
    return;
  }

  if (!isDeleting) {
    typedEl.textContent = current.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      isPaused   = true;
      isDeleting = true;
      setTimeout(typeLoop, 100);
      return;
    }
    setTimeout(typeLoop, 65);
  } else {
    typedEl.textContent = current.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      isDeleting = false;
      phraseIdx  = (phraseIdx + 1) % phrases.length;
    }
    setTimeout(typeLoop, 38);
  }
}

// Start after short delay
setTimeout(typeLoop, 800);

// ─── SCROLL REVEAL ANIMATIONS ───────────────────────────────
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Trigger progress bars if inside this element
      entry.target.querySelectorAll('.sbar-fill').forEach(bar => {
        bar.style.width = bar.getAttribute('data-width') + '%';
      });
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -50px 0px',
});

revealEls.forEach(el => revealObserver.observe(el));

// Also observe skill bars that may be in non-reveal parents
const allBars = document.querySelectorAll('.sbar-fill');
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.getAttribute('data-width') + '%';
    }
  });
}, { threshold: 0.3 });

allBars.forEach(bar => barObserver.observe(bar));

// ─── SCROLL TO TOP ──────────────────────────────────────────
const scrollTopBtn = document.getElementById('scrollTop');

function handleScrollTop() {
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('show');
  } else {
    scrollTopBtn.classList.remove('show');
  }
}

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─── CONTACT FORM VALIDATION ────────────────────────────────
const contactForm = document.getElementById('contactForm');
const cfSubmit    = document.getElementById('cfSubmit');
const cfSuccess   = document.getElementById('cfSuccess');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  // Name
  const name    = document.getElementById('cfName');
  const nameErr = name.nextElementSibling;
  if (!name.value.trim() || name.value.trim().length < 2) {
    name.classList.add('error');
    nameErr.classList.add('show');
    valid = false;
  } else {
    name.classList.remove('error');
    nameErr.classList.remove('show');
  }

  // Email
  const email    = document.getElementById('cfEmail');
  const emailErr = email.nextElementSibling;
  const emailRgx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRgx.test(email.value.trim())) {
    email.classList.add('error');
    emailErr.classList.add('show');
    valid = false;
  } else {
    email.classList.remove('error');
    emailErr.classList.remove('show');
  }

  // Message
  const msg    = document.getElementById('cfMsg');
  const msgErr = msg.nextElementSibling;
  if (!msg.value.trim() || msg.value.trim().length < 10) {
    msg.classList.add('error');
    msgErr.classList.add('show');
    valid = false;
  } else {
    msg.classList.remove('error');
    msgErr.classList.remove('show');
  }

  if (!valid) return;

  // Simulate submission
  cfSubmit.disabled = true;
  cfSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

  setTimeout(() => {
    cfSubmit.style.display  = 'none';
    cfSuccess.style.display = 'flex';
    contactForm.reset();
    // Reset after 5s
    setTimeout(() => {
      cfSubmit.style.display  = '';
      cfSubmit.disabled       = false;
      cfSubmit.innerHTML      = '<i class="fas fa-paper-plane"></i> Send Message';
      cfSuccess.style.display = 'none';
    }, 5000);
  }, 1200);
});

// Remove error state on input
['cfName', 'cfEmail', 'cfMsg'].forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener('input', () => {
    el.classList.remove('error');
    const err = el.nextElementSibling;
    if (err && err.classList.contains('cf-error')) {
      err.classList.remove('show');
    }
  });
});

// ─── SMOOTH SCROLL for anchor links ─────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80; // navbar height
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ─── INIT ───────────────────────────────────────────────────
// Trigger initial scroll handler
handleScrollTop();
updateActiveNavLink();

console.log('%c👋 Hey, recruiter! Check out hsachan295@gmail.com', 
  'color:#4ade80; font-size:14px; font-weight:bold; background:#0a0c10; padding:8px 16px; border-radius:8px;');
