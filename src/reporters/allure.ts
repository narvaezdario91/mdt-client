import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';
import { IReporter } from './reporter.interface';

export class AllureReporter implements IReporter {
  public async generate(rawExecutions: any[], runId: string, reportsDir: string): Promise<string[]> {
    // Write the allure results to "allure-results" in the workspace root
    const allureResultsDir = path.resolve(process.cwd(), 'allure-results');
    await fs.mkdir(allureResultsDir, { recursive: true });

    // Also write them to reportsDir/allure-results for run isolation
    const runAllureResultsDir = path.join(reportsDir, 'allure-results');
    await fs.mkdir(runAllureResultsDir, { recursive: true });

    const generatedFiles: string[] = [];

    for (const exec of rawExecutions) {
      const uuid = crypto.randomUUID();
      const startTime = exec.createdAt ? new Date(exec.createdAt).getTime() : Date.now();
      const duration = exec.executionSummary?.executionTimeMs || 0;
      const stopTime = startTime + duration;

      const isSuccess = exec.executionSummary?.success ?? true;
      const status = isSuccess ? 'passed' : 'failed';

      const statusDetails = isSuccess
        ? {}
        : {
            message: exec.executionSummary?.errorSummary || 'Scenario execution failed',
            trace: exec.executionSummary?.errorSummary || ''
          };

      const steps: any[] = [];
      let currentStepTime = startTime;

      for (const step of exec.steps || []) {
        let stepStatus = 'passed';
        const subSteps: any[] = [];

        for (const inst of step.instructions || []) {
          const instSuccess = inst.execution?.status === 'success';
          const instStatus = instSuccess ? 'passed' : 'failed';
          
          if (!instSuccess) {
            stepStatus = 'failed';
          }

          // Estimate sub-step time
          const instDuration = 1000; // default 1s
          subSteps.push({
            name: inst.instruction,
            status: instStatus,
            stage: 'finished',
            steps: [],
            attachments: [],
            parameters: [],
            start: currentStepTime,
            stop: currentStepTime + instDuration
          });
          currentStepTime += instDuration;
        }

        steps.push({
          name: step.stepText,
          status: stepStatus,
          stage: 'finished',
          steps: subSteps,
          attachments: [],
          parameters: [],
          start: startTime,
          stop: currentStepTime
        });
      }

      const allureResult = {
        uuid,
        historyId: crypto.createHash('md5').update(`${exec.featureName}-${exec.scenarioName}`).digest('hex'),
        fullName: `${exec.featureName}: ${exec.scenarioName}`,
        labels: [
          { name: 'framework', value: 'mdt-orchestrator' },
          { name: 'language', value: 'typescript' },
          { name: 'feature', value: exec.featureName },
          { name: 'suite', value: exec.featureName }
        ],
        links: [],
        name: exec.scenarioName,
        status,
        statusDetails,
        stage: 'finished',
        steps,
        start: startTime,
        stop: stopTime
      };

      const resultFileName = `${uuid}-result.json`;
      
      // Save to root allure-results
      const rootPath = path.join(allureResultsDir, resultFileName);
      await fs.writeFile(rootPath, JSON.stringify(allureResult, null, 2), 'utf8');
      generatedFiles.push(rootPath);

      // Save to run-specific allure-results
      const runPath = path.join(runAllureResultsDir, resultFileName);
      await fs.writeFile(runPath, JSON.stringify(allureResult, null, 2), 'utf8');
      generatedFiles.push(runPath);
    }

    return generatedFiles;
  }
}
