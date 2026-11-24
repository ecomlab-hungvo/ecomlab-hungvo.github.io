# Ecom Lab

Hung Vo's personal website and free course "From idea to profit on Amazon" (3 lessons, 12 parts), in English and Vietnamese.

## Common edits

- **Add a YouTube video:** open the lesson's HTML file, find `data-youtube=""` and paste the video link between the quotes.
- **Change any text:** each sentence appears twice, marked `data-l="en"` and `data-l="vi"`. Update both.
- **Change the header or footer:** they are repeated in every page (`index.html`, `course.html` and each `lesson-*.html`), so update them all. `lesson-sample.html` is an old draft that no page links to any more.
- **Publish a part:** copy `lesson-1-1.html` for the new part. Change `data-agenda`, `data-lesson` and `data-toggle-done` to the part's id (for example `2-1`), and update the prev/next links at the bottom. In `assets/js/agenda.js`, add `href` to that part so the left agenda links to it. In `course.html`, turn the part's dashed `div.module-row--empty` into an `a.module-row` like the Lesson 1 rows.
- **Agenda:** the left agenda on part pages is built from the course list at the top of `assets/js/agenda.js`, so part titles only need changing there and in `course.html`.
- **Scenes:** each part has one animated scene. Elements marked `data-from="N"` appear at step N, and each `li` in the `.step-list` below is one step and one key takeaway.
- **Present mode (for teaching and screen recording):** every part page has a "Present mode" button under its title. It hides the menu, agenda, footer, draft notes and video slot, and turns each section into one full-screen slide with larger type. Right arrow or Space steps through the scene, then moves to the next slide; left arrow goes back; Esc leaves. Keep each `section.part-section` to one idea so it fits one screen.
- **Text sizes:** every size comes from the type-scale tokens at the top of `assets/css/style.css` (`--fs-tiny` to `--fs-display`). Use a token, never a raw pixel size. Text inside SVG scenes (`.t-lg`, `.t-sm`, `.lbl`) is the one exception.
- **Before going live:** search for `Draft` to find the notes that still need removing.

The site is plain HTML, CSS and JavaScript, so it needs no build step and runs on GitHub Pages.
