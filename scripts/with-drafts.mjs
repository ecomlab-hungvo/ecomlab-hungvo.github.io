// Build the site including draft courses, for review before they go live. Never deploy this build.
import { execSync } from 'node:child_process';
execSync('npx astro build', { stdio: 'inherit', env: { ...process.env, SHOW_DRAFTS: '1' } });
