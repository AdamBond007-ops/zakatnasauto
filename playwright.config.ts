import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

/**
 * See:
 * https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',

  /**
   * Disable parallel execution while debugging locally.
   * CI will also use one worker for stability.
   */
  fullyParallel: false,

  /**
   * Prevent accidental test.only usage in CI.
   */
  forbidOnly: isCI,

  /**
   * Retry failed tests twice in CI.
   */
  retries: isCI ? 2 : 0,

  /**
   * Run one test at a time so browser playback is easier to follow.
   */
  workers: 1,

  /**
   * Maximum duration for one test.
   */
  timeout: 600000,

  /**
   * Default timeout for assertions such as expect(locator).toBeVisible().
   */
  expect: {
    timeout: 15_000,
  },

  /**
   * Test reports.
   */
  reporter: [
    ['line'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'playwright-report/results.json' }],
  ],

  /**
   * Shared settings for all browser projects.
   */
  use: {
    /**
     * Allow Chromium Local Network Access so staging API hosts
     * behind VPN (e.g. stg-api.nas-internal.com) are not blocked
     * with net::ERR_ACCESS_DENIED.
     */
    permissions: ['local-network-access'],

    /**
     * Show the browser locally.
     * Keep the browser headless in CI.
     */
    headless: isCI,

    /**
     * Maximum wait time for actions such as click(), fill(), and check().
     */
    actionTimeout: 30_000,

    /**
     * Maximum wait time for page navigation.
     */
    navigationTimeout: 60_000,

    /**
     * Slow down each Playwright action by 500 milliseconds locally.
     */
    launchOptions: {
      slowMo: isCI ? 0 : 500,
    },

    /**
     * Keep the trace when a test fails locally.
     * On CI, collect it during the first retry.
     */
    trace: isCI ? 'on-first-retry' : 'retain-on-failure',

    /**
     * Save screenshots and videos for failed tests.
     */
    screenshot: 'on',

    /**
     * Optional base URL.
     */
    // baseURL: 'https://your-application-url.com',
  },

  /**
   * Browser projects.
   */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },

    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //   },
    // },

    // {
    //   name: 'webkit',
    //   use: {
    //     ...devices['Desktop Safari'],
    //   },
    // },

    // {
    //   name: 'Microsoft Edge',
    //   use: {
    //     ...devices['Desktop Edge'],
    //     channel: 'msedge',
    //   },
    // },

    // {
    //   name: 'Google Chrome',
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     channel: 'chrome',
    //   },
    // },
  ],

  /**
   * Optional local development server.
   */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !isCI,
  // },
});