import assert from 'node:assert/strict';
import { Given, Then, When } from '@cucumber/cucumber';
import { env } from '../config/env';
import auth from '../fixtures/auth.json';
import registration from '../fixtures/registration.json';
import { AccountsPage } from '../pages/accounts.page';
import { LoginPage } from '../pages/login.page';
import {
  RegistrationPage,
  type RegistrationUser
} from '../pages/registration.page';
import type { TestWorld } from '../fixtures/world';

const getLoginPage = (world: TestWorld): LoginPage => {
  assert(world.page, 'Playwright page was not initialized');
  return new LoginPage(world.page);
};

const createUniqueUser = (): RegistrationUser => ({
  ...registration.newUser,
  username: `cx${Date.now().toString().slice(-8)}`
});

Given('I am on the ParaBank login page', async function (this: TestWorld) {
  await getLoginPage(this).navigate();
});

When('I log in with valid credentials', async function (this: TestWorld) {
  const loginPage = getLoginPage(this);
  await loginPage.login(env.USERNAME, env.PASSWORD);

  if (await loginPage.hasLoginError()) {
    const user = createUniqueUser();
    const registrationPage = new RegistrationPage(this.page!);
    await registrationPage.navigateToRegistration();
    await registrationPage.fillRegistrationForm(user);
    await registrationPage.submitRegistration();
    await registrationPage.getWelcomeMessage();
    await new AccountsPage(this.page!).navigateToAccountsOverview();
    env.USERNAME = user.username;
    env.PASSWORD = user.password;
    this.registrationUser = user;
  }
});

When('I log in with invalid credentials', async function (this: TestWorld) {
  await getLoginPage(this).login(
    `${auth.invalidUser.username}_${Date.now()}`,
    `${auth.invalidUser.password}_${Date.now()}`
  );
});

When('I log in with empty credentials', async function (this: TestWorld) {
  await getLoginPage(this).login(
    auth.emptyUser.username,
    auth.emptyUser.password
  );
});

When('I log out', async function (this: TestWorld) {
  await getLoginPage(this).logout();
});

Then('I should see the account overview', async function (this: TestWorld) {
  assert.equal(
    await getLoginPage(this).isLoggedIn(),
    true,
    'Expected the account overview to be visible'
  );
});

Then('I should see a login error message', async function (this: TestWorld) {
  assert.notEqual(
    await getLoginPage(this).getErrorMessage(),
    '',
    'Expected a login error message'
  );
});

Then('I should see the login form', async function (this: TestWorld) {
  assert.equal(
    await getLoginPage(this).isLoggedOut(),
    true,
    'Expected the login form to be visible after logout'
  );
});
