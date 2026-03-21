/** @type {import('@playwright/test').PlaywrightTestConfig} */
module.exports = {
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  },
  testDir: './tests',
}
