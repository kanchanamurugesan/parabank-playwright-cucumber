import assert from 'node:assert/strict';
import { Then, When } from '@cucumber/cucumber';
import billPayment from '../fixtures/billpayment.json';
import {
  BillPaymentPage,
  type PayeeDetails
} from '../pages/billpayment.page';
import type { TestWorld } from '../fixtures/world';

const getBillPaymentPage = (world: TestWorld): BillPaymentPage => {
  assert(world.page, 'Playwright page was not initialized');
  return new BillPaymentPage(world.page);
};

const submitBillPayment = async (
  world: TestWorld,
  payee: PayeeDetails
): Promise<void> => {
  const billPaymentPage = getBillPaymentPage(world);
  await billPaymentPage.navigateToBillPayment();
  await billPaymentPage.fillPayeeDetails(payee);
  await billPaymentPage.submitPayment();
};

When(
  'I submit a bill payment with valid payee details',
  async function (this: TestWorld) {
    await submitBillPayment(this, billPayment.validPayee);
  }
);

When(
  'I submit a bill payment with incomplete payee details',
  async function (this: TestWorld) {
    await submitBillPayment(this, billPayment.incompletePayee);
  }
);

Then(
  'I should see the bill payment confirmation',
  async function (this: TestWorld) {
    assert.notEqual(
      await getBillPaymentPage(this).getConfirmationMessage(),
      '',
      'Expected a bill payment confirmation'
    );
  }
);

Then(
  'I should see bill payment validation errors',
  async function (this: TestWorld) {
    assert(
      (await getBillPaymentPage(this).getValidationErrors()).length > 0,
      'Expected validation errors for incomplete payee details'
    );
  }
);
