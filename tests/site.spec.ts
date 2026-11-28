// Ecom LAB site checks: every built page, at phone and desktop width, in English and Vietnamese.
import { test, expect, type Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist');
function htmlFiles(dir: string, base = ''): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(d =>
    d.isDirectory() ? htmlFiles(path.join(dir, d.name), `${base}${d.name}/`)
      : d.name.endsWith('.html') ? [`${base}${d.name}`] : []);
}
const only = (process.env.PAGES ?? '').split(',').map(s => s.trim()).filter(Boolean);
const pages = htmlFiles(DIST).filter(p => !only.length || only.includes(p)).sort();
const isCoursePage = (p: string) => /^(course|lesson-)|^courses\//.test(p);
const words = fs.readFileSync('tests/confidential-words.txt', 'utf8').split('\n')
  .map(w => w.trim()).filter(w => w && !w.startsWith('#'));
const SCREENS = !!process.env.SCREENS;

async function open(page: Page, url: string, lang: 'en' | 'vi') {
  await page.addInitScript(l => { try { localStorage.setItem('ecomlab-lang', l); localStorage.setItem('ecomlab-theme', 'light'); } catch (e) {} }, lang);
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error' && !/youtube|googleapis|gstatic|docs\.google/.test(m.text())) errors.push(m.text()); });
  const res = await page.goto('/' + url);
  expect(res?.status(), `${url} should load`).toBeLessThan(400);
  await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach(e => e.classList.add('is-on')));
  await page.waitForTimeout(300);
  return errors;
}

for (const url of pages) {
  for (const width of [390, 1280]) {
    for (const lang of ['en', 'vi'] as const) {
      test(`${url} · ${width}px · ${lang}`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        const errors = await open(page, url, lang);

        // Language: the page is in the chosen language and no text of the other language shows
        expect(await page.evaluate(() => document.documentElement.lang)).toBe(lang);
        const other = lang === 'en' ? 'vi' : 'en';
        const leaks = await page.locator(`[data-l="${other}"]:visible`).count();
        expect(leaks, 'text from the other language is visible').toBe(0);

        // Layout: nothing wider than the screen
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow, 'page scrolls sideways').toBeLessThanOrEqual(0);

        // Every English text has a Vietnamese twin and the other way round
        const counts = await page.evaluate(() => ({
          en: document.querySelectorAll('[data-l="en"]').length, vi: document.querySelectorAll('[data-l="vi"]').length,
          emptyVi: [...document.querySelectorAll('[data-l="vi"]')].filter(e => !e.textContent!.trim()).length,
          emptyEn: [...document.querySelectorAll('[data-l="en"]')].filter(e => !e.textContent!.trim()).length
        }));
        expect(counts.en, 'EN and VI blocks should pair up').toBe(counts.vi);
        expect(counts.emptyVi + counts.emptyEn, 'empty translation').toBe(0);

        if (SCREENS) await page.screenshot({ path: `test-results/screens/${url.replace(/\//g, '__')}-${width}-${lang}.png`, fullPage: true });
        expect(errors, 'console errors').toEqual([]);
      });
    }
  }

  test(`${url} · switch and content rules`, async ({ page }) => {
    await open(page, url, 'en');
    // The VI/EN switch works
    await page.locator('[data-set-lang="vi"]').first().click();
    expect(await page.evaluate(() => document.documentElement.lang)).toBe('vi');
    await page.locator('[data-set-lang="en"]').first().click();
    expect(await page.evaluate(() => document.documentElement.lang)).toBe('en');

    const text = (await page.locator('main').textContent()) ?? '';
    // No confidential words on course and lesson pages
    if (isCoursePage(url)) {
      const hits = words.filter(w => text.toLowerCase().includes(w.toLowerCase()));
      expect(hits, 'confidential words found').toEqual([]);
    }
    // TODOs are allowed but listed in the report
    const todos = [...text.matchAll(/\[?TODO[^\]\n]{0,60}\]?/g)].map(m => m[0].trim());
    if (todos.length) test.info().annotations.push({ type: 'TODO', description: `${url}: ${todos.join(' | ')}` });

    // Lessons written in the standard structure keep the order from CLAUDE.md
    const order = await page.evaluate(() => [...document.querySelectorAll('.lx-objectives, .part-section:not(.lx-objectives):not(.lx-example):not(.lx-practice):not(.lx-takeaways) h2, .lx-example, .lx-practice, .lx-takeaways, .fb-box')]
      .map(e => e.classList.contains('lx-objectives') ? 'objectives' : e.classList.contains('lx-example') ? 'example'
        : e.classList.contains('lx-practice') ? 'practice' : e.classList.contains('lx-takeaways') ? 'takeaways'
        : e.classList.contains('fb-box') ? 'feedback' : 'part'));
    if (order.includes('objectives')) {
      const rank = { objectives: 0, part: 1, example: 2, practice: 3, takeaways: 4, feedback: 5 } as Record<string, number>;
      const ranks = order.map(o => rank[o]);
      expect(ranks, `lesson blocks out of order: ${order.join(' → ')}`).toEqual([...ranks].sort((a, b) => a - b));
      for (const must of ['objectives', 'practice', 'takeaways', 'feedback']) expect(order, `missing ${must}`).toContain(must);
    }
  });
}

test('every internal link works', async ({ request }) => {
  const seen = new Set<string>();
  for (const p of pages) {
    const html = fs.readFileSync(path.join(DIST, p), 'utf8');
    for (const m of html.matchAll(/href="([^"#?]+)(?:[?#][^"]*)?"/g)) {
      const href = m[1];
      if (/^(https?:|mailto:|\[|\/\/)/.test(href)) continue;
      const abs = href.startsWith('/') ? href : '/' + path.posix.join(path.posix.dirname(p), href);
      seen.add(abs.replace(/^\/\.\//, '/'));
    }
  }
  const broken: string[] = [];
  for (const u of seen) { const r = await request.get(u); if (r.status() >= 400) broken.push(`${u} → ${r.status()}`); }
  expect(broken).toEqual([]);
});
