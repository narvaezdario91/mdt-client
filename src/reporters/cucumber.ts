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
          
          const scenarioDurationMs = scenario.executionSummary?.executionTimeMs || 0;
          const isSuccess = scenario.executionSummary?.success ?? true;
          const globalError = scenario.executionSummary?.errorSummary || 'Scenario failed';

          let hasFailed = false;
          let executedStepsCount = 0;

          // 1.1 Secuencial status and 1.4 embeddings markdown
          const processedSteps = (scenario.steps || []).map((step: any) => {
            let stepStatus = "passed";
            let instructionsMarkdown = "";
            let stepHasFailedInstruction = false;

            if (hasFailed) {
              stepStatus = "skipped";
            } else {
              executedStepsCount++;
              
              for (const inst of step.instructions || []) {
                const isInstSuccess = inst.execution?.status === 'success';
                instructionsMarkdown += `### Instruction: ${inst.instruction}\n`;
                instructionsMarkdown += `- **Action**: \`${inst.execution?.actionExecuted || 'unknown'}\`\n`;
                instructionsMarkdown += `- **Status**: ${isInstSuccess ? '✅ success' : '❌ failed'}\n`;
                if (inst.execution?.details) {
                  instructionsMarkdown += `- **Details**:\n${inst.execution.details}\n`;
                }
                instructionsMarkdown += `---\n`;

                if (!isInstSuccess) {
                  stepHasFailedInstruction = true;
                }
              }

              if (stepHasFailedInstruction) {
                stepStatus = "failed";
                hasFailed = true;
              }
            }

            return {
              originalStep: step,
              status: stepStatus,
              markdown: instructionsMarkdown
            };
          });

          // 1.2 Salvaguarda defensiva
          if (!isSuccess && !hasFailed && processedSteps.length > 0) {
            const lastStep = processedSteps[processedSteps.length - 1];
            lastStep.status = "failed";
            lastStep.markdown += `\n### Global Error\n- **Status**: ❌ failed\n- **Details**: ${globalError}\n`;
          }

          // 1.3 Distribución de duración
          const durationPerStep = executedStepsCount > 0 
            ? Math.floor((scenarioDurationMs * 1000000) / executedStepsCount) 
            : 0;

          return {
            id: scenarioId,
            name: scenario.scenarioName,
            type: "scenario",
            keyword: "Scenario",
            steps: processedSteps.map((pStep: any) => {
              const resultObj: any = {
                status: pStep.status,
                duration: pStep.status === "skipped" ? 0 : durationPerStep
              };
              
              if (pStep.status === "failed" && pStep.markdown.includes('Global Error')) {
                resultObj.error_message = globalError;
              }

              const stepElement: any = {
                name: pStep.originalStep.stepText,
                keyword: "* ",
                match: { location: "unknown" },
                result: resultObj
              };

              // 1.4 Adjuntar embedding
              if (pStep.markdown) {
                stepElement.embeddings = [
                  {
                    mime_type: "text/plain",
                    data: Buffer.from(pStep.markdown).toString("base64")
                  }
                ];
              }

              return stepElement;
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
