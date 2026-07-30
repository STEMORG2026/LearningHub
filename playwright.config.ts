import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  webServer: {
    command: 'pnpm dev:legacy',
    url: 'http://localhost:8085',
    reuseExistingServer: true,
  },
  use: {
    baseURL: 'http://localhost:8085',
  },
});
