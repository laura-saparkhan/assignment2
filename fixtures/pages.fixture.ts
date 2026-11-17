
import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { ComparePage } from '../pages/ComparePage';
import { PurchasePage } from '../pages/PurchasePage';

type Pages = {
  loginPage: LoginPage;
  registerPage: RegisterPage;
  forgotPasswordPage: ForgotPasswordPage;
  comparePage: ComparePage;
  purchasePage: PurchasePage;
};

type AutoFixtures = {
  ciPacing: void;
  cloudflareCheck: void;
};

/* Pause before each test on CI, and a longer one before a retry. */
const CI_PAUSE_MS = 3_000;
const CI_RETRY_PAUSE_MS = 15_000;

export const test = base.extend<Pages & AutoFixtures>({
  /* On CI only: wait before each test so a runner does not hit the site in
     rapid bursts, and wait longer before a retry, since an immediate retry
     arrives right after the request that was challenged. Cloudflare's
     decision to challenge can depend partly on bursts of traffic from one IP.
     The fixture has its own timeout, so the pause does not use up the
     test's 30 seconds. */
  ciPacing: [
    async ({}, use, testInfo) => {
      if (process.env.CI) {
        const pauseMs = testInfo.retry > 0 ? CI_RETRY_PAUSE_MS : CI_PAUSE_MS;
        await new Promise((resolve) => setTimeout(resolve, pauseMs));
      }
      await use();
    },
    { auto: true, timeout: 30_000 },
  ],

  /* Runs automatically around every test. If a test failed while the site was
     showing Cloudflare's bot-verification page, the failure is labelled in the
     report and the CI log, so it is not mistaken for an application bug. */
  cloudflareCheck: [
    async ({ page }, use, testInfo) => {
      await use();

      if (testInfo.status === testInfo.expectedStatus) {
        return;
      }

      const challenged = await page
        .getByText('Performing security verification')
        .isVisible()
        .catch(() => false);

      if (challenged) {
        const description =
          'practicesoftwaretesting.com served a Cloudflare bot-verification page instead of the application.';
        testInfo.annotations.push({ type: 'blocked-by-cloudflare', description });
        console.log(`[blocked-by-cloudflare] ${testInfo.title}: ${description}`);
      }
    },
    { auto: true },
  ],

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },

  forgotPasswordPage: async ({ page }, use) => {
    await use(new ForgotPasswordPage(page));
  },

  comparePage: async ({ page }, use) => {
    await use(new ComparePage(page));
  },

  purchasePage: async ({ page }, use) => {
    await use(new PurchasePage(page));
  },
});

export { expect };
