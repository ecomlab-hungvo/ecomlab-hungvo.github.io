// One-time: wrap the <main> of the plain pages in the shared Base layout. Text is copied as is.
import fs from 'node:fs';
const one = (re, s) => s.match(re)[1];
for (const [name, extra] of [['index', []], ['about', ['data']], ['resources', ['data']], ['feedback', ['feedback']]]) {
  const html = fs.readFileSync(`public/${name}.html`, 'utf8');
  const main = html.slice(html.indexOf('<main'), html.indexOf('</main>') + 7);
  const p = {
    titleEn: one(/<title>([^<]*)<\/title>/, html), titleVi: one(/data-title-vi="([^"]*)"/, html),
    descEn: one(/<meta name="description" content="([^"]*)">/, html), descVi: one(/data-desc-vi="([^"]*)"/, html),
    path: name === 'index' ? '' : `${name}.html`
  };
  const astro = `---\nimport Base from '../layouts/Base.astro';\nconst page = ${JSON.stringify(p, null, 2)};\n---\n<Base {...page}${extra.length ? ` after={${JSON.stringify(extra)}}` : ''}>\n${main}\n</Base>\n`;
  fs.writeFileSync(`src/pages/${name}.astro`, astro);
  console.log(name, main.length);
}
