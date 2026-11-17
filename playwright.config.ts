import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration.
 *
 * All CI-specific behaviour is switched on by the single `CI` environment
 * variable, which GitHub Actions sets automatically. Without it the config
 * behaves exactly as it did for Assignment 1 on a local machine.
 *
 * See https://playwright.dev/docs/test-configuration.
 */
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',

  /* Shards split individual tests, not whole files. */
  fullyParallel: true,

  /* A forgotten test.only must fail the pipeline instead of silently
     running a single test and reporting green. */
  forbidOnly: isCI,

  /* The suite runs against a live public site, so an unstable test is
     retried and marked "flaky" rather than failing the whole run. */
  retries: isCI ? 2 : 0,

  /* One browser per shard on CI. The site sits behind Cloudflare, which scores
     bursts of traffic from a single IP; GitHub runners already come from
     datacenter ranges that it treats as higher risk, so two browsers sharing
     one runner IP make a challenge more likely. Sharding across 4 runners
     still provides the parallelism. */
  workers: isCI ? 1 : undefined,

  /* On CI: `list` for readable logs, `blob` so the shards can be merged
     into one report, `junit` as machine-readable XML.
     Locally: the familiar HTML report. */
  reporter: isCI
    ? [
        ['list'],
        ['blob'],
        ['junit', { outputFile: 'reports/junit.xml' }],
      ]
    : [['list'], ['html', { open: 'on-failure' }]],

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL for all tests, overridable from CI via the BASE_URL variable.
       Note `||` rather than `??`: when the repository variable is not set,
       GitHub Actions substitutes an empty string, which is not nullish, so
       `??` would leave baseURL empty and every relative goto('/') would fail
       with "Cannot navigate to invalid URL". */
    baseURL: process.env.BASE_URL || 'https://practicesoftwaretesting.com',

    /* Trace is recorded on the first retry, i.e. for exactly the attempt
       that failed, and is uploaded as a CI artefact. */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* The application under test is an external site, so no webServer is
     needed. If it ever moves into this repository:
     webServer: {
       command: 'npm run start',
       url: 'http://localhost:3000',
       reuseExistingServer: !isCI,
     },
  */
});
