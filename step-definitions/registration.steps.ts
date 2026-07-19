import assert from 'node:assert/strict';
import { Given, Then, When } from '@cucumber/cucumber';
import registration from '../fixtures/registration.json';
import { LoginPage } from '../pages/login.page';
import {
  RegistrationPage,
  type RegistrationUser
} from '../pages/registration.page';
import type { TestWorld } from '../fixtures/world';

const getRegistrationPage = (world: TestWorld): RegistrationPage => {
  assert(world.page, 'Playwright page was not initialized');
  return new RegistrationPage(world.page);
};

const submitRegistration = async (
  world: TestWorld,
  user: RegistrationUser
): Promise<void> => {
  const registrationPage = getRegistrationPage(world);
  await registrationPage.fillRegistrationForm(user);
  await registrationPage.submitRegistration();
};

Given(
  'I navigate to the registration page',
  async function (this: TestWorld) {
    await getRegistrationPage(this).navigateToRegistration();
  }
);

When(
  'I register with unique user details',
  async function (this: TestWorld) {
    const uniqueUser = {
      ...registration.newUser,
      username: `cx${Date.now().toString().slice(-8)}`
    };

    await submitRegistration(this, uniqueUser);
  }
);

When(
  'I register with an existing username',
  async function (this: TestWorld) {
    const user = {
      ...registration.duplicateUser,
      username: `cx${Date.now().toString().slice(-8)}`
    };

    await submitRegistration(this, user);
    await getRegistrationPage(this).getWelcomeMessage();
    await new LoginPage(this.page!).logout();
    await getRegistrationPage(this).navigateToRegistration();
    await submitRegistration(this, user);
  }
);

Then(
  'I should see the registration welcome message',
  async function (this: TestWorld) {
    assert.notEqual(
      await getRegistrationPage(this).getWelcomeMessage(),
      '',
      'Expected a welcome message after registration'
    );
  }
);

Then(
  'I should see a duplicate username error',
  async function (this: TestWorld) {
    assert.match(
      await getRegistrationPage(this).getDuplicateUsernameError(),
      /already exists/i,
      'Expected an error for an existing username'
    );
  }
);
