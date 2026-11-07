# Ecom Lab

Hung Vo's personal website and free course on ecommerce supply chain, in English and Vietnamese.

## Common edits

- **Add a YouTube video:** open the lesson's HTML file, find `data-youtube=""` and paste the video link between the quotes.
- **Change any text:** each sentence appears twice, marked `data-l="en"` and `data-l="vi"`. Update both.
- **Change the header or footer:** they are repeated in `index.html`, `course.html` and `lesson-sample.html`, so update all three.
- **Add the course outline:** replace the placeholder rows in `course.html`. Copy `lesson-sample.html` for each new lesson, and give each one its own `data-lesson` and `data-toggle-done` value.
- **Before going live:** search for `Draft` to find the notes that still need removing.

The site is plain HTML, CSS and JavaScript, so it needs no build step and runs on GitHub Pages.
