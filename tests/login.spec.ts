
import { test, expect } from '../fixtures/pages.fixture';
import { createAndLoginAccount } from './helpers/create-test-account';

test('A customer can register and log in successfully', async ({ page }) => {
  await createAndLoginAccount(page);

  await expect(page).toHaveURL(/\/account/);
});

test('login fails with invalid credentials', async ({ page, loginPage }) => {
  await loginPage.open();

  await loginPage.login(
    'testing@kbtu.edu.kz',
    '12345678'
  );

  await expect(loginPage.invalidCredentialsError).toBeVisible();
  await expect(page).not.toHaveURL(/\/account/);
});

test('should show errors when email and password are empty', async ({ loginPage }) => {
  await loginPage.open();

  await loginPage.login('', '');

  await expect(loginPage.emailError).toBeVisible();
  await expect(loginPage.passwordError).toBeVisible();
});
