
import { type Page, expect } from '@playwright/test';
import { RegisterPage } from '../../pages/RegisterPage';
import { LoginPage } from '../../pages/LoginPage';

export async function createAndLoginAccount(page: Page) {
  const registerPage = new RegisterPage(page);
  const loginPage = new LoginPage(page);

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

  // Log in with the same credentials
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
