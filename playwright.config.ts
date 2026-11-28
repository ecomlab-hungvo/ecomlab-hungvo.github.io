// Site checks. Runs against the built site (dist/) served by `astro preview`.
// Local:  npm run check            (build + tests)
// Screens: SCREENS=1 npm test      (also saves screenshots to test-results/screens/)
// Some pages only: PAGES="lesson-1-1.html,course.html" npm test
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  timeout: 60_000,
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: 'http://localhost:4321', ...devices['Desktop Chrome'] },
  webServer: {
    command: 'npx astro preview --port 4321',
    url: 'http://localhost:4321/index.html',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000
  }
});
