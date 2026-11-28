// Ecom LAB: static site. Pages keep their .html names (lesson-1-1.html), same as before Astro.
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://ecomlab-hungvo.github.io',
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'file' },
  compressHTML: false,
  integrations: [mdx()],
  devToolbar: { enabled: false }
});
