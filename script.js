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

/* ===== EPIC 3D LOADER ===== */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  document.body.classList.add('loading');

  /* — Matrix rain — */
  const canvas = document.getElementById('matrix-canvas');
  const ctx    = canvas ? canvas.getContext('2d') : null;
  const chars  = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]|/\\';
  let W, H, cols, drops, matrixRAF;

  function resizeMatrix() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    cols  = Math.floor(W / 18);
    drops = Array(cols).fill(1);
  }
  if (ctx) {
    resizeMatrix();
    window.addEventListener('resize', resizeMatrix);
    function drawMatrix() {
      ctx.fillStyle = 'rgba(13,8,5,0.05)';
      ctx.fillRect(0, 0, W, H);
      ctx.font = '14px monospace';
      drops.forEach((y, i) => {
        const c = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = Math.random() > 0.94 ? '#C49A6C' : 'rgba(92,51,23,0.65)';
        ctx.fillText(c, i * 18, y * 18);
        if (y * 18 > H && Math.random() > 0.975) drops[i] = 0;
        else drops[i]++;
      });
      matrixRAF = requestAnimationFrame(drawMatrix);
    }
    drawMatrix();
  }

  /* — Role typewriter — */
  const roles  = ['Full Stack Developer', 'UI/UX Enthusiast', 'Problem Solver', 'Code Architect'];
  const roleEl = document.getElementById('loader-role');
  let roleIdx = 0, charIdx = 0, deleting = false;
  function typeRole() {
    if (!roleEl) return;
    const cur = roles[roleIdx];
    deleting ? roleEl.textContent = cur.slice(0, --charIdx) : (roleEl.textContent = cur.slice(0, ++charIdx));
    if (!deleting && charIdx === cur.length) { deleting = true; setTimeout(typeRole, 1100); return; }
    if (deleting && charIdx === 0)           { deleting = false; roleIdx = (roleIdx + 1) % roles.length; }
    setTimeout(typeRole, deleting ? 38 : 65);
  }
  typeRole();

  /* — Animated progress — */
  const fillEl   = document.getElementById('loader-fill-bar');
  const statusEl = document.getElementById('loader-status');
  const pctEl    = document.getElementById('loader-pct');
  const steps = [
    { pct: 15, msg: 'Loading Styles...' },
    { pct: 30, msg: 'Initializing Scripts...' },
    { pct: 48, msg: 'Loading Projects...' },
    { pct: 63, msg: 'Wiring Animations...' },
    { pct: 78, msg: 'Loading Skills...' },
    { pct: 92, msg: 'Almost Ready...' },
    { pct: 100, msg: 'Welcome!' },
  ];
  let pct = 0, stepIdx = 0;
  const progressTimer = setInterval(() => {
    const target = stepIdx < steps.length ? steps[stepIdx].pct : 100;
    if (pct < target) { pct = Math.min(pct + Math.random() * 1.8 + 0.4, target); }
    if (pct >= target && stepIdx < steps.length) {
      if (statusEl) statusEl.textContent = steps[stepIdx].msg;
      stepIdx++;
    }
    if (fillEl) fillEl.style.width = Math.min(pct, 100) + '%';
    if (pctEl)  pctEl.textContent  = Math.floor(Math.min(pct, 100)) + '%';
    if (pct >= 100) clearInterval(progressTimer);
  }, 28);

  /* — Hide loader — */
  function hideLoader() {
    if (matrixRAF) cancelAnimationFrame(matrixRAF);
    clearInterval(progressTimer);
    if (fillEl)   fillEl.style.width = '100%';
    if (pctEl)    pctEl.textContent  = '100%';
    if (statusEl) statusEl.textContent = 'Welcome!';
    setTimeout(() => {
      loader.classList.add('fade-out');
      document.body.classList.remove('loading');
      loader.addEventListener('transitionend', () => loader.remove(), { once: true });
    }, 350);
  }

  window.addEventListener('load', () => {
    const check = setInterval(() => { if (pct >= 100) { clearInterval(check); hideLoader(); } }, 80);
    setTimeout(hideLoader, 5000);
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

/* ============================================================
   EPIC ANIMATION UPGRADE v2
   ============================================================ */

/* ===== GRAIN OVERLAY ===== */
(function addGrain() {
  const el = document.createElement('div');
  el.className = 'grain-overlay';
  el.setAttribute('aria-hidden', 'true');
  document.body.appendChild(el);
})();

/* ===== LOADER SOUND (Web Audio API synthesizer) ===== */
(function initLoaderSound() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;

  const soundBtn  = document.getElementById('loader-sound-btn');
  const soundIcon = document.getElementById('sound-icon');
  let ctx = null;
  let played = false;

  function makeSound() {
    if (played) return;
    played = true;
    if (!ctx) ctx = new AudioCtx();

    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.value = 0.18;
    master.connect(ctx.destination);

    /* Bass rumble */
    const bass = ctx.createOscillator();
    const bassG = ctx.createGain();
    bass.type = 'sine'; bass.frequency.value = 48;
    bassG.gain.setValueAtTime(0, now);
    bassG.gain.linearRampToValueAtTime(0.35, now + 0.4);
    bassG.gain.linearRampToValueAtTime(0, now + 2.8);
    bass.connect(bassG); bassG.connect(master);
    bass.start(now); bass.stop(now + 3);

    /* Frequency sweep */
    const sweep = ctx.createOscillator();
    const sweepF = ctx.createBiquadFilter();
    const sweepG = ctx.createGain();
    sweep.type = 'sawtooth';
    sweep.frequency.setValueAtTime(80, now + 0.15);
    sweep.frequency.exponentialRampToValueAtTime(2400, now + 0.7);
    sweepF.type = 'bandpass'; sweepF.frequency.value = 900; sweepF.Q.value = 3;
    sweepG.gain.setValueAtTime(0.12, now + 0.15);
    sweepG.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    sweep.connect(sweepF); sweepF.connect(sweepG); sweepG.connect(master);
    sweep.start(now + 0.15); sweep.stop(now + 0.85);

    /* Rising beep sequence */
    [330, 440, 550, 660, 880].forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'square'; o.frequency.value = freq;
      const t = now + 0.85 + i * 0.11;
      g.gain.setValueAtTime(0.065, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      o.connect(g); g.connect(master);
      o.start(t); o.stop(t + 0.13);
    });

    /* Matrix glitch clicks */
    for (let i = 0; i < 10; i++) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = 120 + Math.random() * 700;
      const t = now + 1.5 + i * 0.18 + Math.random() * 0.08;
      g.gain.setValueAtTime(0.04, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      o.connect(g); g.connect(master);
      o.start(t); o.stop(t + 0.07);
    }

    /* Ascending arpeggio (C major pentatonic) */
    [261.6, 329.6, 392, 523.3, 659.3].forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'triangle'; o.frequency.value = freq;
      const t = now + 2.1 + i * 0.16;
      g.gain.setValueAtTime(0.09, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      o.connect(g); g.connect(master);
      o.start(t); o.stop(t + 0.4);
    });

    /* Soft outro chord */
    [130.8, 164.8, 196].forEach((freq) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = freq;
      g.gain.setValueAtTime(0, now + 3.0);
      g.gain.linearRampToValueAtTime(0.07, now + 3.4);
      g.gain.linearRampToValueAtTime(0, now + 5.0);
      o.connect(g); g.connect(master);
      o.start(now + 3.0); o.stop(now + 5.2);
    });

    if (soundIcon) soundIcon.className = 'fas fa-volume-high';
    if (soundBtn) soundBtn.classList.add('active');
  }

  function tryPlay() {
    try {
      if (!ctx) ctx = new AudioCtx();
      ctx.state === 'suspended' ? ctx.resume().then(makeSound).catch(() => {}) : makeSound();
    } catch (e) {}
  }

  /* Try auto-play (succeeds if user navigated via link click) */
  setTimeout(tryPlay, 200);

  if (soundBtn) {
    soundBtn.addEventListener('click', (e) => { e.stopPropagation(); tryPlay(); });
  }
})();

/* ===== 3D CARD TILT ===== */
(function initTilt3D() {
  if (window.matchMedia('(pointer:coarse)').matches) return;
  document.querySelectorAll('.skill-card, .project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.08s ease, box-shadow 0.08s ease';
    });
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform =
        `perspective(700px) rotateX(${-y * 14}deg) rotateY(${x * 14}deg) scale(1.04) translateZ(8px)`;
      card.style.boxShadow = `${-x * 22}px ${-y * 22}px 40px rgba(196,154,108,0.18)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1), box-shadow 0.5s ease';
      card.style.transform = '';
      card.style.boxShadow = '';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });
})();

/* ===== MAGNETIC BUTTONS ===== */
(function initMagneticButtons() {
  if (window.matchMedia('(pointer:coarse)').matches) return;
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) * 0.36;
      const dy = (e.clientY - r.top  - r.height / 2) * 0.36;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();

/* ===== TEXT SCRAMBLE on section tags ===== */
(function initTextScramble() {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$&';
  function scramble(el) {
    const orig = el.textContent.trim().toUpperCase();
    let iter = 0;
    const iv = setInterval(() => {
      el.textContent = orig.split('').map((c, i) => {
        if (c === ' ') return ' ';
        if (i < Math.floor(iter)) return orig[i];
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join('');
      iter += 0.45;
      if (iter >= orig.length) { el.textContent = orig; clearInterval(iv); }
    }, 38);
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { scramble(e.target); obs.unobserve(e.target); }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.section-tag').forEach(el => obs.observe(el));
})();

/* ===== HERO MOUSE PARALLAX ===== */
(function initHeroMouseParallax() {
  if (window.matchMedia('(pointer:coarse)').matches) return;
  const hero = document.querySelector('.hero-section');
  if (!hero) return;
  const imgWrap = hero.querySelector('.hero-image');
  const content = hero.querySelector('.hero-content');
  const bgGrad  = hero.querySelector('.hero-bg-gradient');
  const rings   = hero.querySelectorAll('.hero-img-ring');

  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left)  / r.width  - 0.5;
    const y = (e.clientY - r.top)   / r.height - 0.5;
    if (imgWrap) imgWrap.style.transform = `translate(${x * -16}px, ${y * -11}px)`;
    if (content) content.style.transform = `translate(${x * 9}px, ${y * 6}px)`;
    if (bgGrad)  bgGrad.style.transform  = `translate(${x * 28}px, ${y * 22}px)`;
    rings.forEach((ring, i) => {
      ring.style.transform = `translate(${x * (i + 1) * 7}px, ${y * (i + 1) * 7}px)`;
    });
  });
  hero.addEventListener('mouseleave', () => {
    [imgWrap, content, bgGrad].forEach(el => { if (el) el.style.transform = ''; });
    rings.forEach(r => r.style.transform = '');
  });
})();

/* ===== FLOATING GEO SHAPES per section ===== */
(function initFloatingGeo() {
  const types = ['triangle', 'square', 'circle', 'dot', 'circle', 'dot'];
  document.querySelectorAll('.about, .skills, .projects, .experience, .contact').forEach(sec => {
    for (let i = 0; i < 5; i++) {
      const el = document.createElement('div');
      el.className = `geo-float ${types[Math.floor(Math.random() * types.length)]}`;
      el.setAttribute('aria-hidden', 'true');
      el.style.cssText = [
        `top:${10 + Math.random() * 80}%`,
        `left:${5 + Math.random() * 90}%`,
        `animation:geo-drift ${7 + Math.random() * 9}s ease-in-out infinite`,
        `animation-delay:${(Math.random() * 5).toFixed(1)}s`,
      ].join(';');
      sec.appendChild(el);
    }
  });
})();

/* ===== CURSOR TRAIL ===== */
(function initCursorTrail() {
  if (window.matchMedia('(pointer:coarse)').matches) return;
  let last = 0;
  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - last < 45) return;
    last = now;
    const t = document.createElement('div');
    t.className = 'cursor-trail';
    t.style.left = e.clientX + 'px';
    t.style.top  = e.clientY + 'px';
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 560);
  });
})();

/* ===== ENHANCED SCROLL REVEAL ===== */
(function initScrollReveal() {
  /* Elements AOS already handles are tagged data-aos — skip those */
  const map = [
    ['.skill-card',          'scale',  80],
    ['.project-card',        'up',    100],
    ['.timeline-item',       'left',  120],
    ['.contact-info-card',   'right',  80],
    ['.fact-item',           'up',     60],
    ['.resume-section',      'up',     80],
  ];
  map.forEach(([sel, dir, gap]) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      if (el.hasAttribute('data-reveal') || el.hasAttribute('data-aos')) return;
      el.setAttribute('data-reveal', dir);
      el.style.transitionDelay = (i * gap) + 'ms';
    });
  });
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('[data-reveal]').forEach(el => obs.observe(el));
})();

/* ===== SPARKLE BURST on section title enter ===== */
(function initSparkle() {
  function burst(el) {
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width  / 2 + window.scrollX;
    const cy = r.top  + r.height / 2 + window.scrollY;
    for (let i = 0; i < 10; i++) {
      const s = document.createElement('div');
      s.className = 'sparkle';
      const angle = (i / 10) * Math.PI * 2;
      const dist  = 35 + Math.random() * 55;
      s.style.cssText = [
        `left:${cx}px`, `top:${cy}px`,
        `--tx:${(Math.cos(angle) * dist).toFixed(1)}px`,
        `--ty:${(Math.sin(angle) * dist).toFixed(1)}px`,
        `width:${3 + Math.random() * 4}px`, `height:${3 + Math.random() * 4}px`,
        `animation-duration:${(0.5 + Math.random() * 0.4).toFixed(2)}s`,
        `animation-delay:${(Math.random() * 0.15).toFixed(2)}s`,
      ].join(';');
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 950);
    }
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { burst(e.target); obs.unobserve(e.target); } });
  }, { threshold: 0.6 });
  document.querySelectorAll('.section-title').forEach(el => obs.observe(el));
})();

/* ===== SECTION GLOW ORBS ===== */
(function initSectionGlowOrbs() {
  document.querySelectorAll('.about, .skills, .projects, .experience, .contact').forEach((sec, i) => {
    const orb = document.createElement('div');
    orb.className = 'section-glow-orb';
    orb.setAttribute('aria-hidden', 'true');
    const size = 300 + (i % 3) * 100;
    orb.style.cssText = [
      `width:${size}px`, `height:${size}px`,
      `background:radial-gradient(circle, rgba(92,51,23,0.12) 0%, transparent 70%)`,
      i % 2 === 0 ? 'top:10%; left:-80px' : 'bottom:10%; right:-80px',
      `animation-delay:${i * 1.2}s`,
    ].join(';');
    sec.appendChild(orb);
  });
})();

/* ===== BUTTON RIPPLE EFFECT ===== */
(function initRipple() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const r = this.getBoundingClientRect();
      const size = Math.max(r.width, r.height) * 2;
      const el = document.createElement('span');
      el.className = 'ripple';
      el.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-r.left-size/2}px;top:${e.clientY-r.top-size/2}px`;
      this.appendChild(el);
      setTimeout(() => el.remove(), 600);
    });
  });
})();

/* ===== BUTTON CLICK SOUND ===== */
(function initClickSound() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  let ctx = null;

  function playClick(type) {
    try {
      if (!ctx) ctx = new AudioCtx();
      if (ctx.state === 'suspended') { ctx.resume(); return; }
      const now = ctx.currentTime;
      const master = ctx.createGain();
      master.gain.value = 0.12;
      master.connect(ctx.destination);

      if (type === 'nav') {
        /* Soft tick for nav links */
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine'; o.frequency.value = 880;
        g.gain.setValueAtTime(0.08, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        o.connect(g); g.connect(master);
        o.start(now); o.stop(now + 0.07);
      } else {
        /* Satisfying click for buttons */
        const o1 = ctx.createOscillator();
        const g1 = ctx.createGain();
        o1.type = 'sine'; o1.frequency.value = 440;
        g1.gain.setValueAtTime(0.1, now);
        g1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        o1.connect(g1); g1.connect(master);
        o1.start(now); o1.stop(now + 0.09);

        const o2 = ctx.createOscillator();
        const g2 = ctx.createGain();
        o2.type = 'triangle'; o2.frequency.value = 880;
        g2.gain.setValueAtTime(0.06, now + 0.05);
        g2.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
        o2.connect(g2); g2.connect(master);
        o2.start(now + 0.05); o2.stop(now + 0.14);
      }
    } catch(e) {}
  }

  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', () => playClick('btn'));
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => playClick('nav'));
  });
})();

/* ===== ENHANCED BACK-TO-TOP ===== */
(function enhanceBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ===== SECTION AMBIENT SOUND on scroll ===== */
(function initSectionSound() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  let ctx = null;
  let lastSection = '';

  const sectionTones = {
    home:       [261.6, 0.06],
    about:      [293.7, 0.05],
    skills:     [329.6, 0.05],
    projects:   [349.2, 0.05],
    experience: [392.0, 0.05],
    contact:    [440.0, 0.05],
    resume:     [493.9, 0.05],
  };

  function playTone(freq, vol) {
    try {
      if (!ctx) ctx = new AudioCtx();
      if (ctx.state === 'suspended') return;
      const now = ctx.currentTime;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = freq;
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(vol, now + 0.1);
      g.gain.linearRampToValueAtTime(0, now + 0.6);
      o.connect(g); g.connect(ctx.destination);
      o.start(now); o.stop(now + 0.7);
    } catch(e) {}
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      if (id && id !== lastSection && sectionTones[id]) {
        lastSection = id;
        playTone(sectionTones[id][0], sectionTones[id][1]);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('section[id]').forEach(sec => obs.observe(sec));
})();

/* ===== GLOBAL BACKGROUND CANVAS (connected particles) ===== */
(function initBgCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles;
  const COUNT  = 55;
  const MAXD   = 160; // connection max distance
  const C_ACC  = 'rgba(196,154,108,';

  class Dot {
    constructor() { this.reset(true); }
    reset(init) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : -10;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = Math.random() * 0.25 + 0.1;
      this.r  = Math.random() * 1.5 + 0.5;
      this.a  = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y > H + 10) this.reset(false);
      if (this.x < -10 || this.x > W + 10) this.vx *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = C_ACC + this.a + ')';
      ctx.fill();
    }
  }

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, () => new Dot());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    /* Draw connections */
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAXD) {
          const alpha = (1 - dist / MAXD) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = C_ACC + alpha + ')';
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    /* Draw dots */
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize, { passive: true });
  init();
  draw();
})();

/* ===== HERO CANVAS — BEST EVER BACKGROUND ANIMATION ===== */
(function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const heroSection = document.getElementById('home');
  if (!heroSection) return;

  let W, H, t = 0;
  let mouse = { x: -9999, y: -9999 };

  function resize() {
    W = canvas.width  = heroSection.offsetWidth  || window.innerWidth;
    H = canvas.height = heroSection.offsetHeight || window.innerHeight;
  }

  /* === 1. PARTICLE CONSTELLATION === */
  const PCNT = 90;
  const PDIST = 140;
  const particles = [];

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.r  = 1 + Math.random() * 2;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.baseA = 0.3 + Math.random() * 0.5;
      this.pulse = Math.random() * Math.PI * 2;
    }
    update() {
      this.pulse += 0.03;
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 130 && d > 0) {
        const f = (130 - d) / 130;
        this.vx += (dx / d) * f * 0.7;
        this.vy += (dy / d) * f * 0.7;
      }
      this.vx *= 0.97;
      this.vy *= 0.97;
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < -5)  this.x = W + 5;
      if (this.x > W+5) this.x = -5;
      if (this.y < -5)  this.y = H + 5;
      if (this.y > H+5) this.y = -5;
    }
    draw() {
      const alpha = this.baseA * (0.7 + 0.3 * Math.sin(this.pulse));
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(196,154,108,' + alpha + ')';
      ctx.fill();
    }
  }

  function initParticles() {
    particles.length = 0;
    for (let i = 0; i < PCNT; i++) particles.push(new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < PDIST) {
          const alpha = (1 - d / PDIST) * 0.18;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(196,154,108,' + alpha + ')';
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
  }

  /* === 2. 3D PERSPECTIVE GRID === */
  function drawGrid() {
    const VPX = W / 2;
    const VPY = H * 0.38;
    const ROWS = 14, COLS = 16;
    const FLOOR_Y = H * 1.05;
    const SPREAD  = W * 1.6;
    const speed   = (t * 0.008) % 1;

    ctx.save();
    ctx.globalAlpha = 0.07;
    ctx.strokeStyle = '#C49A6C';
    ctx.lineWidth = 0.8;

    for (let r = 0; r < ROWS; r++) {
      const prog = ((r / ROWS) + speed) % 1;
      const y = VPY + (FLOOR_Y - VPY) * (prog * prog);
      const spread = prog * SPREAD;
      ctx.beginPath();
      ctx.moveTo(VPX - spread / 2, y);
      ctx.lineTo(VPX + spread / 2, y);
      ctx.stroke();
    }

    for (let c = 0; c <= COLS; c++) {
      const x = (c / COLS) * SPREAD - SPREAD / 2 + VPX;
      ctx.beginPath();
      ctx.moveTo(VPX, VPY);
      ctx.lineTo(VPX + (x - VPX) * 1.5, FLOOR_Y);
      ctx.stroke();
    }
    ctx.restore();
  }

  /* === 3. EXPANDING RING PULSES === */
  const rings = [];
  let lastRing = 0;

  function spawnRing() {
    rings.push({ x: W / 2, y: H / 2, r: 0, maxR: Math.sqrt(W*W + H*H) * 0.6, a: 0.55 });
  }

  function drawRings() {
    const now = performance.now();
    if (now - lastRing > 2800) { spawnRing(); lastRing = now; }

    for (let i = rings.length - 1; i >= 0; i--) {
      const ring = rings[i];
      ring.r += 2.2;
      ring.a -= 0.0012;
      if (ring.a <= 0) { rings.splice(i, 1); continue; }

      const frac = ring.r / ring.maxR;
      const strokeA = ring.a * (1 - frac);

      ctx.beginPath();
      ctx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(196,154,108,' + strokeA + ')';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      if (ring.r > 20) {
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.r - 8, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(140,80,30,' + (strokeA * 0.4) + ')';
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }

  /* === 4. CURSOR GLOW === */
  function drawCursorGlow() {
    if (mouse.x < 0) return;
    const grd = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 100);
    grd.addColorStop(0,   'rgba(196,154,108,0.13)');
    grd.addColorStop(0.5, 'rgba(196,154,108,0.04)');
    grd.addColorStop(1,   'rgba(196,154,108,0)');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 100, 0, Math.PI * 2);
    ctx.fill();
  }

  /* === 5. SHOOTING STARS === */
  const stars = [];

  function spawnStar() {
    if (Math.random() > 0.008) return;
    stars.push({
      x:   Math.random() * W,
      y:   Math.random() * H * 0.5,
      len: 60 + Math.random() * 100,
      spd: 4 + Math.random() * 5,
      a:   0.8,
      ang: Math.PI * 0.55
    });
  }

  function drawStars() {
    spawnStar();
    for (let i = stars.length - 1; i >= 0; i--) {
      const s = stars[i];
      s.x += Math.cos(s.ang) * s.spd;
      s.y += Math.sin(s.ang) * s.spd;
      s.a -= 0.012;
      if (s.a <= 0 || s.y > H + 20) { stars.splice(i, 1); continue; }

      ctx.save();
      ctx.globalAlpha = s.a;
      const grd = ctx.createLinearGradient(
        s.x - Math.cos(s.ang) * s.len, s.y - Math.sin(s.ang) * s.len,
        s.x, s.y
      );
      grd.addColorStop(0, 'rgba(196,154,108,0)');
      grd.addColorStop(1, 'rgba(245,236,215,' + s.a + ')');
      ctx.strokeStyle = grd;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(s.x - Math.cos(s.ang) * s.len, s.y - Math.sin(s.ang) * s.len);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();
      ctx.restore();
    }
  }

  /* === 6. FLOATING CODE KEYWORDS === */
  const KEYWORDS = ['{ }', '</>', 'fn()', 'async', '/* */', 'git', 'npm', 'API', '=>', '[]'];

  function initKeywords() {
    document.querySelectorAll('.hero-kw').forEach(el => el.remove());
    KEYWORDS.forEach(function(kw, i) {
      const el = document.createElement('span');
      el.className = 'hero-kw';
      el.textContent = kw;
      el.style.left   = (8 + Math.random() * 84) + '%';
      el.style.top    = (10 + Math.random() * 70) + '%';
      el.style.opacity = (0.07 + Math.random() * 0.1).toFixed(2);
      el.style.animationDelay    = (i * 1.2) + 's';
      el.style.animationDuration = (10 + Math.random() * 8) + 's';
      heroSection.appendChild(el);
    });
  }

  /* === MAIN LOOP === */
  function loop() {
    ctx.clearRect(0, 0, W, H);
    t++;
    drawGrid();
    drawCursorGlow();
    drawRings();
    drawStars();
    drawConnections();
    particles.forEach(function(p) { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  /* === MOUSE === */
  heroSection.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }, { passive: true });

  heroSection.addEventListener('mouseleave', function() {
    mouse.x = -9999; mouse.y = -9999;
  }, { passive: true });

  /* === INIT === */
  function init() {
    resize();
    initParticles();
    initKeywords();
    spawnRing();
    lastRing = performance.now();
    loop();
  }

  window.addEventListener('resize', function() {
    resize();
    initParticles();
  }, { passive: true });

  /* Start after loader or after 4s fallback */
  var started = false;
  function tryStart() {
    if (started) return;
    started = true;
    init();
  }

  var loaderEl = document.getElementById('loader');
  if (loaderEl) {
    var obs = new MutationObserver(function() {
      var st = loaderEl.style.opacity;
      if (st === '0' || parseFloat(st) < 0.1 || loaderEl.style.display === 'none') {
        obs.disconnect();
        tryStart();
      }
    });
    obs.observe(loaderEl, { attributes: true, attributeFilter: ['style', 'class'] });
    setTimeout(tryStart, 4200);
  } else {
    tryStart();
  }
})();
