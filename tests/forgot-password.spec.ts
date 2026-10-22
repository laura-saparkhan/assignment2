
import { test, expect } from '../fixtures/pages.fixture';
import { createAndLoginAccount, registerAccount } from './helpers/create-test-account';

test('customer can request a password reset', async ({
  page,
  forgotPasswordPage,
}) => {
  const { email, password } = await registerAccount(page);
  await forgotPasswordPage.open();

  await forgotPasswordPage.submitEmail(email);

  await expect(
    forgotPasswordPage.confirmationMessage
  ).toBeVisible();
});

test('password reset requires an email', async ({
  forgotPasswordPage,
}) => {
  await forgotPasswordPage.open();

  await forgotPasswordPage.submitEmail('');

  await expect(
    forgotPasswordPage.requiredEmailError
  ).toBeVisible();
});

test('password reset rejects an unregistered email', async ({
  forgotPasswordPage,
}) => {
  await forgotPasswordPage.open();

  await forgotPasswordPage.submitEmail('non-valid@gmail.com');

  await expect(
    forgotPasswordPage.invalidEmailError
  ).toBeVisible();
});
