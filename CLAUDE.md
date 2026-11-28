# Ecom LAB website

Hùng Võ's personal-branding site on supply chain and cross-border ecommerce, live at https://ecomlab-hungvo.github.io (GitHub Pages, branch `main`). Plain HTML, CSS and JavaScript: no build step, no framework.

## Hard rules

- Keep the name **Ecom LAB**.
- Every page is bilingual (VI default, EN). The VI/EN toggle must work on every page.
- Keep Hùng's copy and voice. Change text only when asked. Plain words, short sentences.
- Never invent facts, numbers, testimonials or lesson titles. When something is missing, leave a clearly marked `[TODO: …]` and tell Hùng.
- No email capture and no sign-up. Keep the "free, no sign-up" message.
- Keep the current visual style. Structure changes are not redesigns.
- Keep the disclaimer in the footer.
- "See the course" appears at most once per page.
- Commit only when asked. Push (= publish) only when Hùng says so. Use the GitHub no-reply email that is already set in this repo.

## Site structure

| Page | What it is |
|---|---|
| `index.html` | Hero "What happens behind every order" + 3 cards (About, Courses, Resources). Nothing else. |
| `about.html` | Intro, portrait, LinkedIn, experience timeline, one result per work role, testimonials (from data), feedback button, contact. |
| `courses.html` | Course cards, rendered from `data/courses.json`. |
| `course.html` | EL-101 detail: lessons, all 12 parts, course materials, feedback block. |
| `lesson-1-1.html` … `lesson-3-3.html` | The 12 parts of EL-101. The last part of each lesson (1.3, 2.5, 3.3) ends with a feedback block. |
| `resources.html` | Notion resource cards from `data/resources.json`, with a topic filter. |

Header nav on every page: About · Courses · Resources · VI/EN. The header and footer are copied into every page, so change them in all pages. `main.js` marks the current section; course and lesson pages count as Courses.

### Scripts

- `assets/js/main.js`: language toggle (also swaps `<title>` and meta description), icons, reveal animations, lesson tools. Every page.
- `assets/js/data.js`: renders lists from `data/`. Loaded on about, courses and resources.
- `assets/js/agenda.js`: the list of lesson and part titles for the left agenda on part pages. Loaded before main.js on lesson pages.
- `assets/js/sim.js`: profit simulator in 3.2 and 3.3.

`data/*.json` files are loaded with `fetch()`, so preview through a local server (the `ecom-lab` preview, port 4173), not by opening the file directly.

## Bilingual text

- Every sentence appears twice: `<span data-l="en">…</span><span data-l="vi">…</span>` (or on block elements, `data-l` on the `<p>`/`<h2>`). Update both.
- Aria labels: English in `aria-label`, Vietnamese in `data-aria-vi`.
- Page title: Vietnamese in `<title>`, English in `data-title-en` on `<html>`.
- Meta description: Vietnamese in `<meta name="description">`, English in `data-desc-en` on `<html>`.
- Each page also has its own canonical URL and Open Graph tags under the description. Keep `og:title` and `og:description` equal to the Vietnamese title and description.

## Data files

All entries carry both languages.

### Add a course: `data/courses.json`

```json
{
  "code": "EL-102",
  "status": "open",
  "url": "course-el-102.html",
  "title_en": "", "title_vi": "",
  "summary_en": "", "summary_vi": "",
  "meta_en": "3 lessons · 12 parts · about 2 hours", "meta_vi": "3 bài · 12 phần · khoảng 2 giờ",
  "points": [ { "en": "", "vi": "" } ]
}
```

`status` other than `"open"` (or no `url`) shows the card as "Soon" without a link.

### Add a resource: `data/resources.json`

```json
{
  "title_vi": "", "title_en": "",
  "summary_vi": "", "summary_en": "",
  "topic": "Supply chain",
  "type": "Template",
  "url": "https://www.notion.so/…"
}
```

- `topic` must be one of `Supply chain`, `Ecommerce`, `Career`. That's what the filter uses.
- `type` must be one of `Template`, `Checklist`, `Article`.
- An empty list shows one line and a button to the Notion hub.

### Add a testimonial: `data/testimonials.json`

```json
{ "quote_vi": "", "quote_en": "", "name": "", "role": "" }
```

The "What learners say" section on About stays hidden until there are **3 or more** entries. Only add real quotes with the learner's permission.

## Lesson pages (EL-101)

- **Add a YouTube video:** find `data-youtube=""` in the part page and paste the link.
- **Part titles** live in `assets/js/agenda.js` and in the part list on `course.html`. Change both.
- **Publish a new part:** copy an existing part page, change `data-agenda`, `data-lesson` and `data-toggle-done` to the new id, fix prev/next links, and add `href` to the part in `agenda.js`.
- **Present mode** turns each `section.part-section` into one slide. Keep one idea per section.
- **Text sizes** come from the `--fs-*` tokens at the top of `style.css`. Use a token, not a raw pixel size (SVG scene text is the exception).

## Placeholders still to fill

Search the repo for `[TODO` and for these tokens before publishing:

- `[FEEDBACK_FORM_URL]`: feedback buttons on About, `course.html`, and lessons 1.3, 2.5, 3.3.
- `[NOTION_RESOURCES_URL]`: empty-state button on `resources.html`.
- `[TODO: result]`: one measurable result per work role on About.
- `[TODO: slides link]`, `[TODO: spreadsheet link]`: course materials on `course.html`.
- `TODO: replace with a 1200x630 share image`: `og:image` on every page.
- `Draft:` notes at the top of each lesson page.
