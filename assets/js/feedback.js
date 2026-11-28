/* Feedback form: the site has no server, so it opens the learner's email app with the message filled in.
   Links can preselect the topic: feedback.html?about=lesson-1 (course, lesson-1, lesson-2, lesson-3, resources, website). */
(function () {
  var form = document.querySelector('[data-feedback]');
  if (!form) return;
  var TO = 'hungvo1803@gmail.com';
  var root = document.documentElement;

  var opts = form.querySelectorAll('option[data-vi]');
  opts.forEach(function (o) { o.dataset.en = o.textContent; });
  function localize() {
    var vi = root.dataset.lang !== 'en';
    opts.forEach(function (o) { o.textContent = vi ? o.dataset.vi : o.dataset.en; });
  }
  localize();
  new MutationObserver(localize).observe(root, { attributes: true, attributeFilter: ['data-lang'] });

  var PRESET = { course: 'Whole course', 'lesson-1': 'Lesson 1', 'lesson-2': 'Lesson 2', 'lesson-3': 'Lesson 3', resources: 'Resources', website: 'Website' };
  var about = new URLSearchParams(location.search).get('about');
  if (PRESET[about]) form.elements.about.value = PRESET[about];

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var rate = form.querySelector('input[name="rate"]:checked');
    var good = form.elements.good.value.trim();
    var fix = form.elements.fix.value.trim();
    var err = form.querySelector('[data-fb-err]');
    err.hidden = !!(rate || good || fix);
    if (!err.hidden) { form.elements.fix.focus(); return; }
    var topic = form.elements.about.value;
    var body = [
      'About: ' + topic,
      'Useful (1-5): ' + (rate ? rate.value : '-'),
      '',
      'What worked well:',
      good || '-',
      '',
      'What to fix or add:',
      fix || '-',
      '',
      'Name: ' + (form.elements.name.value.trim() || '-'),
      'Reply to: ' + (form.elements.contact.value.trim() || '-')
    ].join('\n');
    window.location.href = 'mailto:' + TO +
      '?subject=' + encodeURIComponent('Ecom LAB feedback: ' + topic) +
      '&body=' + encodeURIComponent(body);
  });
})();
