/* Ecom LAB: lists that come from the data/ folder (testimonials, courses, resources).
   Load after main.js. Each item carries both languages, so the VI/EN switch just works. */
(function () {


  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  // Both languages go into the page; the language switch shows one of them.
  function both(en, vi) {
    return '<span data-l="en">' + esc(en) + '</span><span data-l="vi">' + esc(vi || en) + '</span>';
  }
  function load(file) {
    return fetch(file, { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error(file + ' ' + r.status);
      return r.json();
    });
  }

  /* About: testimonials. Shown only with 3 or more entries. */
  var tSection = document.querySelector('[data-testimonials]');
  if (tSection) {
    load('data/testimonials.json').then(function (list) {
      if (!Array.isArray(list) || list.length < 3) return;
      tSection.querySelector('[data-testimonials-list]').innerHTML = list.map(function (t) {
        return '<li class="quote"><blockquote>' + both(t.quote_en, t.quote_vi) + '</blockquote>' +
          '<p class="quote-who"><b>' + esc(t.name) + '</b>' + (t.role ? '<span>' + esc(t.role) + '</span>' : '') + '</p></li>';
      }).join('');
      tSection.hidden = false;
    }).catch(function () { /* no testimonials: keep the section hidden */ });
  }

  /* Courses: one card per entry in data/courses.json */
  var cList = document.querySelector('[data-courses]');
  if (cList) {
    load('data/courses.json').then(function (list) {
      cList.innerHTML = list.map(function (c, i) {
        var open = c.status === 'open' && c.url;
        var tag = open ? 'a' : 'div';
        var points = (c.points || []).map(function (p) { return '<li>' + both(p.en, p.vi) + '</li>'; }).join('');
        return '<' + tag + ' class="lcard ' + (open ? 'lcard--open on-dark' : 'lcard--soon') + '"' +
          (open ? ' href="' + esc(c.url) + '"' : '') + ' style="--i:' + i + '">' +
          '<span class="lcard-top"><span class="lcard-code">' + esc(c.code) + '</span>' +
          '<span class="stamp' + (open ? ' stamp--success' : '') + '">' + (open ? both('Free', 'Miễn phí') : both('Soon', 'Sắp có')) + '</span></span>' +
          '<span class="eyebrow">' + both(c.meta_en, c.meta_vi) + '</span>' +
          '<h2 class="lcard-h">' + both(c.title_en, c.title_vi) + '</h2>' +
          '<p class="lcard-p">' + both(c.summary_en, c.summary_vi) + '</p>' +
          (points ? '<ul class="lcard-points">' + points + '</ul>' : '') +
          (open ? '<span class="lcard-foot">' + both('See the course', 'Xem khoá học') + '<span aria-hidden="true">&rarr;</span></span>' : '') +
          '</' + tag + '>';
      }).join('');
      requestAnimationFrame(function () { cList.classList.add('is-on'); });
    }).catch(function () {
      cList.innerHTML = '<p class="data-error">' + both('The course list could not load. Please refresh the page.', 'Không tải được danh sách khoá học. Bạn tải lại trang nhé.') + '</p>';
    });
  }

  /* Resources: cards from data/resources.json, with a topic filter */
  var rWrap = document.querySelector('[data-resources]');
  if (rWrap) {
    var rList = rWrap.querySelector('[data-resources-list]');
    var rEmpty = rWrap.querySelector('[data-resources-empty]');
    var rFilter = rWrap.querySelector('[data-resources-filter]');
    var TOPICS = { 'Supply chain': 'Chuỗi cung ứng', 'Ecommerce': 'Thương mại điện tử', 'Career': 'Sự nghiệp' };
    var TYPES = { 'Template': 'Mẫu', 'Checklist': 'Checklist', 'Article': 'Bài viết' };
    var items = [];
    var topic = 'all';

    function render() {
      var shown = items.filter(function (r) { return topic === 'all' || r.topic === topic; });
      rList.innerHTML = shown.map(function (r) {
        return '<li><a class="res-card" href="' + esc(r.url) + '" target="_blank" rel="noopener">' +
          '<span class="res-top"><span class="res-tag">' + both(r.topic, TOPICS[r.topic]) + '</span>' +
          '<span class="res-type">' + both(r.type, TYPES[r.type]) + '</span></span>' +
          '<h2 class="res-h">' + both(r.title_en, r.title_vi) + '</h2>' +
          '<p class="res-p">' + both(r.summary_en, r.summary_vi) + '</p>' +
          '<span class="res-out">Notion <span aria-hidden="true">&#8599;</span><span class="sr-only">' + both('(opens in a new tab)', '(mở trong thẻ mới)') + '</span></span>' +
          '</a></li>';
      }).join('');
      rFilter.querySelectorAll('button').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.dataset.topic === topic));
      });
    }

    rFilter.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-topic]');
      if (!b) return;
      topic = b.dataset.topic;
      render();
    });

    load('data/resources.json').then(function (list) {
      items = Array.isArray(list) ? list : [];
      if (!items.length) { rEmpty.hidden = false; return; }
      rFilter.hidden = false;
      render();
    }).catch(function () { rEmpty.hidden = false; });
  }

})();
