import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import {
  After,
  Before,
  setDefaultTimeout,
  Status
} from '@cucumber/cucumber';
import { chromium } from '@playwright/test';
import { env, globalTimeout } from '../config/env';
import type { TestWorld } from '../fixtures/world';

const screenshotDirectory = path.resolve('reports', 'screenshots');
const videoDirectory = path.resolve('reports', 'videos');

const toFileName = (scenarioName: string): string =>
  scenarioName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

setDefaultTimeout(globalTimeout);

Before(async function (this: TestWorld) {
  await mkdir(videoDirectory, { recursive: true });
  this.browser = await chromium.launch();
  this.context = await this.browser.newContext({
    baseURL: env.BASE_URL,
    recordVideo: {
      dir: videoDirectory
    }
  });
  this.page = await this.context.newPage();
  this.page.setDefaultTimeout(globalTimeout);
});

After(async function (this: TestWorld, { pickle, result }) {
  const failed = result?.status === Status.FAILED;
  const fileName = `${toFileName(pickle.name)}-${Date.now()}`;
  const video = this.page?.video();

  if (failed && this.page) {
    await mkdir(screenshotDirectory, { recursive: true });
    await this.page.screenshot({
      path: path.join(screenshotDirectory, `${fileName}.png`),
      fullPage: true
    });
  }

  await this.context?.close();
  this.videoPath = await video?.path();

  if (failed && this.videoPath) {
    await video?.saveAs(path.join(videoDirectory, `${fileName}.webm`));
    await rm(this.videoPath, { force: true });
  } else if (this.videoPath) {
    await rm(this.videoPath, { force: true });
  }

  await this.browser?.close();
});
