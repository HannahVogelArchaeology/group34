// Minimum browser and device matrix for the exhibition site.
// Each project below is one row of the matrix in TESTING.md.
const { defineConfig, devices } = require("@playwright/test");

// The site is served at /group34/ (see baseurl in _config.yml).
const baseURL = process.env.BASE_URL || "http://127.0.0.1:4173/group34/";

module.exports = defineConfig({
  testDir: "./e2e",
  timeout: 30000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure"
  },
  projects: [
    // Desktop browsers (latest stable versions on the CI runner).
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "desktop-firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "desktop-webkit", use: { ...devices["Desktop Safari"] } },

    // Phones and tablet (real device sizes, touch input).
    { name: "android-phone", use: { ...devices["Pixel 7"] } },
    { name: "iphone", use: { ...devices["iPhone 14"] } },
    { name: "ipad", use: { ...devices["iPad (gen 7)"] } },

    // The sidebar changes at 700px, so test both sides of that breakpoint.
    { name: "width-700-drawer", use: { ...devices["Desktop Chrome"], viewport: { width: 700, height: 900 } } },
    { name: "width-701-sidebar", use: { ...devices["Desktop Chrome"], viewport: { width: 701, height: 900 } } },
    { name: "width-320-small-phone", use: { ...devices["Desktop Chrome"], viewport: { width: 320, height: 640 }, hasTouch: true } }
  ]
});
