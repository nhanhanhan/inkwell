// @ts-check
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: [
    {
      command: "npm run dev",
      cwd: "./server",
      port: 4000,
      reuseExistingServer: !process.env.CI,
      // E2E tests register several users per run; keep the auth rate limiter
      // (default 5 per 10 min) from blocking them.
      env: { AUTH_RATE_LIMIT_MAX: "1000" },
    },
    {
      command: "npm run dev",
      cwd: "./client",
      url: "http://localhost:5173",
      reuseExistingServer: !process.env.CI,
    },
  ],
});
