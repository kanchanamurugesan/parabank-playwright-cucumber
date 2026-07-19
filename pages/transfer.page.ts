import type { Locator, Page } from '@playwright/test';

export class TransferPage {
  private readonly transferLink: Locator;
  private readonly amountInput: Locator;
  private readonly fromAccountDropdown: Locator;
  private readonly toAccountDropdown: Locator;
  private readonly transferButton: Locator;
  private readonly transferConfirmation: Locator;
  private readonly transferError: Locator;
  private readonly activityLinks: Locator;
  private readonly transactionRows: Locator;

  constructor(private readonly page: Page) {
    this.transferLink = page.locator('a[href*="transfer"]');
    this.amountInput = page.locator('input#amount');
    this.fromAccountDropdown = page.locator('select#fromAccountId');
    this.toAccountDropdown = page.locator('select#toAccountId');
    this.transferButton = page.locator('input[value="Transfer"]');
    this.transferConfirmation = page.locator('#showResult h1');
    this.transferError = page
      .locator(
        '#showError h1:visible, #showError p:visible, .error:visible, p.error:visible'
      )
      .first();
    this.activityLinks = page.locator('a[href*="activity"]');
    this.transactionRows = page.locator(
      'table#transactionTable tbody tr'
    );
  }

  async navigateToTransfer(): Promise<void> {
    await this.transferLink.click();
  }

  async transferFunds(
    amount: string,
    fromAccount: string,
    toAccount: string
  ): Promise<void> {
    await this.amountInput.fill(amount);
    await this.fromAccountDropdown.selectOption(fromAccount);
    await this.toAccountDropdown.selectOption(toAccount);
    await this.transferButton.click();
  }

  async getTransferConfirmation(): Promise<string> {
    await this.transferConfirmation.waitFor({ state: 'visible' });
    return (await this.transferConfirmation.textContent())?.trim() ?? '';
  }

  async getTransferError(): Promise<string> {
    await this.transferError.waitFor({ state: 'visible' });
    return (await this.transferError.textContent())?.trim() ?? '';
  }

  async navigateToActivityPage(accountNumber: string): Promise<void> {
    const accountActivityLink = this.activityLinks.filter({
      hasText: accountNumber
    });
    await accountActivityLink.click();
  }

  async getTransactionHistory(): Promise<string[]> {
    await this.transactionRows.first().waitFor({ state: 'visible' });

    const descriptions: string[] = [];
    const rowCount = await this.transactionRows.count();

    for (let index = 0; index < rowCount; index += 1) {
      const description = (
        await this.transactionRows.nth(index).locator('td').nth(1).textContent()
      )?.trim();

      if (description) {
        descriptions.push(description);
      }
    }

    return descriptions;
  }
}
