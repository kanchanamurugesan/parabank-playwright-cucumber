import type { Locator, Page } from '@playwright/test';
import { env } from '../config/env';

export class LoginPage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly accountOverviewHeading: Locator;
  private readonly logoutLink: Locator;

  constructor(private readonly page: Page) {
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('input[value="Log In"]');
    this.errorMessage = page.locator('.error, p.error').first();
    this.accountOverviewHeading = page.getByRole('heading', {
      name: 'Accounts Overview'
    });
    this.logoutLink = page.locator('a[href*="logout"]');
  }

  async navigate(): Promise<void> {
    await this.page.goto(`${env.BASE_URL.replace(/\/$/, '')}/index.htm`);
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.accountOverviewHeading
      .or(this.errorMessage)
      .first()
      .waitFor({ state: 'visible' });
  }

  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible' });
    return (await this.errorMessage.textContent())?.trim() ?? '';
  }

  async hasLoginError(): Promise<boolean> {
    return this.errorMessage.isVisible();
  }

  async isLoggedIn(): Promise<boolean> {
    await this.accountOverviewHeading.waitFor({ state: 'visible' });
    return true;
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
  }

  async isLoggedOut(): Promise<boolean> {
    await this.usernameInput.waitFor({ state: 'visible' });

    return (
      (await this.usernameInput.isVisible()) &&
      (await this.passwordInput.isVisible()) &&
      (await this.loginButton.isVisible())
    );
  }
}
