# ParaBank Automation

This project is an end-to-end test automation framework for the ParaBank demo application. It uses Playwright for browser control, Cucumber for business-readable scenarios, and TypeScript for a strict, maintainable implementation.

## Tech Stack

- Node.js
- TypeScript
- Playwright
- Cucumber-JS
- GitHub Actions

## Local Setup

Install dependencies and the Chromium browser:

```bash
npm ci
npx playwright install chromium
```

Create a `.env` file in the project root:

```dotenv
BASE_URL=https://parabank.parasoft.com/parabank
USERNAME=your-username
PASSWORD=your-password
GLOBAL_TIMEOUT=30000
```

Run the test suite:

```bash
npm test
```

Run the TypeScript check:

```bash
npm run typecheck
```

The HTML result is written to `reports/cucumber-report.html`. Failed scenarios retain screenshots under `reports/screenshots/` and videos under `reports/videos/`.

## Folder Structure

- `features/`: Gherkin feature files grouped by business capability.
- `step-definitions/`: Cucumber bindings and assertions.
- `pages/`: Playwright page objects containing locators and browser actions.
- `fixtures/`: Static test data and the custom Cucumber World.
- `hooks/`: Browser lifecycle and failure-evidence handling.
- `config/`: Environment and timeout configuration.
- `helpers/`: Shared framework utilities and custom reporting.
- `reports/`: Generated HTML reports, screenshots, and videos.

## CI/CD

The GitHub Actions workflow runs on pushes and pull requests to `main`. It installs Node.js 20 dependencies and Chromium, executes the Cucumber suite, fails when tests fail, and uploads the HTML report and failure screenshots as artifacts. Configure the repository variable `BASE_URL` and secrets `PARABANK_USERNAME` and `PARABANK_PASSWORD`.

## Design Decisions

Page Object Model keeps selectors and browser actions separate from scenario assertions, reducing duplication when the UI changes. Cucumber expresses workflows in language shared by technical and non-technical contributors. Static JSON fixtures keep reusable test data explicit and reviewable, while values that must remain secret or environment-specific stay in `.env` or CI secrets.
