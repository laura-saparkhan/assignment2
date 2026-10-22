
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

export const test = base.extend<Pages>({
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
