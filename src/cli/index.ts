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
  .action(async (options) => {
    console.log(`🚀 Starting BDD Orchestrator...`);
    console.log(`- Feature: ${options.features}`);
    console.log(`- Steps Dir: ${options.steps}`);
    console.log(`- API URL: ${options.apiUrl}`);

    try {
      // 1. Compile
      console.log(`\n⚙️  Compiling feature...`);
      const compiler = new FeatureCompiler(options.steps);
      const rawPayloads = compiler.compile(options.features);
      console.log(`✅ Found ${rawPayloads.length} scenario(s).`);

      const apiClient = new ApiClient(options.apiUrl);
      const storage = new Storage();

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

    } catch (error: any) {
      console.error(`\n❌ Error during execution:`);
      console.error(error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);
