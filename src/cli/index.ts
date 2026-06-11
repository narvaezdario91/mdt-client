#!/usr/bin/env node
import { Command } from 'commander';
import { FeatureCompiler } from '../core/compiler';
import { ApiClient } from '../core/api-client';
import { Storage } from '../core/storage';
import { PayloadSchema } from '../models/payload.schema';
import * as path from 'path';

import * as fs from 'fs';
import { MDTConfig } from '../models/config';

const program = new Command();

program
  .name('bdd-orchestrator')
  .description('MDT Node.js BDD Orchestrator CLI')
  .version('1.0.0');

program
  .command('run')
  .description('Run BDD scenarios')
  .option('-f, --features <path>', 'Path to the .feature file')
  .option('-s, --steps <path>', 'Path to the directory containing .steps.yaml files')
  .option('-u, --api-url <url>', 'Execution API URL')
  .option('--no-cache', 'Disable cache injection (Golden Copy)')
  .option('--report <format>', 'Generate a specific report format after execution (e.g., cucumber)')
  .action(async (cliOptions) => {
    // Read config
    let fileConfig: MDTConfig = {};
    const configPath = path.resolve(process.cwd(), 'mdt.config.json');
    if (fs.existsSync(configPath)) {
      try {
        fileConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      } catch (e) {
        console.warn('⚠️  Could not parse mdt.config.json');
      }
    }

    const options = {
      features: cliOptions.features || fileConfig.featuresDir,
      steps: cliOptions.steps || fileConfig.stepsDir,
      apiUrl: cliOptions.apiUrl || fileConfig.apiUrl || 'http://localhost:8000',
      useCache: cliOptions.cache !== false ? (fileConfig.useCache !== false) : false,
      report: cliOptions.report
    };

    if (!options.features || !options.steps) {
      console.error('❌ Error: --features and --steps are required (via CLI or mdt.config.json)');
      process.exit(1);
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const runId = `run_${timestamp}`;

    console.log(`🚀 Starting BDD Orchestrator...`);
    console.log(`- Feature: ${options.features}`);
    console.log(`- Steps Dir: ${options.steps}`);
    console.log(`- API URL: ${options.apiUrl}`);
    console.log(`- Run ID: ${runId}`);
    console.log(`- Use Cache: ${options.useCache}`);
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
        let payload = PayloadSchema.parse(rawPayload);

        const relativePath = path.dirname(path.relative(process.cwd(), options.features));

        // 3. Cache Replay
        if (options.useCache) {
          const cachedData = await storage.getCache(relativePath, featureName, scenarioName);
          if (cachedData) {
            console.log(`📦 Cache found for scenario "${scenarioName}". Attempting replay...`);
            const { CacheReplay } = require('../core/cache-replay');
            payload = CacheReplay.inject(payload, cachedData);
          } else {
            console.log(`ℹ️ No cache found for scenario "${scenarioName}".`);
          }
        }

        // 4. Execute API
        console.log(`🌐 Sending payload to Execution API...`);
        const result = await apiClient.executeFeature(payload);

        // 5. Save results
        console.log(`💾 Saving results...`);
        const savedPath = await storage.saveRawExecution(`${featureName}_${scenarioName}`, result);
        console.log(`🎉 Execution completed. Raw results saved to:\n   ${savedPath}`);

        // 5. Save Cache if successful
        if (result.executionSummary?.success === true) {
          const relativePath = path.dirname(path.relative(process.cwd(), options.features));
          console.log(`🌟 Scenario successful. Saving Golden Copy to cache...`);
          const cachePath = await storage.saveCache(relativePath, featureName, scenarioName, result);
          console.log(`✅ Golden Copy saved to:\n   ${cachePath}`);
        }
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
