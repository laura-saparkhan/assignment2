
import { type Page, expect } from '@playwright/test';
import { RegisterPage } from '../../pages/RegisterPage';
import { LoginPage } from '../../pages/LoginPage';

export async function createAndLoginAccount(page: Page) {
  const loginPage = new LoginPage(page);

  const { email, password } = await registerAccount(page);

  // Registration already redirects to the login page (asserted at the end of
  // registerAccount), so log in right there instead of reloading it. Every
  // extra full-page load is one more request that Cloudflare can answer with
  // a bot challenge when the suite runs on a CI runner.
  await expect(loginPage.emailInput).toBeVisible();
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

export async function registerAccount(page: Page) {
  const registerPage = new RegisterPage(page);

  const email = `laura${new Date().getTime()}@example.com`;
  const password = 'Daredevil7965$';

  // Register a new account
  await registerPage.open();

  await registerPage.register(
    'Laura',
    'Test',
    '2005-09-08',
    email,
    password
  );

  await expect(page).toHaveURL(/\/auth\/login/);

  return { email, password };
}

