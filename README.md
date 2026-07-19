# parabank-playwright-cucumber
![CI](https://github.com/kanchanamurugesan/parabank-playwright-cucumber/actions/workflows/test.yml/badge.svg)

BDD end-to-end automation of the [ParaBank](https://parabank.parasoft.com/) demo banking application, built with *Playwright + Cucumber (TypeScript)*. Demonstrates behaviour-driven test design: Gherkin feature files, step definitions bound to Page Objects, and hooks for browser lifecycle management.

## Stack

- Playwright (TypeScript) as the browser driver
- Cucumber.js — Gherkin feature files with step definitions
- Page Object Model
- Hooks for setup/teardown and failure screenshots
- GitHub Actions CI

## Project structure

```
├── .github/workflows/    # CI pipeline
├── config/               # Environment and runner configuration
├── features/             # Gherkin .feature files (business-readable scenarios)
├── step-definitions/     # Step implementations binding Gherkin to Page Objects
├── pages/                # Page Object classes
├── fixtures/             # Shared test context
├── hooks/                # Before/After hooks (browser lifecycle, screenshots)
└── cucumber.js           # Cucumber profiles
```


## Scenarios covered

Customer-facing ParaBank journeys written as Gherkin scenarios — registration, login, account overview, and funds transfer — with step definitions kept thin and page interactions encapsulated in Page Objects.

## Run tests

```bash
npm install
npx playwright install
npm test
```


## A note on CI and the demo site

ParaBank is a public demo application that is periodically reset, rate-limited, or unavailable to CI runner IPs. To keep the pipeline signal honest:

- *Every push:* CI compiles the TypeScript and runs Cucumber in dry-run mode, verifying every Gherkin step is bound to a step definition — this catches broken glue code and drift between features and steps.
- *On demand / weekly:* the full E2E suite runs against the live demo site as a separate, manually-triggerable job, with the HTML report uploaded as a build artifact. Failures here can reflect demo-site availability rather than suite defects, which is exactly the kind of environment-dependency distinction that matters in real-world test reporting.

## About

Built and maintained by Kanchana Murugesan — Senior Test Analyst (Brisbane).
