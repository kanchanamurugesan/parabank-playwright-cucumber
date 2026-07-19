import type { Locator, Page } from '@playwright/test';

export type AccountType = 'CHECKING' | 'SAVINGS';

export class AccountsPage {
  private readonly accountsOverviewLink: Locator;
  private readonly accountRows: Locator;
  private readonly openNewAccountLink: Locator;
  private readonly accountTypeDropdown: Locator;
  private readonly openAccountButton: Locator;
  private readonly newAccountConfirmation: Locator;

  constructor(private readonly page: Page) {
    this.accountsOverviewLink = page.locator('a[href*="overview"]');
    this.accountRows = page.locator('table#accountTable tbody tr');
    this.openNewAccountLink = page.locator('a[href*="openaccount"]');
    this.accountTypeDropdown = page.locator('select#type');
    this.openAccountButton = page.getByRole('button', {
      name: 'Open New Account'
    });
    this.newAccountConfirmation = page
      .locator('#openAccountResult h1, #openAccountResult p')
      .first();
  }

  async navigateToAccountsOverview(): Promise<void> {
    await this.accountsOverviewLink.click();
  }

  async getAccountList(): Promise<string[]> {
    await this.accountRows.first().waitFor({ state: 'visible' });

    const accountNumbers: string[] = [];
    const rowCount = await this.accountRows.count();

    for (let index = 0; index < rowCount; index += 1) {
      const accountLink = this.accountRows.nth(index).locator('td').first().locator('a');

      if (await accountLink.isVisible()) {
        const accountNumber = (await accountLink.textContent())?.trim();

        if (accountNumber) {
          accountNumbers.push(accountNumber);
        }
      }
    }

    return accountNumbers;
  }

  async openNewAccount(accountType: AccountType): Promise<void> {
    await this.openNewAccountLink.click();
    await this.accountTypeDropdown.waitFor({ state: 'visible' });
    await this.page.waitForFunction(
      () =>
        document.querySelectorAll<HTMLSelectElement>(
          'select#fromAccountId option'
        ).length > 0
    );
    await this.accountTypeDropdown.selectOption(accountType);
    await this.openAccountButton.click();
  }

  async getNewAccountConfirmation(): Promise<string> {
    await this.newAccountConfirmation.waitFor({ state: 'visible' });
    return (await this.newAccountConfirmation.textContent())?.trim() ?? '';
  }
}
