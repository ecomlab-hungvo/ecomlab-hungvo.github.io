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
    replay: '<path d="M4 12a8 8 0 1 0 2.5-5.8"/><path d="M4 4v4.5h4.5"/>'
  };
  var sprite = '<svg class="icon-sprite" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">';
  Object.keys(ICONS).forEach(function (name) {
    sprite += '<symbol id="i-' + name + '" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">' + ICONS[name] + '</g></symbol>';
  });
  document.body.insertAdjacentHTML('afterbegin', sprite + '</svg>');

  /* Language switch */
  var root = document.documentElement;
  var titleEn = document.title;
  function setLang(lang) {
    root.lang = lang;
    root.dataset.lang = lang;
    document.title = lang === 'vi' && root.dataset.titleVi ? root.dataset.titleVi : titleEn;
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

  /* Hero slider: moves on its own until someone uses the controls */
  document.querySelectorAll('[data-slider]').forEach(function (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.slide'));
    var tabs = Array.prototype.slice.call(slider.querySelectorAll('.slider-tab'));
    var bar = slider.querySelector('.slider-bar');
    var current = 0;
    var timer;

    function go(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-on', i === current);
        slide.setAttribute('aria-hidden', String(i !== current));
      });
      tabs.forEach(function (tab, i) { tab.setAttribute('aria-current', String(i === current)); });
    }
    function stop() {
      clearInterval(timer);
      timer = null;
      bar.classList.remove('is-playing');
    }
    function start() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      bar.classList.add('is-playing');
      timer = setInterval(function () { go(current + 1); }, 7000);
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { stop(); go(i); });
    });
    slider.querySelector('[data-prev]').addEventListener('click', function () { stop(); go(current - 1); });
    slider.querySelector('[data-next]').addEventListener('click', function () { stop(); go(current + 1); });
    slider.addEventListener('focusin', stop);
    go(0);
    start();
  });

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

  /* Infographic scenes: each step switches on the parts marked with data-from */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
      timer = setTimeout(function () { advance(1); }, 300);
    }

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
        if (entries[0].isIntersecting) { seen.disconnect(); play(); }
      }, { threshold: 0.4 });
      seen.observe(scene);
    }
  });
})();
