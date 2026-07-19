import type { Locator, Page } from '@playwright/test';

export interface PayeeDetails {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  account: string;
  amount: string;
}

export class BillPaymentPage {
  private readonly billPayLink: Locator;
  private readonly payeeNameInput: Locator;
  private readonly addressInput: Locator;
  private readonly cityInput: Locator;
  private readonly stateInput: Locator;
  private readonly zipCodeInput: Locator;
  private readonly phoneInput: Locator;
  private readonly accountNumberInput: Locator;
  private readonly verifyAccountInput: Locator;
  private readonly amountInput: Locator;
  private readonly sendPaymentButton: Locator;
  private readonly confirmationMessage: Locator;
  private readonly validationErrors: Locator;

  constructor(private readonly page: Page) {
    this.billPayLink = page.locator('a[href*="billpay"]');
    this.payeeNameInput = page.locator('input[name="payee.name"]');
    this.addressInput = page.locator(
      'input[name="payee.address.street"]'
    );
    this.cityInput = page.locator('input[name="payee.address.city"]');
    this.stateInput = page.locator('input[name="payee.address.state"]');
    this.zipCodeInput = page.locator(
      'input[name="payee.address.zipCode"]'
    );
    this.phoneInput = page.locator('input[name="payee.phoneNumber"]');
    this.accountNumberInput = page.locator(
      'input[name="payee.accountNumber"]'
    );
    this.verifyAccountInput = page.locator(
      'input[name="verifyAccount"]'
    );
    this.amountInput = page.locator('input[name="amount"]');
    this.sendPaymentButton = page.locator(
      'input[value="Send Payment"]'
    );
    this.confirmationMessage = page.locator('#billpayResult h1');
    this.validationErrors = page.locator('span.error:visible');
  }

  async navigateToBillPayment(): Promise<void> {
    await this.billPayLink.click();
    await this.page.waitForFunction(
      () =>
        document.querySelectorAll<HTMLSelectElement>(
          'select[name="fromAccountId"] option'
        ).length > 0
    );
  }

  async fillPayeeDetails(payee: PayeeDetails): Promise<void> {
    await this.payeeNameInput.fill(payee.name);
    await this.addressInput.fill(payee.address);
    await this.cityInput.fill(payee.city);
    await this.stateInput.fill(payee.state);
    await this.zipCodeInput.fill(payee.zip);
    await this.phoneInput.fill(payee.phone);
    await this.accountNumberInput.fill(payee.account);
    await this.verifyAccountInput.fill(payee.account);
    await this.amountInput.fill(payee.amount);
  }

  async submitPayment(): Promise<void> {
    await this.sendPaymentButton.click();
  }

  async getConfirmationMessage(): Promise<string> {
    await this.confirmationMessage.waitFor({ state: 'visible' });
    return (await this.confirmationMessage.textContent())?.trim() ?? '';
  }

  async getValidationErrors(): Promise<string[]> {
    await this.validationErrors.first().waitFor({ state: 'visible' });

    return (await this.validationErrors.allTextContents())
      .map((message) => message.trim())
      .filter(Boolean);
  }
}
