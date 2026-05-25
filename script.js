/* ============================================================
   PORTFOLIO — script.js
   ============================================================ */

'use strict';

/* ===== SVG GRADIENT DEFS (for skill rings) ===== */
(function injectSVGDefs() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('svg-defs');
  svg.innerHTML = `
    <defs>
      <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#5C3317"/>
        <stop offset="100%" stop-color="#C49A6C"/>
      </linearGradient>
    </defs>`;
  document.body.prepend(svg);
})();

/* ===== PLACEHOLDER SVG IMAGES ===== */
(function generatePlaceholders() {
  const colors = [
    ['#5C3317','#C49A6C'], ['#3D2415','#8B5E3C'],
    ['#2D1A0F','#C49A6C'], ['#5C3317','#8B5E3C'],
    ['#3D2415','#C49A6C'], ['#2D1A0F','#5C3317'],
  ];
  const icons  = ['🛒','📊','⚙️','💬','🌤️','📋'];
  const labels = ['E-Commerce','Dashboard','REST API','Social App','Weather','Task API'];

  function makeSVG(bg1, bg2, icon, label, w = 400, h = 250) {
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="${w}" y2="${h}" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="${bg1}"/>
            <stop offset="100%" stop-color="${bg2}"/>
          </linearGradient>
        </defs>
        <rect width="${w}" height="${h}" fill="url(#g)"/>
        <text x="${w/2}" y="${h/2 - 12}" font-size="52" text-anchor="middle" dominant-baseline="middle">${icon}</text>
        <text x="${w/2}" y="${h/2 + 36}" font-family="Inter,sans-serif" font-size="14" fill="rgba(245,236,215,0.7)" text-anchor="middle">${label}</text>
      </svg>`)}`;
  }

  function makeProfileSVG(initials, w = 400, h = 400) {
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
        <defs>
          <linearGradient id="pg" x1="0" y1="0" x2="${w}" y2="${h}" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#5C3317"/>
            <stop offset="100%" stop-color="#8B5E3C"/>
          </linearGradient>
        </defs>
        <rect width="${w}" height="${h}" fill="url(#pg)" rx="${w/2}"/>
        <text x="${w/2}" y="${h/2}" font-family="Playfair Display,Georgia,serif" font-size="${w*0.24}" font-weight="900" fill="#C49A6C" text-anchor="middle" dominant-baseline="central">${initials}</text>
      </svg>`)}`;
  }

  /* Hero photo — assets/images/profile.jpg */
  const HERO_IMG  = 'assets/images/profile.jpg';
  /* About photo — assets/images/about.jpg  */
  const ABOUT_IMG = 'assets/images/about.jpg';

  document.querySelectorAll('.hero-photo').forEach(img => {
    const test = new Image();
    test.onload  = () => { img.src = HERO_IMG; };
    test.onerror = () => { img.src = makeProfileSVG('AM'); };
    test.src = HERO_IMG + '?t=' + Date.now();
  });

  document.querySelectorAll('.about-photo').forEach(img => {
    const test = new Image();
    test.onload  = () => { img.src = ABOUT_IMG; };
    test.onerror = () => { img.src = makeProfileSVG('AM', 420, 520); };
    test.src = ABOUT_IMG + '?t=' + Date.now();
  });

  /* Project images */
  document.querySelectorAll('.project-img img').forEach((img, i) => {
    const [bg1, bg2] = colors[i % colors.length];
    img.src = makeSVG(bg1, bg2, icons[i % icons.length], labels[i % labels.length]);
  });
})();

/* ===== LOADER ===== */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  document.body.classList.add('loading');

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('fade-out');
      document.body.classList.remove('loading');
      loader.addEventListener('transitionend', () => loader.remove(), { once: true });
    }, 1800);
  });
})();

/* ===== SCROLL PROGRESS ===== */
(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  function update() {
    const scrolled = document.documentElement.scrollTop;
    const total    = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    bar.style.width = total > 0 ? `${(scrolled / total) * 100}%` : '0%';
  }

  window.addEventListener('scroll', update, { passive: true });
})();

/* ===== CUSTOM CURSOR ===== */
(function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;
  let rafId;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = `${mouseX}px`;
    cursor.style.top  = `${mouseY}px`;
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = `${followerX}px`;
    follower.style.top  = `${followerY}px`;
    rafId = requestAnimationFrame(animateFollower);
  }
  animateFollower();

  /* Hover effects */
  const hoverTargets = 'a, button, .skill-card, .project-card, .filter-btn';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.add('cursor-hover');
      follower.classList.add('cursor-hover');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.remove('cursor-hover');
      follower.classList.remove('cursor-hover');
    }
  });
})();

/* ===== NAVBAR ===== */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  const overlay   = document.getElementById('mobile-overlay');
  if (!navbar) return;

  /* Scrolled state */
  function updateScrolled() {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', updateScrolled, { passive: true });
  updateScrolled();

  /* Mobile menu toggle */
  function openMenu() {
    navLinks.classList.add('open');
    overlay.classList.add('active');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    overlay.classList.remove('active');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    navLinks.classList.contains('open') ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  /* Close on nav link click */
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* Active link on scroll */
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    const scrollY = window.scrollY + window.innerHeight * 0.35;
    let current = '';

    sections.forEach(section => {
      if (scrollY >= section.offsetTop) current = section.id;
    });

    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
})();

/* ===== TYPED TEXT EFFECT ===== */
(function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const words = [
    'Full Stack Developer',
    'UI/UX Enthusiast',
    'Problem Solver',
    'Open Source Contributor',
    'Coffee Addict ☕',
  ];

  let wordIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let pause = false;

  function type() {
    if (pause) return;

    const word = words[wordIdx];

    if (!deleting) {
      el.textContent = word.slice(0, ++charIdx);
      if (charIdx === word.length) {
        pause = true;
        setTimeout(() => { pause = false; deleting = true; }, 2000);
      }
    } else {
      el.textContent = word.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        wordIdx = (wordIdx + 1) % words.length;
      }
    }

    const speed = deleting ? 50 : 90;
    setTimeout(type, speed);
  }

  type();
})();

/* ===== COUNTER ANIMATION ===== */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1500;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
})();

/* ===== SKILL PROGRESS BARS ===== */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill[data-width]');
  if (!bars.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        fill.style.width = `${fill.dataset.width}%`;
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.4 });

  bars.forEach(bar => observer.observe(bar));
})();

/* ===== SKILL RINGS ===== */
(function initSkillRings() {
  const rings = document.querySelectorAll('.ring-fill[data-percent]');
  if (!rings.length) return;

  const circumference = 2 * Math.PI * 40; // r=40

  rings.forEach(ring => {
    ring.style.strokeDasharray  = circumference;
    ring.style.strokeDashoffset = circumference;
    ring.setAttribute('stroke', 'url(#ring-gradient)');
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const ring    = entry.target;
        const percent = parseFloat(ring.dataset.percent) / 100;
        ring.style.strokeDashoffset = circumference * (1 - percent);
        observer.unobserve(ring);
      }
    });
  }, { threshold: 0.4 });

  rings.forEach(ring => observer.observe(ring));
})();

/* ===== FLOATING PARTICLES ===== */
(function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const count = window.innerWidth < 768 ? 14 : 26;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');

    const size = Math.random() * 4 + 2;
    const x    = Math.random() * 100;
    const dur  = Math.random() * 15 + 10;
    const delay = Math.random() * 10;

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}%;
      animation-duration: ${dur}s;
      animation-delay: ${delay}s;
      opacity: 0;
    `;

    container.appendChild(p);
  }
})();

/* ===== PROJECT FILTER ===== */
(function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.project-card');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const category = card.dataset.category;
        const show = filter === 'all' || category === filter;

        if (show) {
          card.classList.remove('hidden-card');
          card.style.animation = 'none';
          card.offsetHeight; // reflow
          card.style.animation = 'fadeInCard 0.4s ease forwards';
        } else {
          card.classList.add('hidden-card');
        }
      });
    });
  });

  /* Inject fadeInCard keyframe */
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInCard {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
})();

/* ===== TIMELINE TABS ===== */
(function initTimelineTabs() {
  const tabs = document.querySelectorAll('.timeline-tab');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.dataset.tab;
      document.querySelectorAll('.timeline').forEach(tl => {
        tl.classList.toggle('hidden', tl.id !== `timeline-${target}`);
      });
    });
  });
})();

/* ===== CONTACT FORM ===== */
(function initContactForm() {
  const form        = document.getElementById('contact-form');
  const successEl   = document.getElementById('form-success');
  const errorEl     = document.getElementById('form-error-state');
  const submitBtn   = document.getElementById('submit-btn');
  const resetBtn    = document.getElementById('reset-form-btn');
  const retryBtn    = document.getElementById('retry-form-btn');
  if (!form) return;

  /* Validation */
  function validateField(id, errorId, validate) {
    const field = document.getElementById(id);
    const errEl = document.getElementById(errorId);
    const msg   = validate(field.value.trim());
    errEl.textContent = msg;
    field.style.borderColor = msg ? '#E87070' : '';
    return !msg;
  }

  function validateAll() {
    const okName    = validateField('name',    'name-error',    v => v.length < 2 ? 'Name must be at least 2 characters.' : '');
    const okEmail   = validateField('email',   'email-error',   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Please enter a valid email address.');
    const okSubject = validateField('subject', 'subject-error', v => v.length < 3 ? 'Subject is required.' : '');
    const okMsg     = validateField('message', 'message-error', v => v.length < 10 ? 'Message must be at least 10 characters.' : '');
    return okName && okEmail && okSubject && okMsg;
  }

  /* Live validation on blur */
  ['name', 'email', 'subject', 'message'].forEach(id => {
    document.getElementById(id)?.addEventListener('blur', validateAll);
  });

  function setSubmitting(loading) {
    const textEl    = submitBtn.querySelector('.btn-text');
    const loadingEl = submitBtn.querySelector('.btn-loading');
    submitBtn.disabled = loading;
    textEl.classList.toggle('hidden', loading);
    loadingEl.classList.toggle('hidden', !loading);
  }

  function showState(state) {
    form.classList.toggle('hidden', state !== 'form');
    successEl.classList.toggle('hidden', state !== 'success');
    errorEl.classList.toggle('hidden', state !== 'error');
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validateAll()) return;

    setSubmitting(true);

    /* Simulate async send — replace with real fetch to your backend */
    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          /* 90% success rate in demo mode */
          Math.random() > 0.1 ? resolve() : reject(new Error('Network error'));
        }, 1800);
      });
      showState('success');
    } catch {
      showState('error');
    } finally {
      setSubmitting(false);
    }
  });

  resetBtn?.addEventListener('click', () => {
    form.reset();
    showState('form');
  });

  retryBtn?.addEventListener('click', () => showState('form'));
})();

/* ===== BACK TO TOP ===== */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ===== AOS INIT ===== */
(function initAOS() {
  if (typeof AOS === 'undefined') return;
  AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80,
    disable: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  });
})();

/* ===== PARALLAX HERO ===== */
(function initParallax() {
  const heroSection = document.querySelector('.hero-section');
  const heroBg = document.querySelector('.hero-bg-gradient');
  if (!heroBg || !heroSection) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > heroSection.offsetHeight) return;
    heroBg.style.transform = `translateY(${window.scrollY * 0.35}px)`;
  }, { passive: true });
})();

/* ===== DARK / LIGHT THEME TOGGLE ===== */
(function initTheme() {
  const html = document.documentElement;
  const btn  = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-icon');
  if (!btn) return;

  /* Apply saved preference immediately (no flash) */
  const saved = localStorage.getItem('portfolio-theme') || 'dark';
  applyTheme(saved, false);

  btn.addEventListener('click', () => {
    const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next, true);
    localStorage.setItem('portfolio-theme', next);
  });

  function applyTheme(theme, animate) {
    if (!animate) {
      /* Suppress the CSS transition on first paint */
      html.style.transition = 'none';
    }
    html.dataset.theme = theme;

    /* Update icon: sun shown in dark mode, moon in light mode */
    if (icon) {
      icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    btn.setAttribute('aria-label',
      theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
    );

    if (!animate) {
      /* Re-enable transitions after the initial paint */
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { html.style.transition = ''; });
      });
    }
  }
})();

/* ===== SMOOTH SCROLL for anchor links ===== */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });
})();
