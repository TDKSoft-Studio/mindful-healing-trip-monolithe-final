import { defineConfig, devices } from "@playwright/test";

const PORT = 3000;
const baseURL = `http://localhost:${PORT}`;

/**
 * Contract §34/§35: cover desktop + mobile viewports at minimum, and keep
 * critical pages regression-testable. Phase 1 only has a placeholder
 * homepage, so this stays a smoke test - real user journeys land in
 * Phase 4-6 as the pages they exercise get built.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "Desktop Chrome",
      use: {
        ...devices["Desktop Chrome"],
        // Optional escape hatch for environments with a pre-provisioned
        // Chromium build that doesn't match this package's expected
        // revision (e.g. some sandboxes) - unset in normal dev/CI, where
        // `playwright install` manages the browser binary as usual.
        launchOptions: process.env.PLAYWRIGHT_CHROMIUM_PATH
          ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
          : undefined,
      },
    },
    {
      name: "Mobile Chrome",
      use: {
        ...devices["Pixel 5"],
        launchOptions: process.env.PLAYWRIGHT_CHROMIUM_PATH
          ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
          : undefined,
      },
    },
  ],
  webServer: {
    // Runs the same standalone server the Dockerfile ships (contract §32:
    // local and CI should exercise the same artifact, not diverge). Assumes
    // `pnpm build` already ran - both `task test:e2e` and ci.yml do that as
    // a separate, explicit step rather than hiding it in here.
    command: "pnpm start",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
