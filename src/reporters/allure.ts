import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';
import { IReporter } from './reporter.interface';

export class AllureReporter implements IReporter {
  private async writeToBoth(
    rootDir: string, runDir: string, fileName: string, 
    content: string, generatedFiles: string[]
  ): Promise<void> {
    const rootPath = path.join(rootDir, fileName);
    const runPath = path.join(runDir, fileName);
    await fs.writeFile(rootPath, content, 'utf8');
    await fs.writeFile(runPath, content, 'utf8');
    generatedFiles.push(rootPath, runPath);
  }

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
          // 1.2 Mapeo de estado (passed, failed, skipped)
          const instStatus = inst.execution?.status === 'success' ? 'passed' : (inst.execution?.status || 'failed');

          if (instStatus === 'failed') {
            stepStatus = 'failed';
          }

          // 1.3 Mapeo de duración
          const instDuration = inst.execution?.durationMs ?? 1000;

          const instAttachments: any[] = [];
          
          // 3.2 Inyectar error
          const instStatusDetails = (instStatus === 'failed' && inst.execution?.error)
            ? { message: inst.execution.error }
            : undefined;

          // 3.1 Adjuntar details
          if (inst.execution?.details) {
            const attachmentUuid = crypto.randomUUID();
            const attachmentFileName = `${attachmentUuid}-attachment.md`;
            
            await this.writeToBoth(allureResultsDir, runAllureResultsDir, attachmentFileName, inst.execution.details, generatedFiles);
            
            instAttachments.push({
              name: "Execution Details",
              source: attachmentFileName,
              type: "text/markdown"
            });
          }

          const instParams: any[] = [];
          
          // 2.1 Tool name
          if (inst.execution?.actionExecuted) {
            instParams.push({ name: "Tool", value: inst.execution.actionExecuted });
          }
          
          // 2.2 Telemetry
          if (inst.execution?.telemetry) {
            const t = inst.execution.telemetry;
            const telemetryParams = [
              { name: "Execution Path", value: t.executionPath },
              { name: "Retries", value: t.retries !== undefined ? String(t.retries) : undefined },
              { name: "LLM Input Tokens", value: t.llmTokens?.input !== undefined ? String(t.llmTokens.input) : undefined },
              { name: "LLM Output Tokens", value: t.llmTokens?.output !== undefined ? String(t.llmTokens.output) : undefined }
            ].filter((p): p is {name: string, value: string} => p.value !== undefined);
            
            instParams.push(...telemetryParams);
          }

          subSteps.push({
            name: inst.instruction,
            status: instStatus,
            statusDetails: instStatusDetails,
            stage: 'finished',
            steps: [],
            attachments: instAttachments,
            parameters: instParams,
            start: currentStepTime,
            stop: currentStepTime + instDuration
          });
          currentStepTime += instDuration;
        }

        if (subSteps.length > 0 && subSteps.every(s => s.status === 'skipped')) {
          stepStatus = 'skipped';
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
      await this.writeToBoth(allureResultsDir, runAllureResultsDir, resultFileName, JSON.stringify(allureResult, null, 2), generatedFiles);
    }

    return generatedFiles;
  }
}
