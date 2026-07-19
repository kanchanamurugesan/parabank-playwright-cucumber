const { Formatter, Status } = require('@cucumber/cucumber');

module.exports = class CustomSummaryFormatter extends Formatter {
  constructor(options) {
    super(options);

    options.eventBroadcaster.on('envelope', (envelope) => {
      if (!envelope.testRunFinished) {
        return;
      }

      const counts = {
        passed: 0,
        failed: 0,
        skipped: 0
      };

      for (const attempt of options.eventDataCollector.getTestCaseAttempts()) {
        if (attempt.willBeRetried) {
          continue;
        }

        switch (attempt.worstTestStepResult.status) {
          case Status.PASSED:
            counts.passed += 1;
            break;
          case Status.FAILED:
            counts.failed += 1;
            break;
          default:
            counts.skipped += 1;
        }
      }

      this.log(
        `\nCustom summary: ${counts.passed} passed, ` +
          `${counts.failed} failed, ${counts.skipped} skipped\n`
      );
    });
  }
};
