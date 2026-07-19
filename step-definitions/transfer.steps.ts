import assert from 'node:assert/strict';
import { Given, Then, When } from '@cucumber/cucumber';
import transfer from '../fixtures/transfer.json';
import { AccountsPage } from '../pages/accounts.page';
import { TransferPage } from '../pages/transfer.page';
import type { TestWorld } from '../fixtures/world';

const getTransferPage = (world: TestWorld): TransferPage => {
  assert(world.page, 'Playwright page was not initialized');
  return new TransferPage(world.page);
};

const getAccountsPage = (world: TestWorld): AccountsPage => {
  assert(world.page, 'Playwright page was not initialized');
  return new AccountsPage(world.page);
};

const getTransferAccounts = (
  world: TestWorld
): { fromAccount: string; toAccount: string } => {
  assert(world.fromAccount, 'Transfer source account was not initialized');
  assert(world.toAccount, 'Transfer destination account was not initialized');

  return {
    fromAccount: world.fromAccount,
    toAccount: world.toAccount
  };
};

Given(
  'I have at least two accounts available for transfer',
  async function (this: TestWorld) {
    const accountsPage = getAccountsPage(this);
    await accountsPage.navigateToAccountsOverview();
    let accountNumbers = await accountsPage.getAccountList();

    if (accountNumbers.length < 2) {
      await accountsPage.openNewAccount('SAVINGS');
      await accountsPage.getNewAccountConfirmation();
      await accountsPage.navigateToAccountsOverview();
      accountNumbers = await accountsPage.getAccountList();
    }

    assert(
      accountNumbers.length >= 2,
      'Expected at least two accounts for a fund transfer'
    );
    [this.fromAccount, this.toAccount] = accountNumbers;
  }
);

When(
  'I transfer the valid amount between my accounts',
  async function (this: TestWorld) {
    const { fromAccount, toAccount } = getTransferAccounts(this);
    const transferPage = getTransferPage(this);
    await transferPage.navigateToTransfer();
    await transferPage.transferFunds(
      transfer.validTransfer.amount,
      fromAccount,
      toAccount
    );
  }
);

When(
  'I transfer an invalid amount between my accounts',
  async function (this: TestWorld) {
    const { fromAccount, toAccount } = getTransferAccounts(this);
    const transferPage = getTransferPage(this);
    await transferPage.navigateToTransfer();
    await transferPage.transferFunds(
      transfer.invalidTransfer.amount,
      fromAccount,
      toAccount
    );
  }
);

When(
  'I view the destination account activity',
  async function (this: TestWorld) {
    const { toAccount } = getTransferAccounts(this);
    const accountsPage = getAccountsPage(this);
    await accountsPage.navigateToAccountsOverview();
    await getTransferPage(this).navigateToActivityPage(toAccount);
  }
);

Then('I should see the transfer confirmation', async function (this: TestWorld) {
  assert.notEqual(
    await getTransferPage(this).getTransferConfirmation(),
    '',
    'Expected a fund transfer confirmation'
  );
});

Then('I should see transaction history', async function (this: TestWorld) {
  assert(
    (await getTransferPage(this).getTransactionHistory()).length > 0,
    'Expected at least one transaction in account activity'
  );
});

Then('I should see a transfer error', async function (this: TestWorld) {
  assert.notEqual(
    await getTransferPage(this).getTransferError(),
    '',
    'Expected an error for an excessive fund transfer'
  );
});
