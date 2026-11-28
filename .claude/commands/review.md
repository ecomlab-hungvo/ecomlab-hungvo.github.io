---
description: Check the site (or one course) with Playwright at 390/1280px in VI and EN, fix display issues, report open items.
argument-hint: [course-id]
---

Review the site. Scope: `$ARGUMENTS` (a course id, or empty for the whole site).

Follow `CLAUDE.md`. Node: `export PATH="/c/Program Files/nodejs:$PATH"`.

1. **Build and run the checks** from the repo root:
   - Whole site: `npm run build` then `SCREENS=1 npx playwright test`.
   - A course that is still a draft: `npm run build:drafts` then `SCREENS=1 npx playwright test`.
   - Limit to changed pages with `PAGES="courses/<id>.html,courses/<id>/01-x.html"`.
   The checks cover: page loads, no console errors, no sideways scroll at 390px and 1280px, the VI/EN switch, no visible text from the other language, every EN text has a VI twin and none is empty, every internal link works, no confidential words on course/lesson pages, the standard lesson order, and TODOs listed as annotations.
2. **Look at the screenshots** in `test-results/screens/` for every changed page (390px and 1280px, EN and VI). Use the Read tool to view them. Check what the tests can't: cut-off text, overlaps, a visual that doesn't fit one screen, wrong highlight, the strong closing line.
3. **Translation check.** For changed lessons, read EN and VI side by side. Flag any place where they don't say the same thing. Do not rewrite; list it.
4. **Confidentiality check.** Read the changed content for internal numbers, names, tools, plans. Numbers must be public with a source, or marked illustrative / minh họa.
5. **Fix display and technical problems yourself:** layout, overflow, broken links, missing blank lines in MDX, schema errors, console errors. Re-run until the checks pass.
   **Do not change wording** without asking.
6. **Report** to Hùng:
   - Result of `npm run check` (passed / what failed).
   - The screenshots you looked at (send the important ones with SendUserFile, or list their paths).
   - What you fixed, file by file.
   - A **numbered checklist of open items** for Hùng: TODOs (from the test annotations and files), translation mismatches, confidentiality questions, wording questions, manual steps (e.g. Google Form topics).
7. Do not commit or push unless Hùng says so.
