/* Ecom Lab: language switch, menu, icons, infographic scenes, video slots, lesson progress. */
(function () {
  var LANG_KEY = 'ecomlab-lang';
  var DONE_KEY = 'ecomlab-done';

  // Browser storage can be blocked, so every read and write is guarded.
  function read(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function write(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* carry on without saving */ } }

  /* Icons: one family, 24px grid, 1.75 stroke */
  var ICONS = {
    store: '<path d="M4 11v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8"/><path d="M3 9l2-5h14l2 5"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/><path d="M10 20v-5h4v5"/>',
    chart: '<path d="M4 4v16h16"/><path d="M8 16v-4M12 16V8M16 16v-6"/>',
    live: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 11l5-3v8l-5-3"/><circle cx="8" cy="12" r="1.6"/>',
    box: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5L12 12l8-4.5M12 12v9"/><path d="M8 5.3l8 4.5"/>',
    clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><rect x="9" y="2.5" width="6" height="3.5" rx="1"/><path d="M8.5 11h7M8.5 15h5"/>',
    truck: '<path d="M5 18H2.5V6h12v12H9.5"/><path d="M14.5 10h4l3 3.5V18h-2"/><path d="M14.5 18h.5"/><circle cx="7.2" cy="18" r="2.1"/><circle cx="17.3" cy="18" r="2.1"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l3 3 5-6"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    book: '<path d="M12 6c-2-1.5-5-2-8-2v15c3 0 6 .5 8 2 2-1.5 5-2 8-2V4c-3 0-6 .5-8 2z"/><path d="M12 6v15"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    pen: '<path d="M4 20l1-4L16 5l3 3L8 19z"/><path d="M14 7l3 3"/>',
    sheet: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 10h16M4 15h16M10 4v16"/>',
    list: '<path d="M4 6.5L5.5 8 8 5M4 12.5L5.5 14 8 11M4 18.5L5.5 20 8 17"/><path d="M12 7h8M12 13h8M12 19h8"/>',
    replay: '<path d="M4 12a8 8 0 1 0 2.5-5.8"/><path d="M4 4v4.5h4.5"/>',
    factory: '<path d="M3 20V10.5l5 3v-3l5 3V5h4v15"/><path d="M17 9h3.5v11"/><path d="M2 20h20"/><path d="M7 17h2M12 17h2"/>',
    user: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5"/>',
    ship: '<path d="M3 14.5l1.8 4.5h14.4l1.8-4.5z"/><path d="M6 14.5V9h12v5.5"/><path d="M10 9V5h4v4"/><path d="M2.5 21.5c1.5 0 1.5-.8 3-.8s1.5.8 3 .8 1.5-.8 3-.8 1.5.8 3 .8 1.5-.8 3-.8 1.5.8 3 .8"/>',
    warehouse: '<path d="M3 20V9l9-5 9 5v11"/><path d="M7 20v-7h10v7"/><path d="M7 16.5h10"/>',
    card: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18M7 15h3"/>',
    search: '<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/>',
    door: '<path d="M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17"/><path d="M3.5 21h17"/><circle cx="14.5" cy="12.5" r="1"/>',
    megaphone: '<path d="M4 10v4h3l7 4V6l-7 4z"/><path d="M17.5 9.5a3.5 3.5 0 0 1 0 5"/><path d="M7 14l1.5 5H11l-1-4.4"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    chevron: '<path d="M15 6l-6 6 6 6"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    home: '<path d="M4 11l8-7 8 7"/><path d="M6 9.5V20h12V9.5"/><path d="M10 20v-5h4v5"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>',
    cloud: '<path d="M7 18h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.2 9.1 4.5 4.5 0 0 0 7 18z"/>',
    star: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>',
    cap: '<path d="M2.5 9.5L12 5l9.5 4.5L12 14z"/><path d="M6.5 11.5V16c1.5 1.3 3.4 2 5.5 2s4-.7 5.5-2v-4.5"/><path d="M21.5 9.5V15"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/><path d="M3 12.5h18"/>',
    doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/><path d="M9 12h6M9 16h6"/>',
    phone: '<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18.5h2"/>',
    coin: '<circle cx="12" cy="12" r="9"/><path d="M14.8 9.2c-.5-1-1.6-1.6-2.8-1.6-1.6 0-2.8.9-2.8 2.1 0 2.9 5.8 1.6 5.8 4.5 0 1.2-1.3 2.2-3 2.2-1.3 0-2.5-.6-3-1.7M12 6v1.6M12 16.4V18"/>'
  };
  var sprite = '<svg class="icon-sprite" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">';
  Object.keys(ICONS).forEach(function (name) {
    sprite += '<symbol id="i-' + name + '" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">' + ICONS[name] + '</g></symbol>';
  });
  document.body.insertAdjacentHTML('afterbegin', sprite + '</svg>');

  /* Language switch */
  var root = document.documentElement;
  // English is the default: <title> and the meta description hold English, data-title-vi and data-desc-vi hold Vietnamese.
  var titleEn = document.title;
  var metaDesc = document.querySelector('meta[name="description"]');
  var descEn = metaDesc ? metaDesc.getAttribute('content') : '';

  // Header: mark the section this page belongs to. Course and lesson pages count as Courses.
  var where = location.pathname;
  var page = where.split('/').pop() || 'index.html';
  var section = (/^(course|lesson-)/.test(page) || where.indexOf('/courses/') !== -1) ? 'courses.html' : page.replace(/\.html$/, '') + '.html';
  document.querySelectorAll('.nav a').forEach(function (a) {
    if (a.getAttribute('href').replace(/^\//, '') === section) a.setAttribute('aria-current', 'page');
  });
  function setLang(lang) {
    root.lang = lang;
    root.dataset.lang = lang;
    document.title = lang === 'vi' && root.dataset.titleVi ? root.dataset.titleVi : titleEn;
    if (metaDesc && root.dataset.descVi) metaDesc.setAttribute('content', lang === 'vi' ? root.dataset.descVi : descEn);
    document.querySelectorAll('[data-set-lang]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.dataset.setLang === lang));
    });
    document.querySelectorAll('[data-aria-vi]').forEach(function (el) {
      if (!el.dataset.ariaEn) el.dataset.ariaEn = el.getAttribute('aria-label');
      el.setAttribute('aria-label', lang === 'vi' ? el.dataset.ariaVi : el.dataset.ariaEn);
    });
  }
  document.querySelectorAll('[data-set-lang]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      write(LANG_KEY, btn.dataset.setLang);
      setLang(btn.dataset.setLang);
    });
  });
  setLang(root.dataset.lang === 'vi' ? 'vi' : 'en');


  /* Video slots. Put a YouTube link or id in data-youtube and the video appears. */
  function youtubeId(value) {
    var match = value.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
    if (match) return match[1];
    return /^[\w-]{11}$/.test(value) ? value : '';
  }
  document.querySelectorAll('[data-youtube]').forEach(function (slot) {
    var id = youtubeId(slot.dataset.youtube.trim());
    if (!id) return;
    var frame = document.createElement('iframe');
    frame.src = 'https://www.youtube-nocookie.com/embed/' + id;
    frame.title = slot.dataset.videoTitle || 'Lesson video';
    frame.allow = 'accelerometer; encrypted-media; gyroscope; picture-in-picture';
    frame.allowFullscreen = true;
    frame.loading = 'lazy';
    slot.textContent = '';
    slot.appendChild(frame);
  });

  /* Lesson progress lives only in the learner's own browser */
  function doneList() {
    try { return JSON.parse(read(DONE_KEY)) || []; } catch (e) { return []; }
  }
  function refreshDone() {
    var done = doneList();
    document.querySelectorAll('[data-lesson]').forEach(function (el) {
      el.dataset.done = String(done.indexOf(el.dataset.lesson) !== -1);
    });
  }
  document.querySelectorAll('[data-toggle-done]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.dataset.toggleDone;
      var done = doneList();
      var at = done.indexOf(id);
      if (at === -1) done.push(id); else done.splice(at, 1);
      write(DONE_KEY, JSON.stringify(done));
      refreshDone();
    });
  });
  refreshDone();

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Reveal: visuals marked data-reveal play once when they scroll into view.
     Children with class "r" appear one by one, in the order set by --i. */
  /* Logistics flows: each route reveals on its own, and a parcel rides from the first stop to the last. */
  document.querySelectorAll('.flow').forEach(function (flow) {
    flow.setAttribute('data-reveal', '');
    var parcel = document.createElement('li');
    parcel.className = 'fl-parcel';
    parcel.setAttribute('aria-hidden', 'true');
    parcel.innerHTML = '<svg class="icon"><use href="#i-box"/></svg>';
    flow.insertBefore(parcel, flow.firstChild);
    var stops = flow.querySelectorAll('.fl-node').length;
    flow.style.setProperty('--n', stops);
    flow.style.setProperty('--ride', ((stops - 1) * 0.35).toFixed(2) + 's');
  });
  function placeParcels() {
    document.querySelectorAll('.flow').forEach(function (flow) {
      var dots = flow.querySelectorAll('.fl-dot');
      if (!dots.length) return;
      var box = flow.getBoundingClientRect();
      var a = dots[0].getBoundingClientRect(), b = dots[dots.length - 1].getBoundingClientRect();
      flow.style.setProperty('--fx', (a.left + a.width / 2 - box.left) + 'px');
      flow.style.setProperty('--fy', (a.top + a.height / 2 - box.top) + 'px');
      flow.style.setProperty('--tx', (b.left + b.width / 2 - box.left) + 'px');
      flow.style.setProperty('--ty', (b.top + b.height / 2 - box.top) + 'px');
    });
  }
  placeParcels();
  window.addEventListener('load', placeParcels);
  window.addEventListener('resize', placeParcels);

  // Other blocks that fade up on their own.
  document.querySelectorAll('.fl-legend, .fl-sum, .ai-reflect, .practice > p').forEach(function (el) {
    if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', 'self');
  });
  document.querySelectorAll('.ai-steps').forEach(function (el) { el.setAttribute('data-reveal', ''); });

  /* Big numbers count up the first time they come into view: data-count, with optional data-prefix / data-suffix. */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window && !reduceMotion) {
    var counter = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        counter.unobserve(entry.target);
        var el = entry.target, target = parseFloat(el.dataset.count), finalText = el.textContent;
        var pre = el.dataset.prefix || '', suf = el.dataset.suffix || '', start = null, dur = 1300;
        function tick(now) {
          if (start === null) start = now;
          var t = Math.min((now - start) / dur, 1), eased = 1 - Math.pow(1 - t, 3);
          el.textContent = pre + Math.round(target * eased) + suf;
          if (t < 1) requestAnimationFrame(tick); else el.textContent = finalText;
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { counter.observe(el); });
  }

  // Section headings fade up on their own, without needing markup in every page.
  document.querySelectorAll('.section-head, .part-section > .eyebrow, .part-section > h2').forEach(function (el) {
    if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', 'self');
  });
  var reveals = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window) || reduceMotion) {
    reveals.forEach(function (el) { el.classList.add('is-on'); });
  } else {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-on'); revealer.unobserve(entry.target); }
      });
    }, { threshold: 0.3 });
    reveals.forEach(function (el) { revealer.observe(el); });
  }

  /* Infographic scenes: each step switches on the parts marked with data-from */
  document.querySelectorAll('[data-scene]').forEach(function (scene) {
    var parts = Array.prototype.slice.call(scene.querySelectorAll('[data-from]'));
    var items = Array.prototype.slice.call(scene.querySelectorAll('.step-list li'));
    var mover = scene.querySelector('[data-mover]');
    var stops = mover ? mover.dataset.mover.split(' ').map(function (p) { return p.split(','); }) : [];
    var total = items.length;
    var timer, moveTimer;

    function show(step) {
      scene.dataset.step = step;
      parts.forEach(function (el) {
        el.classList.toggle('on', step >= +el.dataset.from);
      });
      items.forEach(function (li, i) {
        var active = i + 1 === step;
        li.classList.toggle('is-active', active);
        li.querySelector('button').setAttribute('aria-current', active ? 'step' : 'false');
      });
      if (mover && step >= 1) {
        scene.style.setProperty('--p', (step - 1) / (total - 1) * 100);
        mover.style.transform = 'translate(' + stops[step - 1][0] + 'px, ' + stops[step - 1][1] + 'px)';
        scene.classList.add('is-moving');
        clearTimeout(moveTimer);
        moveTimer = setTimeout(function () { scene.classList.remove('is-moving'); }, 900);
      }
    }
    function advance(step) {
      show(step);
      if (step < total) timer = setTimeout(function () { advance(step + 1); }, 2200);
    }
    function play() {
      clearTimeout(timer);
      if (reduceMotion) { show(total); return; }
      show(0);
      // While presenting, the presenter steps through the scene by hand.
      if (root.classList.contains('is-presenting')) return;
      timer = setTimeout(function () { advance(1); }, 300);
    }
    scene.sceneApi = { show: show, total: total, stop: function () { clearTimeout(timer); } };

    var willAutoplay = 'IntersectionObserver' in window && !reduceMotion;
    show(willAutoplay ? 0 : total);
    scene.querySelector('.replay').addEventListener('click', play);
    items.forEach(function (li, i) {
      li.querySelector('button').addEventListener('click', function () {
        clearTimeout(timer);
        show(i + 1);
      });
    });
    if (willAutoplay) {
      var seen = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { seen.disconnect(); if (!root.classList.contains('is-presenting')) play(); }
      }, { threshold: 0.4 });
      seen.observe(scene);
    }
  });

  /* Present mode, for teaching and screen recording.
     Each section of a part page becomes one full-screen slide. The right arrow (or Space)
     first steps through the slide's scene, then moves to the next slide. Esc leaves. */
  var shell = document.querySelector('.lesson-shell');
  if (shell) {
    var slides = [];
    shell.querySelectorAll('.part-head, .part-section').forEach(function (s) {
      if (s.querySelector('.video')) s.setAttribute('data-no-present', ''); else slides.push(s);
    });
    var both = function (en, vi) { return '<span data-l="en">' + en + '</span><span data-l="vi">' + vi + '</span>'; };
    shell.querySelector('.part-head').insertAdjacentHTML('beforeend',
      '<button class="btn btn--secondary present-btn" type="button"><svg class="icon" aria-hidden="true"><use href="#i-live"/></svg>' +
      both('Present mode', 'Chế độ trình chiếu') + '</button>');
    document.body.insertAdjacentHTML('beforeend',
      '<div class="present-hud" role="group" aria-label="Presentation controls" data-aria-vi="Điều khiển trình chiếu">' +
      '<button type="button" data-p="prev" aria-label="Previous" data-aria-vi="Lùi lại">&#8249;</button>' +
      '<span class="present-count" aria-live="polite"></span>' +
      '<button type="button" data-p="next" aria-label="Next" data-aria-vi="Tiếp theo">&#8250;</button>' +
      '<button type="button" data-p="exit">Esc</button></div>');
    setLang(root.lang === 'vi' ? 'vi' : 'en');
    var hud = document.querySelector('.present-hud');
    var count = hud.querySelector('.present-count');
    var idleTimer;

    var presenting = function () { return root.classList.contains('is-presenting'); };
    var currentSlide = function () {
      var best = 0, bestGap = Infinity;
      slides.forEach(function (s, i) {
        var gap = Math.abs(s.getBoundingClientRect().top);
        if (gap < bestGap) { bestGap = gap; best = i; }
      });
      return best;
    };
    // Entering a slide rewinds its scene and replays its reveal animations.
    var prepare = function (slide) {
      var scene = slide.querySelector('[data-scene]');
      if (scene && scene.sceneApi) { scene.sceneApi.stop(); scene.sceneApi.show(0); }
      slide.querySelectorAll('[data-reveal]').forEach(function (el) {
        el.classList.remove('is-on');
        void el.offsetWidth;
        el.classList.add('is-on');
      });
    };
    var go = function (i) {
      i = Math.max(0, Math.min(slides.length - 1, i));
      window.scrollTo({ top: slides[i].getBoundingClientRect().top + window.pageYOffset, behavior: 'auto' });
      prepare(slides[i]);
      count.textContent = (i + 1) + ' / ' + slides.length;
    };
    var step = function (dir) {
      var i = currentSlide();
      var scene = slides[i].querySelector('[data-scene]');
      if (scene && scene.sceneApi) {
        var at = +scene.dataset.step + dir;
        if (at >= 1 && at <= scene.sceneApi.total) { scene.sceneApi.stop(); scene.sceneApi.show(at); return; }
        if (dir < 0 && at === 0) { scene.sceneApi.show(0); return; }
      }
      go(i + dir);
    };
    var wake = function () {
      root.classList.remove('is-idle');
      clearTimeout(idleTimer);
      idleTimer = setTimeout(function () { root.classList.add('is-idle'); }, 2500);
    };
    var enter = function () {
      var start = currentSlide();
      root.classList.add('is-presenting');
      if (root.requestFullscreen) root.requestFullscreen().catch(function () { /* stay windowed */ });
      go(start);
      wake();
    };
    var leave = function () {
      var at = currentSlide();
      root.classList.remove('is-presenting', 'is-idle');
      clearTimeout(idleTimer);
      if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen();
      slides[at].scrollIntoView();
    };

    shell.querySelector('.present-btn').addEventListener('click', enter);
    hud.addEventListener('click', function (e) {
      var action = e.target.closest('[data-p]');
      if (!action) return;
      if (action.dataset.p === 'exit') leave(); else step(action.dataset.p === 'next' ? 1 : -1);
    });
    document.addEventListener('mousemove', function () { if (presenting()) wake(); });
    document.addEventListener('fullscreenchange', function () { if (!document.fullscreenElement && presenting()) leave(); });
    document.addEventListener('keydown', function (e) {
      if (!presenting()) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ' || e.key === 'Enter') { e.preventDefault(); step(1); }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); step(-1); }
      else if (e.key === 'Home') { e.preventDefault(); go(0); }
      else if (e.key === 'End') { e.preventDefault(); go(slides.length - 1); }
      else if (e.key === 'Escape') leave();
    });
  }
})();

/* Copy buttons on AI prompts: copies the prompt in the language on screen */
(function () {
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.prompt-copy');
    if (!btn) return;
    var box = btn.closest('.prompt-box');
    var pre = Array.prototype.find.call(box.querySelectorAll('pre'), function (p) { return p.offsetParent !== null; }) || box.querySelector('pre');
    var text = pre.textContent.trim();
    var done = function () {
      btn.classList.add('is-copied');
      setTimeout(function () { btn.classList.remove('is-copied'); }, 1600);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, function () { fallback(text); done(); });
    } else { fallback(text); done(); }
  });
  function fallback(text) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (err) {}
    document.body.removeChild(ta);
  }
})();
