
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly signInLink: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  readonly invalidCredentialsError: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;

  constructor(page: Page) {
    this.page = page;

    this.signInLink = page.locator('[data-test="nav-sign-in"]');
    this.emailInput = page.locator('[data-test="email"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-submit"]');

    this.invalidCredentialsError = page.getByText(
      'Invalid email or password'
    );
    this.emailError = page.locator('[data-test="email-error"]');
    this.passwordError = page.locator('[data-test="password-error"]');
  }

  async open() {
    await this.page.goto('/auth/login');
  }

  async login(email: string, password: string) {
    await this.signInLink.click();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
