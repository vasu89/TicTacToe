const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3939',
  },
  webServer: {
    command: 'npx serve -l 3939 --no-clipboard',
    url: 'http://localhost:3939',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
});
