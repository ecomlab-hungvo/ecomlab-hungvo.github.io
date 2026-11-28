---
description: Publish an approved course through the shared template, then run /review.
argument-hint: <course-id>
---

Build course `$ARGUMENTS` on the site.

Follow `CLAUDE.md`.

1. **Gate:** only continue if the lessons are approved, meaning Hùng confirmed it in this conversation, or `outline.md` records the approval. If not, stop and ask.
2. Set `status: "published"` in `content/courses/$ARGUMENTS/course.json` and in every lesson file Hùng approved. Set `draft_note: false` only for lessons he marked final.
3. Fill `course.json` page fields that are still empty (card, hero, receipt, lessons groups, materials) from the approved outline only. Missing = `TODO`.
4. The course must render through the existing templates (`src/components/CoursePage.astro`, `src/pages/[...page].astro`). **No new page code and no new components** unless Hùng approved them. If something cannot be shown with the allowed components, stop and ask.
5. If the Google Form needs new topics for this course, add it to the open items for Hùng (he edits the form).
6. Run `/review $ARGUMENTS` (follow `.claude/commands/review.md`).
7. Do not commit or push unless Hùng says so.
