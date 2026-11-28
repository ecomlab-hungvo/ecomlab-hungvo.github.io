/* Feedback page: shows the Google Form, with the topic preselected from the link.
   Example: feedback.html?about=lesson-1 (course, lesson-1, lesson-2, lesson-3, resources, website). */
(function () {
  var FORM = 'https://docs.google.com/forms/d/e/1FAIpQLScubgsH7WBd4re-y5SwnFQgUuGA8ab63qUbH8563UYwPCgSCg/viewform';
  var TOPIC_FIELD = 'entry.2100177769';
  // Must match the choices in the Google Form exactly.
  var TOPICS = {
    course: 'Whole course / Cả khoá học',
    'lesson-1': 'Lesson 1 / Bài 1',
    'lesson-2': 'Lesson 2 / Bài 2',
    'lesson-3': 'Lesson 3 / Bài 3',
    resources: 'Resources / Tài nguyên',
    website: 'Website'
  };
  var topic = TOPICS[new URLSearchParams(location.search).get('about')];
  var query = topic ? 'usp=pp_url&' + TOPIC_FIELD + '=' + encodeURIComponent(topic) : '';

  var frame = document.querySelector('[data-gform]');
  if (frame) frame.src = FORM + '?embedded=true' + (query ? '&' + query : '');
  var link = document.querySelector('[data-gform-link]');
  if (link) link.href = FORM + (query ? '?' + query : '');
})();
