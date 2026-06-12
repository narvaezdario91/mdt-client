import * as path from 'path';
import { IReporter } from './reporter.interface';
import { CucumberReporter } from './cucumber';

export class HtmlReporter implements IReporter {
  public async generate(rawExecutions: any[], runId: string, reportsDir: string): Promise<string[]> {
    // 1. Generate cucumber json report using CucumberReporter
    const cucumberReporter = new CucumberReporter();
    const jsonPaths = await cucumberReporter.generate(rawExecutions, runId, reportsDir);
    const jsonPath = jsonPaths[0];

    // 2. Generate HTML report from that json
    const htmlPath = path.join(reportsDir, 'cucumber-report.html');

    // Dynamically require cucumber-html-reporter to avoid strict TS type checks
    const reporter = require('cucumber-html-reporter');

    const options = {
      theme: 'bootstrap',
      jsonFile: jsonPath,
      output: htmlPath,
      reportSuiteAsScenarios: true,
      scenarioTimestamp: true,
      launchReport: false,
      name: `BDD Execution Report - ${runId}`,
      metadata: {
        "Execution ID": runId,
        "Generated At": new Date().toISOString()
      }
    };

    reporter.generate(options);

    return [jsonPath, htmlPath];
  }
}
