# Ecom LAB website: rules for every session

Hùng Võ's personal-branding site on supply chain and cross-border ecommerce, live at https://ecomlab-hungvo.github.io.
Built with **Astro** (static output). Content lives in plain files; pages come from shared templates.
The repo and the site are **public**: anything committed can be read by anyone.

## How to work on a course (the workflow)

Content is approved **before** any code. Use the slash commands in `.claude/commands/`, in this order:

1. `/new-course <source files>` → sanitization report + `outline.md`. **Stop for Hùng's approval.**
2. `/write-lessons <course-id>` → every lesson file, VI and EN. No site code. **Stop for Hùng's review.**
3. `/build-course <course-id>` → only after the lessons are approved. Publishes through the shared template, then runs `/review`.
4. `/review [course-id]` → screenshots and checks, fixes display problems, lists open items.
5. `/apply-feedback` → Hùng pastes all feedback in one numbered message; apply all, run `/review`, reply with a table.

Never skip a stop. Never change wording during `/review` without asking.

## Hard rules

- **Never invent** facts, numbers, examples, testimonials, quotes or titles. Missing info = `TODO: …` in the file, and list it in your summary.
- **Bilingual on every page.** Every piece of text exists in English and Vietnamese. The VI/EN switch must work. English is the default.
- **No email capture, no sign-up.** Keep the "free, no sign-up" message.
- **Content approval comes before code** (workflow above).
- **Keep the visual style.** Do not create new components, colours or layouts, and do not change the look, without asking first.
- Keep the name **Ecom LAB**. Keep the disclaimer in the footer. "See the course" appears at most once per page.
- Commit only when Hùng asks. Pushing to `main` publishes the site: push only when he says so.

## Confidentiality (the repo and the site are public)

Before any source text enters `content/`:

- **Remove or replace:** company internal numbers (revenue, margin, volume, cost, prices paid), client / partner / supplier names, internal tool and system names, employee and colleague names, unreleased plans, project code names, and screenshots of internal systems.
- **Replace real numbers** with clearly illustrative ones and mark them **"illustrative / minh họa"** next to the number.
- **Public company names** only when needed for context (e.g. past employers on the About page). In lessons, use generic wording ("a US ecommerce company", "a supplier in Asia").
- **When unsure, flag it and ask.** Do not guess.
- Source slides and documents stay **outside** the repo, in `../../04-ecom-lab-course/sources/<course-id>/`. Never copy them into this repo.
- `tests/confidential-words.txt` lists words that must never appear on course or lesson pages. Add new ones when you find them.

## Voice

- Plain words. Short sentences. Punchy. End each section and each lesson with a strong closing line.
- **Do not upgrade vocabulary.** Keep Hùng's wording from the source material wherever possible.
- English voice: a friendly first-person guide ("I", "you"). Vietnamese voice: "mình" and "bạn".
- One idea per section, so it fits one screen in present mode (he screen-records lessons for YouTube).
- Prefer a visual (tiles, steps, a table) over a paragraph. Longer explanation goes in `<Notes>`.
- Examples are easy and Amazon-relevant (made in Asia, sold to US shoppers).

## Site structure

| Page | Built from |
|---|---|
| Home `index.html` | `src/pages/index.astro`: hero + 3 cards (About, Courses, Resources) |
| About `about.html` | `src/pages/about.astro` + `public/data/testimonials.json` (shown only with 3 or more entries) |
| Courses `courses.html` | `src/pages/courses.astro`: one card per published course in `content/courses/*/course.json` |
| A course page | `src/components/CoursePage.astro`, from `course.json` + the lesson files |
| A lesson page | `src/pages/[...page].astro`, from one file in `content/courses/<id>/lessons/` |
| Resources `resources.html` | `src/pages/resources.astro` + `public/data/resources.json` (Notion links, topic filter) |
| Feedback `feedback.html` | `src/pages/feedback.astro` + `public/assets/js/feedback.js` (Google Form, topic preselected by `?about=`) |

Shared: `src/layouts/Base.astro` (head, header, footer, scripts). Styles: `public/assets/css/style.css`. Scripts: `public/assets/js/` (`main.js` language/icons/reveals, `theme.js` background/dark zones, `agenda.js` lesson agenda, `data.js` resources/testimonials, `sim.js` profit simulator, `feedback.js`).

### Course content files

```
content/courses/<course-id>/
├─ course.json            id, code, title_vi/en, summary_vi/en, level, duration, status (draft | published),
│                         card, hero, receipt, pack, stats, lessons[] (groups), materials[]
├─ outline.md             lessons and parts, one-line goal, minutes, sanitization report, open TODOs
└─ lessons/<nn>-<slug>.mdx   one page per part, VI and EN, standard structure below
```

- `status: draft` shows locally (`npm run dev`) and in review builds, **never** on the live site. `published` goes live on the next push.
- Copy `content/courses/_template/` to start a new course. The schema in `src/content.config.ts` fails the build if a field is missing.
- **Add a course = add files. Zero new page code.**
- Lesson URL: `courses/<course-id>/<nn>-<slug>.html`. Course URL: `courses/<course-id>.html`.
- **EL-101 is the exception:** built by hand before this workflow, moved here word for word on 2026-11-28. Its lessons keep their old URLs (`lesson-1-1.html` …) and their body is in a `.html` file next to each `.mdx` (`legacy_html`). They do not follow the standard structure yet. Do not rewrite them unless Hùng asks.
- The Google Form's topic list (Whole course, Lesson 1–3, Resources, Website) fits EL-101. A new course needs its topics added to the form by Hùng; until then its feedback links preselect nothing.

### Lesson front matter

`course`, `id` (unique site-wide), `order`, `lesson` (group number), `part` ("1.1"), `status`, `title_en/vi`, `lead_en/vi`, `minutes`, `video` (YouTube link, empty for now), `draft_note` (true until Hùng approves), `feedback` (`part` default, `lesson-end`, `none`), optional `scripts` (e.g. `["sim"]`).

## Standard lesson structure (in this order)

1. **Learning objectives**: `<Objectives>`
2. **Content parts**: one or more `<Section>`, one idea each
3. **Real-world example**: `<Example>`
4. **Practice task**: `<Practice>` with `<Steps>`, `<Step>`, `<Prompt>`, `<Reflect>`
5. **Key takeaways**: `<Takeaways>`, last line = strongest line
6. **Feedback link**: added by the template (`feedback` in front matter)

The checks in `tests/site.spec.ts` fail if a standard lesson has these blocks out of order or missing.

## Allowed UI components

Only these, in lesson `.mdx` files (`src/components/lesson/`). Anything else needs Hùng's OK first.

| Component | Use |
|---|---|
| `<En>` / `<Vi>` | Text in one language. Markdown inside: paragraphs, lists, **bold**, links, tables. Leave a blank line after the opening tag and before the closing tag. |
| `<Section eyebrow title_en title_vi mark_en mark_vi>` | One content part; `mark_*` = words with the hand-drawn highlighter |
| `<Objectives>` `<Example>` `<Practice>` `<Takeaways>` | The standard blocks |
| `<Steps>` `<Step title_* why_*>` `<Prompt en vi>` `<Reflect>` | Practice steps, copyable AI prompts, closing question |
| `<Tiles cols>` `<Tile icon title_* text_* num source source_href>` | 2–4 tiles; a number tile needs a `source` |
| `<Notes>` | Folded longer explanation |
| `<Callout title_en title_vi>` | One short highlighted remark |
| Markdown table | Inside `<En>`/`<Vi>` |

Icons: the names in `ICONS` in `public/assets/js/main.js` (box, chart, coin, ship, store, truck, user, warehouse, globe, …).
Page-level patterns already in the site (cards, receipt, timeline, filter, dark zones) are used by templates only.

## Theme

One cream paper background; sections with `data-flip` turn the page deep forest while on screen (home cards, About experience, course part list). Light/dark switch in the header (`ecomlab-theme`), off on lesson pages (`data-no-dark`) so recordings look the same. Colours come from tokens at the end of `style.css`; use `--surface`, `--text-primary`, `--border`, `--accent-text`, never raw colours.

## Commands

```
npm run dev            # local preview with drafts, http://localhost:4173
npm run build          # live build (published only) into dist/
npm run build:drafts   # review build including drafts
npm test               # Playwright checks on dist/ (SCREENS=1 saves screenshots, PAGES=a.html,b.html limits pages)
npm run check          # build + test, what CI runs
npm run check:drafts   # same, including draft courses
```

Node is at `C:\Program Files\nodejs`. In the Bash tool, run `export PATH="/c/Program Files/nodejs:$PATH"` first.
The Claude preview server `ecom-lab` (in the parent folder's `.claude/launch.json`) runs `astro dev`.
Publishing: push to `main` → GitHub Actions (`.github/workflows/site.yml`) builds, runs the checks, and deploys only if everything passes.

## Definition of done

A change is done when **all** of these hold:

1. `npm run check` passes (build + every Playwright check), and `npm run check:drafts` when a draft course changed.
2. Screenshots at 390px and 1280px, VI and EN, were looked at for every changed page.
3. Every TODO and every confidentiality question is listed in the summary to Hùng.
4. No wording was changed without Hùng's approval.
5. Nothing was pushed unless Hùng said so.
