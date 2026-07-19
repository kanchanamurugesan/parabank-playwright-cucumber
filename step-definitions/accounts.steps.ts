import assert from 'node:assert/strict';
import { Then, When } from '@cucumber/cucumber';
import accounts from '../fixtures/accounts.json';
import {
  AccountsPage,
  type AccountType
} from '../pages/accounts.page';
import type { TestWorld } from '../fixtures/world';

const getAccountsPage = (world: TestWorld): AccountsPage => {
  assert(world.page, 'Playwright page was not initialized');
  return new AccountsPage(world.page);
};

const isAccountType = (value: string): value is AccountType =>
  accounts.accountTypes.includes(value);

When(
  'I navigate to the accounts overview',
  async function (this: TestWorld) {
    await getAccountsPage(this).navigateToAccountsOverview();
  }
);

When(
  'I open a new {string} account',
  async function (this: TestWorld, accountType: string) {
    assert(
      isAccountType(accountType),
      `Unsupported account type: ${accountType}`
    );
    await getAccountsPage(this).openNewAccount(accountType);
  }
);

Then('I should see my account numbers', async function (this: TestWorld) {
  assert(
    (await getAccountsPage(this).getAccountList()).length > 0,
    'Expected at least one account number in the accounts overview'
  );
});

Then(
  'I should see the new account confirmation',
  async function (this: TestWorld) {
    assert.notEqual(
      await getAccountsPage(this).getNewAccountConfirmation(),
      '',
      'Expected a confirmation after opening a new account'
    );
  }
);
