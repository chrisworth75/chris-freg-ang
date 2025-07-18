import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30 * 1000,
  use: {
    baseURL: 'http://localhost:4200',
    headless: false,     // show the browser
    slowMo: 500,         // slow down actions by 500ms
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
});
