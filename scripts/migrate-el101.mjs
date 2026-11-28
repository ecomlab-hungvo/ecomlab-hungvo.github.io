// One-time move of the 12 hand-built EL-101 part pages into content/courses/el-101/lessons/.
// Text is copied byte for byte: front matter gets the head data, a sibling .html file keeps the body.
// Run: node scripts/migrate-el101.mjs
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..');
const out = path.join(root, 'content/courses/el-101/lessons');
fs.mkdirSync(out, { recursive: true });

const agenda = fs.readFileSync(path.join(root, 'public/assets/js/agenda.js'), 'utf8');
const parts = [...agenda.matchAll(/\{ id: '([\d-]+)', num: '([\d.]+)', href: '([^']+)', en: '([^']*)', vi: '([^']*)' \}/g)]
  .map(m => ({ id: m[1], num: m[2], href: m[3], en: m[4], vi: m[5] }));

const one = (re, s) => { const m = s.match(re); if (!m) throw new Error('not found: ' + re); return m[1]; };
const yaml = v => JSON.stringify(v); // JSON strings are valid YAML

parts.forEach((p, i) => {
  const file = path.join(root, 'public', p.href);
  const html = fs.readFileSync(file, 'utf8');
  const nn = String(i + 1).padStart(2, '0');
  const slug = p.en.toLowerCase().replace(/^stage \d+: /, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const base = `${nn}-${slug}`;

  const titleEn = one(/<title>([^<]*)<\/title>/, html);
  const titleVi = one(/data-title-vi="([^"]*)"/, html);
  const descEn = one(/<meta name="description" content="([^"]*)">/, html);
  const descVi = one(/data-desc-vi="([^"]*)"/, html);
  const eyebrowEn = one(/<header class="part-head">\s*<p class="eyebrow"><span data-l="en">([^<]*)<\/span>/, html);
  const eyebrowVi = one(/<header class="part-head">\s*<p class="eyebrow"><span data-l="en">[^<]*<\/span><span data-l="vi">([^<]*)<\/span>/, html);
  const h1En = one(/<h1><span data-l="en">([\s\S]*?)<\/span><span data-l="vi">/, html);
  const h1Vi = one(/<h1><span data-l="en">[\s\S]*?<\/span><span data-l="vi">([\s\S]*?)<\/span><\/h1>/, html);
  const leadEn = one(/<p class="lead" data-l="en">([\s\S]*?)<\/p>/, html);
  const leadVi = one(/<p class="lead" data-l="vi">([\s\S]*?)<\/p>/, html);
  const youtube = one(/data-youtube="([^"]*)"/, html);
  const videoTitle = one(/data-video-title="([^"]*)"/, html);
  const draft = html.includes('class="draft-note"');
  const lessonNo = Number(p.num.split('.')[0]);
  const minutes = Number(one(/(\d+) min/, eyebrowEn));
  const scripts = [...html.matchAll(/<script src="assets\/js\/(\w+)\.js"><\/script>/g)].map(m => m[1])
    .filter(s => !['agenda', 'main', 'theme'].includes(s));

  // Body: everything after the video section, up to the lesson actions.
  const videoAt = html.indexOf('<div class="video');
  const start = html.indexOf('</section>', videoAt) + '</section>'.length;
  const end = html.indexOf('<div class="lesson-actions">');
  let body = html.slice(start, end);
  let feedback = 'none';
  const fb = body.match(/\n\s*<div class="fb-box">[\s\S]*?<\/div>\n/);
  if (fb) { body = body.replace(fb[0], '\n'); feedback = 'lesson-end'; }
  body = body.replace(/^\n+/, '').replace(/\s+$/, '') + '\n';

  const fm = [
    '---',
    `course: el-101`,
    `id: ${yaml(p.id)}`,
    `order: ${i + 1}`,
    `lesson: ${lessonNo}`,
    `part: ${yaml(p.num)}`,
    `path: ${yaml(p.href.replace(/\.html$/, ''))}`,
    `status: published`,
    `title_en: ${yaml(p.en)}`,
    `title_vi: ${yaml(p.vi)}`,
    `heading_en: ${yaml(h1En)}`,
    `heading_vi: ${yaml(h1Vi)}`,
    `eyebrow_en: ${yaml(eyebrowEn)}`,
    `eyebrow_vi: ${yaml(eyebrowVi)}`,
    `lead_en: ${yaml(leadEn)}`,
    `lead_vi: ${yaml(leadVi)}`,
    `minutes: ${minutes}`,
    `video: ${yaml(youtube)}`,
    `video_title: ${yaml(videoTitle)}`,
    `draft_note: ${draft}`,
    `feedback: ${feedback}`,
    `page_title_en: ${yaml(titleEn)}`,
    `page_title_vi: ${yaml(titleVi)}`,
    `page_desc_en: ${yaml(descEn)}`,
    `page_desc_vi: ${yaml(descVi)}`,
    scripts.length ? `scripts: ${yaml(scripts)}` : 'scripts: []',
    `legacy_html: ${yaml(base + '.html')}`,
    '---',
    '',
    '{/* EL-101 was hand-built before the content workflow. Its body lives in the .html file next to this one,',
    '    copied word for word. It does not follow the standard lesson structure in CLAUDE.md yet. */}',
    ''
  ].join('\n');

  fs.writeFileSync(path.join(out, base + '.mdx'), fm);
  fs.writeFileSync(path.join(out, base + '.html'), body);
  console.log(base, '|', p.id, '| feedback:', feedback, '| scripts:', scripts.join(',') || '-', '| body', body.length);
});
