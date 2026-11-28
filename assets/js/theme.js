/* Ecom LAB theme: background layer, mouse glow, scroll-to-dark zones, highlighter sweep, light/dark switch.
   Load after main.js on every page. Lesson pages carry html[data-no-dark] and stay light. */
(function () {
  var root = document.documentElement;
  var body = document.body;
  var THEME_KEY = 'ecomlab-theme';
  var noDark = root.hasAttribute('data-no-dark');
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;

  /* 1. Background: map dots + faint dashed shipping routes, behind everything */
  var field = document.createElement('div');
  field.className = 'bg-field';
  field.setAttribute('aria-hidden', 'true');
  field.innerHTML = '<div class="bg-dots"></div>' +
    '<svg class="bg-routes" viewBox="0 0 1440 900" preserveAspectRatio="none">' +
    '<path d="M-20 640 C 260 520, 420 700, 720 560 S 1160 380, 1460 470"/>' +
    '<path d="M180 -20 C 260 200, 120 330, 330 470 S 560 760, 470 920"/>' +
    '<path d="M1460 150 C 1210 230, 1100 90, 900 210 S 640 330, 540 260"/>' +
    '<circle cx="720" cy="560" r="3"/><circle cx="330" cy="470" r="3"/><circle cx="900" cy="210" r="3"/>' +
    '</svg>';
  body.insertBefore(field, body.firstChild);

  var glow = null;
  if (finePointer && !calm) {
    glow = document.createElement('div');
    glow.className = 'bg-glow';
    glow.setAttribute('aria-hidden', 'true');
    body.insertBefore(glow, body.firstChild);
  }

  /* 2. Mouse: glow follows the pointer, the dot field drifts a few pixels the other way */
  if (glow) {
    var mx = 0, my = 0, ticking = false;
    window.addEventListener('pointermove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        glow.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
        var dx = (mx / window.innerWidth - .5) * -14;
        var dy = (my / window.innerHeight - .5) * -10;
        field.style.transform = 'translate3d(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px,0)';
        glow.classList.add('is-live');
        ticking = false;
      });
    }, { passive: true });
    document.addEventListener('pointerleave', function () { glow.classList.remove('is-live'); });
  }

  /* 3. Scroll-to-dark: inside a [data-flip] zone the page turns deep forest */
  var zones = noDark ? [] : Array.prototype.slice.call(document.querySelectorAll('[data-flip]'));
  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function updateFlip() {
    if (root.dataset.theme === 'dark' || !zones.length) { body.style.removeProperty('--flip'); return; }
    var vh = window.innerHeight, f = 0, scrolled = clamp(window.scrollY / 160); // never dark before the reader scrolls
    zones.forEach(function (z) {
      var r = z.getBoundingClientRect();
      var inP = clamp((vh * .6 - r.top) / (vh * .4));        // zone top travels from 60% to 20% of the screen
      var outP = clamp((r.bottom - vh * .1) / (vh * .35));  // zone bottom travels from 45% to 10%
      f = Math.max(f, Math.min(inP, outP));
    });
    body.style.setProperty('--flip', (f * scrolled).toFixed(3));
  }
  if (zones.length) {
    var pending = false;
    window.addEventListener('scroll', function () {
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () { updateFlip(); pending = false; });
    }, { passive: true });
    window.addEventListener('resize', updateFlip);
    updateFlip();
  }

  /* 4. Highlighter sweeps in when its heading comes into view */
  var marks = document.querySelectorAll('.mark');
  if ('IntersectionObserver' in window && !calm) {
    var mo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-marked'); mo.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px' });
    marks.forEach(function (m) { mo.observe(m); });
  } else {
    marks.forEach(function (m) { m.classList.add('is-marked'); });
  }

  /* 5. Light/dark switch (hidden on lesson pages) */
  var toggle = document.querySelector('[data-theme-toggle]');
  function label() {
    if (!toggle) return;
    var dark = root.dataset.theme === 'dark';
    var en = dark ? 'Switch to light mode' : 'Switch to dark mode';
    var vi = dark ? 'Chuyển sang nền sáng' : 'Chuyển sang nền tối';
    toggle.dataset.ariaEn = en;
    toggle.dataset.ariaVi = vi;
    toggle.setAttribute('aria-label', root.dataset.lang === 'vi' ? vi : en);
    toggle.setAttribute('aria-pressed', String(dark));
  }
  if (toggle && !noDark) {
    label();
    toggle.addEventListener('click', function () {
      var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* keep going without saving */ }
      label();
      updateFlip();
    });
    new MutationObserver(label).observe(root, { attributes: true, attributeFilter: ['data-lang'] });
  }
})();
