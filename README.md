# Ecom LAB

Hùng Võ's personal site and free courses, in English and Vietnamese: https://ecomlab-hungvo.github.io

Built with [Astro](https://astro.build) as a static site. **Read `CLAUDE.md` first**: it holds the structure, the rules and the course workflow.

## Quick start

```
npm ci                  # once
npm run dev             # preview at http://localhost:4173 (draft courses included)
npm run check           # build + Playwright checks, the same as GitHub Actions
```

## Where things are

- `content/courses/<id>/`: one folder per course (`course.json`, `outline.md`, `lessons/*.mdx`). Copy `_template/` to start.
- `src/`: shared layout, templates and lesson components.
- `public/`: CSS, scripts, images and the data files for resources and testimonials.
- `tests/`: Playwright checks. `.github/workflows/site.yml`: build, check and deploy.
- `.claude/commands/`: `/new-course`, `/write-lessons`, `/build-course`, `/review`, `/apply-feedback`.

## Publishing

Push to `main`. GitHub Actions builds the site, runs every check, and deploys to GitHub Pages only if all checks pass.
Pull requests get the same checks, plus a downloadable preview build that includes draft courses.
