import { setWorldConstructor, World } from '@cucumber/cucumber';
import type { Browser, BrowserContext, Page } from '@playwright/test';
import type { RegistrationUser } from '../pages/registration.page';

export class TestWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  videoPath?: string;
  fromAccount?: string;
  toAccount?: string;
  registrationUser?: RegistrationUser;
}

setWorldConstructor(TestWorld);
