
import { randomUUID } from 'crypto';
import { type Page, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

/*
 * Test accounts are created through the application's REST API, not through the
 * registration form.
 *
 * Why: after a successful registration the site itself opens the login page as a
 * new full page load, and after logging in it does the same for /account. On
 * GitHub Actions runners, Cloudflare answered those page loads with a
 * "Verify you are human" challenge (403, cf-mitigated: challenge), so every test
 * that registered through the form was blocked before it reached its own
 * assertions. The API calls themselves were never challenged.
 *
 * The registration form itself is still tested by register.spec.ts. The request
 * body below is the one the form sends, copied from a recorded trace.
 */
const API_URL = process.env.API_URL || 'https://api.practicesoftwaretesting.com';

/** Creates a new customer account through the API and returns its credentials. */
export async function registerAccountViaApi(page: Page) {
  // The random part keeps addresses unique when tests run in parallel: API
  // registration is fast enough for two workers to hit the same millisecond.
  const email = `laura${new Date().getTime()}${randomUUID().slice(0, 8)}@example.com`;
  const password = 'Daredevil7965$';

  const response = await page.request.post(`${API_URL}/users/register`, {
    data: {
      first_name: 'Laura',
      last_name: 'Test',
      dob: '2005-09-08',
      phone: '77071234567',
      email,
      password,
      address: {
        street: 'Test Street',
        city: 'Almaty',
        state: 'Almaty',
        country: 'KZ',
        postal_code: '160005',
      },
    },
  });

  // toBeOK() prints the response body if the call fails
  await expect(response).toBeOK();

  return { email, password };
}

/**
 * Creates an account through the API, then logs in through the login form.
 * Used by the login test, whose purpose is the login form itself.
 */
export async function createAndLoginAccount(page: Page) {
  const loginPage = new LoginPage(page);

  const { email, password } = await registerAccountViaApi(page);

  await loginPage.open();
  await loginPage.emailInput.fill(email);
  await loginPage.passwordInput.fill(password);
  await loginPage.loginButton.click();

  // Print the actual result if login fails
  await expect(page).not.toHaveURL(/auth\/login/, {
    timeout: 10000,
  });

  await expect(page).toHaveURL(/account/);

  return { email, password };
}

/**
 * Creates an account and signs it in, both through the API, for tests whose
 * subject is not login (e.g. purchasing). The token is stored where the site
 * keeps it (localStorage "auth-token") before the first page load, so the test
 * starts already signed in and the site never performs its post-login page load.
 */
export async function createAccountAndSignInViaApi(page: Page) {
  const { email, password } = await registerAccountViaApi(page);

  const response = await page.request.post(`${API_URL}/users/login`, {
    data: { email, password },
  });

  await expect(response).toBeOK();

  const { access_token } = await response.json();

  await page.addInitScript((token) => {
    window.localStorage.setItem('auth-token', token);
  }, access_token);

  return { email, password };
}
