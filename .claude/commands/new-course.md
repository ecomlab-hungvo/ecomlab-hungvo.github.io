---
description: Start a new course from source slides/docs. Sanitize, then draft the outline. Stops for approval.
argument-hint: <course-id> <source files or folder>
---

Start a new Ecom LAB course. Arguments: $ARGUMENTS
(first word = course id like `el-102`; the rest = source files or a folder. Sources live outside the public repo, in `../../04-ecom-lab-course/sources/<course-id>/`.)

Follow `CLAUDE.md`, above all the hard rules, the confidentiality rules and the voice rules.

1. **Read every source file** (slides, PDFs, docs, spreadsheets). If a file cannot be read, say so and stop.
   Never copy a source file into this repo.
2. **Confidentiality filter.** Go through the material and build a *Sanitization report* table:
   | # | Where (file, slide/page) | What it was (described, not quoted if sensitive) | What I did (removed / replaced with illustrative number / generalized) | Needs Hùng's decision? |
   Check for: internal numbers (revenue, margin, volume, cost, prices paid), client / partner / supplier names, internal tool and system names, employee names, unreleased plans, code names, screenshots of internal systems. Real numbers that stay must be replaced by illustrative ones marked "illustrative / minh họa". When unsure, mark it "needs decision". Add any new sensitive word to `tests/confidential-words.txt`.
3. **Draft the outline.** Copy `content/courses/_template/` to `content/courses/<course-id>/` and fill:
   - `outline.md`: lessons, parts, one-line goal per part, estimated minutes per part and in total, the sanitization report, and an "Open TODOs" list.
   - `course.json`: `status: "draft"`, ids, titles and summaries in both languages, taken from the source wording where possible. Anything missing = `TODO: …`.
   - Do **not** write lesson files yet, and do not touch site code.
   - Titles come from the source. Never invent titles, numbers or examples.
4. Run `npm run build:drafts` to make sure `course.json` passes the schema (Node: `export PATH="/c/Program Files/nodejs:$PATH"`).
5. **STOP.** Reply with: the outline table, the sanitization report, the numbered list of decisions Hùng must make, and the open TODOs. Ask him to approve the outline and the report. Do not continue until he does.
