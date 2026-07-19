import type { Locator, Page } from '@playwright/test';

export interface RegistrationUser {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  ssn: string;
  username: string;
  password: string;
}

export class RegistrationPage {
  private readonly registerLink: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly addressInput: Locator;
  private readonly cityInput: Locator;
  private readonly stateInput: Locator;
  private readonly zipInput: Locator;
  private readonly phoneInput: Locator;
  private readonly ssnInput: Locator;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly confirmPasswordInput: Locator;
  private readonly registerButton: Locator;
  private readonly welcomeMessage: Locator;
  private readonly duplicateUsernameError: Locator;

  constructor(private readonly page: Page) {
    this.registerLink = page.locator('a[href*="register"]');
    this.firstNameInput = page.locator('input[name="customer.firstName"]');
    this.lastNameInput = page.locator('input[name="customer.lastName"]');
    this.addressInput = page.locator(
      'input[name="customer.address.street"]'
    );
    this.cityInput = page.locator('input[name="customer.address.city"]');
    this.stateInput = page.locator('input[name="customer.address.state"]');
    this.zipInput = page.locator('input[name="customer.address.zipCode"]');
    this.phoneInput = page.locator('input[name="customer.phoneNumber"]');
    this.ssnInput = page.locator('input[name="customer.ssn"]');
    this.usernameInput = page.locator('input[name="customer.username"]');
    this.passwordInput = page.locator('input[name="customer.password"]');
    this.confirmPasswordInput = page.locator(
      'input[name="repeatedPassword"]'
    );
    this.registerButton = page.locator('input[value="Register"]');
    this.welcomeMessage = page.getByText(
      'Your account was created successfully. You are now logged in.',
      { exact: true }
    );
    this.duplicateUsernameError = page
      .locator('span.error:visible')
      .filter({ hasText: 'username already exists' });
  }

  async navigateToRegistration(): Promise<void> {
    await this.registerLink.click();
    await this.confirmPasswordInput.waitFor({ state: 'visible' });
    await this.page.waitForLoadState('networkidle');
  }

  async fillRegistrationForm(user: RegistrationUser): Promise<void> {
    const fields: Array<[Locator, string]> = [
      [this.firstNameInput, user.firstName],
      [this.lastNameInput, user.lastName],
      [this.addressInput, user.address],
      [this.cityInput, user.city],
      [this.stateInput, user.state],
      [this.zipInput, user.zip],
      [this.phoneInput, user.phone],
      [this.ssnInput, user.ssn],
      [this.usernameInput, user.username],
      [this.passwordInput, user.password],
      [this.confirmPasswordInput, user.password]
    ];

    for (const [field, value] of fields) {
      await field.fill(value);
    }

    for (const [field, value] of fields) {
      if ((await field.inputValue()) !== value) {
        await field.fill(value);
      }
    }
  }

  async submitRegistration(): Promise<void> {
    await this.registerButton.click();
  }

  async getWelcomeMessage(): Promise<string> {
    await this.welcomeMessage.waitFor({ state: 'visible' });
    return (await this.welcomeMessage.textContent())?.trim() ?? '';
  }

  async getDuplicateUsernameError(): Promise<string> {
    await this.duplicateUsernameError.first().waitFor({ state: 'visible' });
    return (
      (await this.duplicateUsernameError.first().textContent())?.trim() ?? ''
    );
  }
}
