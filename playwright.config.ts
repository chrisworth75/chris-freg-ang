import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  outputDir: 'test-results',
  reporter: process.env.CI ? [
    ['junit', { outputFile: 'test-results/results.xml' }],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['line']
  ] : [
    ['html', { outputFolder: 'playwright-report' }],
    ['list']
  ],
  use: {
    baseURL: 'http://localhost:4200',
    headless: !!process.env.CI,
    screenshot: 'only-on-failure',
    video: {
      mode: process.env.CI ? 'retain-on-failure' : 'off',
      size: { width: 1280, height: 720 }
    },
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});
