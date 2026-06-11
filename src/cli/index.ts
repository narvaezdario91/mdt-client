#!/usr/bin/env node
import { Command } from 'commander';
import { FeatureCompiler } from '../core/compiler';
import { ApiClient } from '../core/api-client';
import { Storage } from '../core/storage';
import { PayloadSchema } from '../models/payload.schema';

const program = new Command();

program
  .name('bdd-orchestrator')
  .description('MDT Node.js BDD Orchestrator CLI')
  .version('1.0.0');

program
  .command('run')
  .description('Run BDD scenarios')
  .requiredOption('-f, --features <path>', 'Path to the .feature file')
  .requiredOption('-s, --steps <path>', 'Path to the directory containing .steps.yaml files')
  .option('-u, --api-url <url>', 'Execution API URL', 'http://localhost:8000')
  .option('--report <format>', 'Generate a specific report format after execution (e.g., cucumber)')
  .action(async (options) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const runId = `run_${timestamp}`;

    console.log(`🚀 Starting BDD Orchestrator...`);
    console.log(`- Feature: ${options.features}`);
    console.log(`- Steps Dir: ${options.steps}`);
    console.log(`- API URL: ${options.apiUrl}`);
    console.log(`- Run ID: ${runId}`);
    if (options.report) console.log(`- Report: ${options.report}`);

    try {
      // 1. Compile
      console.log(`\n⚙️  Compiling feature...`);
      const compiler = new FeatureCompiler(options.steps);
      const rawPayloads = compiler.compile(options.features);
      console.log(`✅ Found ${rawPayloads.length} scenario(s).`);

      const apiClient = new ApiClient(options.apiUrl);
      const storage = new Storage('executions', runId);

      for (const rawPayload of rawPayloads) {
        const scenarioName = rawPayload.cache_content?.scenarioName || 'unknown_scenario';
        const featureName = rawPayload.cache_content?.featureName || 'unknown_feature';
        
        // 2. Validate using Zod
        console.log(`\n🔍 Validating payload for scenario: "${scenarioName}"...`);
        const payload = PayloadSchema.parse(rawPayload);

        // 3. Execute API
        console.log(`🌐 Sending payload to Execution API...`);
        const result = await apiClient.executeFeature(payload);

        // 4. Save results
        console.log(`💾 Saving results...`);
        const savedPath = await storage.saveRawExecution(`${featureName}_${scenarioName}`, result);
        console.log(`🎉 Execution completed. Raw results saved to:\n   ${savedPath}`);
      }

      // 5. Generate Report if requested
      if (options.report === 'cucumber') {
        console.log(`\n📊 Generating Cucumber report...`);
        const { CucumberReporter } = require('../reporters/cucumber');
        const reporter = new CucumberReporter(storage.getReportsDir());
        const rawExecutions = await storage.getRawExecutions();
        const reportPath = await reporter.generateReport(rawExecutions);
        console.log(`✅ Cucumber report successfully generated at:\n   ${reportPath}`);
      }

    } catch (error: any) {
      console.error(`\n❌ Error during execution:`);
      console.error(error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);
