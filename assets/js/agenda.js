/* Ecom Lab: the lesson agenda on the left of every part page.
   The course list lives here once. To publish a part, add its href. Load this before main.js. */
(function () {
  var COURSE = [
    { en: 'How cross-border ecommerce works', vi: 'Thương mại điện tử xuyên biên giới vận hành ra sao', parts: [
      { id: '1-1', num: '1.1', href: 'lesson-1-1.html', en: 'What cross-border ecommerce is', vi: 'Thương mại điện tử xuyên biên giới là gì' },
      { id: '1-2', num: '1.2', href: 'lesson-1-2.html', en: 'Inside Amazon', vi: 'Bên trong Amazon' },
      { id: '1-3', num: '1.3', href: 'lesson-1-3.html', en: 'From listing to checkout', vi: 'Từ trang sản phẩm tới cú bấm mua' }
    ] },
    { en: 'New product introduction', vi: 'Ra mắt sản phẩm mới', parts: [
      { id: '2-0', num: '2.0', href: 'lesson-2-0.html', en: 'Why most ideas should die', vi: 'Vì sao phần lớn ý tưởng nên dừng lại' },
      { id: '2-1', num: '2.1', href: 'lesson-2-1.html', en: 'Stage 1: Find ideas', vi: 'Giai đoạn 1: Tìm ý tưởng' },
      { id: '2-2', num: '2.2', href: 'lesson-2-2.html', en: 'Stage 2: Test the concept', vi: 'Giai đoạn 2: Kiểm tra ý tưởng sản phẩm' },
      { id: '2-3', num: '2.3', href: 'lesson-2-3.html', en: 'Stage 3: Develop the product', vi: 'Giai đoạn 3: Phát triển sản phẩm' },
      { id: '2-4', num: '2.4', href: 'lesson-2-4.html', en: 'Stage 4: First production', vi: 'Giai đoạn 4: Sản xuất lô đầu tiên' },
      { id: '2-5', num: '2.5', href: 'lesson-2-5.html', en: 'Stage 5: Launch and manage', vi: 'Giai đoạn 5: Ra mắt và quản lý' }
    ] },
    { en: 'Profit simulation', vi: 'Mô phỏng lợi nhuận', parts: [
      { id: '3-1', num: '3.1', href: 'lesson-3-1.html', en: 'Where the money goes', vi: 'Tiền đi đâu' },
      { id: '3-2', num: '3.2', href: 'lesson-3-2.html', en: 'Build your simulation', vi: 'Dựng bảng mô phỏng của bạn' },
      { id: '3-3', num: '3.3', href: 'lesson-3-3.html', en: 'Stress test and decide', vi: 'Thử kịch bản xấu và ra quyết định' }
    ] }
  ];
  var KEY = 'ecomlab-agenda';

  var shell = document.querySelector('[data-agenda]');
  if (!shell) return;
  var current = shell.dataset.agenda;

  function both(en, vi) { return '<span data-l="en">' + en + '</span><span data-l="vi">' + vi + '</span>'; }
  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function write(v) { try { localStorage.setItem(KEY, v); } catch (e) { /* not saved */ } }

  var html = '<nav class="agenda" id="agenda" aria-label="Course agenda" data-aria-vi="Mục lục khoá học">' +
    '<div class="agenda-head"><span class="eyebrow">' + both('Agenda', 'Mục lục') + '</span>' +
    '<button class="agenda-close" type="button" aria-controls="agenda" aria-label="Hide agenda" data-aria-vi="Ẩn mục lục">' +
    '<svg class="icon" aria-hidden="true"><use href="#i-chevron"/></svg></button></div>';
  COURSE.forEach(function (lesson, i) {
    html += '<div class="agenda-group"><p class="eyebrow">' + both('Lesson ' + (i + 1), 'Bài ' + (i + 1)) + '</p>' +
      '<p class="agenda-title">' + both(lesson.en, lesson.vi) + '</p><ul>';
    lesson.parts.forEach(function (p) {
      var inner = '<span class="agenda-num">' + p.num + '</span><span>' + both(p.en, p.vi) + '</span>';
      if (p.href) {
        html += '<li><a class="agenda-link" href="' + p.href + '" data-lesson="' + p.id + '"' +
          (p.id === current ? ' aria-current="page"' : '') + '>' + inner +
          '<svg class="icon agenda-tick" aria-hidden="true"><use href="#i-check"/></svg></a></li>';
      } else {
        html += '<li><span class="agenda-link agenda-link--soon">' + inner +
          '<span class="agenda-soon">' + both('Soon', 'Sắp có') + '</span></span></li>';
      }
    });
    html += '</ul></div>';
  });
  html += '<a class="agenda-back" href="course.html">&larr; ' + both('Course overview', 'Tổng quan khoá học') + '</a></nav>' +
    '<div class="agenda-backdrop" hidden></div>';
  shell.insertAdjacentHTML('afterbegin', html);

  var main = shell.querySelector('.lesson-main');
  main.insertAdjacentHTML('afterbegin',
    '<button class="agenda-open" type="button" aria-controls="agenda" aria-expanded="false">' +
    '<svg class="icon" aria-hidden="true"><use href="#i-menu"/></svg>' + both('Agenda', 'Mục lục') + '</button>');

  var nav = shell.querySelector('.agenda');
  var openBtn = shell.querySelector('.agenda-open');
  var closeBtn = shell.querySelector('.agenda-close');
  var backdrop = shell.querySelector('.agenda-backdrop');
  var wide = window.matchMedia('(min-width: 1024px)');

  function setOpen(open) {
    if (wide.matches) {
      shell.classList.toggle('is-collapsed', !open);
      write(open ? 'open' : 'closed');
    } else {
      nav.classList.toggle('is-open', open);
      backdrop.hidden = !open;
      if (open) nav.querySelector('a').focus();
    }
    openBtn.setAttribute('aria-expanded', String(open));
    if (!open) openBtn.focus();
  }
  function sync() {
    nav.classList.remove('is-open');
    backdrop.hidden = true;
    var open = wide.matches && read() !== 'closed';
    shell.classList.toggle('is-collapsed', wide.matches && !open);
    openBtn.setAttribute('aria-expanded', String(open));
  }
  openBtn.addEventListener('click', function () { setOpen(true); });
  closeBtn.addEventListener('click', function () { setOpen(false); });
  backdrop.addEventListener('click', function () { setOpen(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) setOpen(false);
  });
  if (wide.addEventListener) wide.addEventListener('change', sync); else wide.addListener(sync);
  sync();

  // Keep the current part in view inside a long agenda.
  var here = nav.querySelector('[aria-current="page"]');
  if (here && here.offsetTop + here.offsetHeight > nav.clientHeight) nav.scrollTop = here.offsetTop - nav.clientHeight / 3;
})();
