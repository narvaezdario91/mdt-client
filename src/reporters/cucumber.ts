import * as fs from 'fs/promises';
import * as path from 'path';
import { IReporter } from './reporter.interface';

export class CucumberReporter implements IReporter {
  public async generate(rawExecutions: any[], runId: string, reportsDir: string): Promise<string[]> {
    const report: any[] = [];

    // Group executions by featureName
    const featuresMap = new Map<string, any[]>();
    for (const exec of rawExecutions) {
      if (!featuresMap.has(exec.featureName)) {
        featuresMap.set(exec.featureName, []);
      }
      featuresMap.get(exec.featureName)!.push(exec);
    }

    for (const [featureName, scenarios] of featuresMap.entries()) {
      const featureId = featureName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
      
      const featureElement = {
        uri: `${featureId}.feature`,
        id: featureId,
        name: featureName,
        keyword: "Feature",
        elements: scenarios.map((scenario: any) => {
          const scenarioId = scenario.scenarioName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
          
          let scenarioDurationMs = scenario.executionSummary?.executionTimeMs || 0;
          const isSuccess = scenario.executionSummary?.success ?? true;

          return {
            id: scenarioId,
            name: scenario.scenarioName,
            type: "scenario",
            keyword: "Scenario",
            steps: scenario.steps.map((step: any, index: number) => {
              // Assign the duration to the first step, and 0 to others
              const duration = index === 0 ? scenarioDurationMs * 1000000 : 0;
              const status = isSuccess ? "passed" : "failed";
              
              return {
                name: step.stepText,
                keyword: "* ",
                match: { location: "unknown" },
                result: {
                  status,
                  duration
                }
              };
            })
          };
        })
      };
      
      report.push(featureElement);
    }

    const reportPath = path.join(reportsDir, 'cucumber-report.json');
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2), 'utf8');
    return [reportPath];
  }
}
