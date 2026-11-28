---
description: Write every lesson file (VI + EN) from the approved outline. No site code. Stops for review.
argument-hint: <course-id>
---

Write the lessons for course `$ARGUMENTS`.

Follow `CLAUDE.md`: hard rules, confidentiality, voice, standard lesson structure, allowed components.

1. Check that Hùng approved `content/courses/$ARGUMENTS/outline.md` and its sanitization report in this conversation or in an earlier note in `outline.md`. If not, stop and ask.
2. Re-read the source material in `../../04-ecom-lab-course/sources/$ARGUMENTS/` for each part, so wording comes from the source.
3. For every part in the outline, create `content/courses/$ARGUMENTS/lessons/<nn>-<slug>.mdx`, starting from `content/courses/_template/lessons/01-todo-part.mdx`:
   - Front matter filled (`status: draft`, `draft_note: true`, `feedback: part`, unique `id` such as `<course-id>-01`, `minutes` from the outline).
   - Body in the standard order: `<Objectives>` → one `<Section>` per idea → `<Example>` → `<Practice>` → `<Takeaways>`. The template adds the feedback link.
   - Every text in `<En>` **and** `<Vi>`, saying the same thing. Keep Hùng's wording; do not upgrade vocabulary. Short sentences, strong last line.
   - Only allowed components. If a part truly needs something new, write `TODO: needs component <what>` and list it; do not build it.
   - Numbers: public with a source (`<Tile num source source_href>`), or illustrative and marked "(illustrative)" / "(minh họa)". Missing info = `TODO: …`.
4. Update `outline.md`: mark each part "written", add new TODOs.
5. Do **not** touch anything under `src/`, `public/` or the workflow files.
6. Run `npm run check:drafts` (build including drafts + checks). Fix only file-format problems (e.g. a missing blank line in `<En>`).
7. **STOP.** Tell Hùng the content is ready for review: list the files, total minutes, every TODO, every place where you changed source wording and why, and how to preview (`npm run dev`, then `/courses/$ARGUMENTS.html`).
