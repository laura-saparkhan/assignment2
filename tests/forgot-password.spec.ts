
import { test, expect } from '../fixtures/pages.fixture';

test('customer can request a password reset', async ({
  forgotPasswordPage,
}) => {
  await forgotPasswordPage.open();

  await forgotPasswordPage.submitEmail('lauratesting3@gmail.com');

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
