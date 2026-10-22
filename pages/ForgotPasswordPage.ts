import { type Page, type Locator } from '@playwright/test';

export class ForgotPasswordPage {
  readonly page: Page;
  readonly signInLink: Locator;
  readonly forgotPasswordLink: Locator;
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  readonly confirmationMessage: Locator;
  readonly invalidEmailError: Locator;
  readonly requiredEmailError: Locator;

  constructor(page: Page) {
    this.page = page;

    this.signInLink = page.locator('[data-test="nav-sign-in"]');
    this.forgotPasswordLink = page.locator(
      '[data-test="forgot-password-link"]'
    );
    this.emailInput = page.locator('[data-test="email"]');
    this.submitButton = page.locator(
      '[data-test="forgot-password-submit"]'
    );

    this.confirmationMessage = page.getByText(
      'page.forgot-password.confirm'
    );
    this.invalidEmailError = page.getByText(
      'The selected email is invalid.'
    );
    this.requiredEmailError = page.getByText('Email is required');
  }

  async open() {
    await this.page.reload();
    await this.page.goto('/');
    await this.signInLink.click();
    await this.forgotPasswordLink.click();
  }

  async submitEmail(email: string) {
    await this.emailInput.fill(email);
    await this.submitButton.click();
  }
}
