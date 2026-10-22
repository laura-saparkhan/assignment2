
import { type Page, type Locator } from '@playwright/test';

export class RegisterPage {
  readonly page: Page;
  readonly signInLink: Locator;
  readonly registerLink: Locator;

  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly dateOfBirthInput: Locator;
  readonly countrySelect: Locator;
  readonly postalCodeInput: Locator;
  readonly houseNumberInput: Locator;
  readonly streetInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly phoneInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly registerButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.signInLink = page.locator('[data-test="nav-sign-in"]');
    this.registerLink = page.locator('[data-test="register-link"]');

    this.firstNameInput = page.locator('[data-test="first-name"]');
    this.lastNameInput = page.locator('[data-test="last-name"]');
    this.dateOfBirthInput = page.locator('[data-test="dob"]');
    this.countrySelect = page.locator('[data-test="country"]');
    this.postalCodeInput = page.locator('[data-test="postal_code"]');
    this.houseNumberInput = page.locator('[data-test="house_number"]');
    this.streetInput = page.locator('[data-test="street"]');
    this.cityInput = page.locator('[data-test="city"]');
    this.stateInput = page.locator('[data-test="state"]');
    this.phoneInput = page.locator('[data-test="phone"]');
    this.emailInput = page.locator('[data-test="email"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.registerButton = page.locator('[data-test="register-submit"]');
  }

  async open() {
    await this.page.goto('/');
    await this.signInLink.click();
    await this.registerLink.click();
  }

  async register(
    firstName: string,
    lastName: string,
    dateOfBirth: string,
    email: string,
    password: string
  ) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.dateOfBirthInput.fill(dateOfBirth);

    await this.countrySelect.selectOption('KZ');
    await this.postalCodeInput.fill('160005');
    await this.houseNumberInput.fill('6');
    await this.streetInput.fill('Test Street');
    await this.cityInput.fill('Almaty');
    await this.stateInput.fill('Almaty');
    await this.phoneInput.fill('77071234567');

    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);

    await this.registerButton.click();
  }
}
