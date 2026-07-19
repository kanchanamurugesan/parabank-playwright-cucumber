module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    requireModule: ['ts-node/register'],
    require: [
      'fixtures/world.ts',
      'hooks/**/*.ts',
      'step-definitions/**/*.ts'
    ],
    retry: 1,
    format: [
      'progress',
      'html:reports/cucumber-report.html',
      './helpers/custom-summary-formatter.cjs'
    ]
  }
};
