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

function findFeaturesRecursive(dirPath: string): string[] {
  let results: string[] = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findFeaturesRecursive(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.feature')) {
      results.push(fullPath);
    }
  }
  return results;
}

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
  .option('--report <formats>', 'Generate specific report formats after execution (comma-separated, e.g., cucumber,allure,html)')
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
      features: cliOptions.features || fileConfig.paths?.features,
      steps: cliOptions.steps || fileConfig.paths?.steps,
      apiUrl: cliOptions.apiUrl || fileConfig.api?.url || 'http://localhost:8000',
      useCache: cliOptions.cache !== false ? (fileConfig.execution?.useCache !== false) : false,
      report: cliOptions.report || fileConfig.execution?.report,
      mcpConfig: fileConfig.mcp,
      reportsDir: fileConfig.paths?.reports,
      cacheDir: fileConfig.paths?.cache
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
      console.log(`\n⚙️  Compiling feature(s)...`);
      const compiler = new FeatureCompiler(options.steps, options.mcpConfig);
      
      let featureFiles: string[] = [];
      const stat = fs.statSync(options.features);
      if (stat.isDirectory()) {
        featureFiles = findFeaturesRecursive(options.features);
      } else {
        featureFiles = [options.features];
      }

      let rawPayloads: any[] = [];
      for (const file of featureFiles) {
        const compiledPayloads = compiler.compile(file);
        // Inject the original source file to calculate correct relative paths for caching
        compiledPayloads.forEach((p: any) => p._sourceFile = file);
        rawPayloads.push(...compiledPayloads);
      }

      console.log(`✅ Found ${rawPayloads.length} scenario(s) across ${featureFiles.length} file(s).`);

      const apiClient = new ApiClient(options.apiUrl);
      const storage = new Storage({
        reportsDir: options.reportsDir,
        cacheDir: options.cacheDir,
        runId: runId
      });

      for (const rawPayload of rawPayloads) {
        const scenarioName = rawPayload.cache_content?.scenarioName || 'unknown_scenario';
        const featureName = rawPayload.cache_content?.featureName || 'unknown_feature';
        
        // 2. Validate using Zod
        console.log(`\n🔍 Validating payload for scenario: "${scenarioName}"...`);
        let payload = PayloadSchema.parse(rawPayload);

        // Calculate relativePath robustly based on the actual feature file, not options.features
        const sourceFile = rawPayload._sourceFile || options.features;
        const relativePath = path.dirname(path.relative(process.cwd(), sourceFile));

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
        let result: any;
        try {
          result = await apiClient.executeFeature(payload);
        } catch (apiErr: any) {
          const jsonMatch = apiErr.message.match(/^API Error \[[^\]]+\]:\s*(.*)$/);
          if (jsonMatch && jsonMatch[1]) {
            try {
              result = JSON.parse(jsonMatch[1]);
              console.log(`⚠️ Scenario executed with failures (API returned an error).`);
            } catch (parseErr) {
              result = {
                featureName,
                scenarioName,
                executionSummary: { success: false, executionTimeMs: 0, errorSummary: `API Error: ${apiErr.message}` },
                steps: []
              };
              console.log(`⚠️ Scenario failed critically (parsing error).`);
            }
          } else {
            result = {
              featureName,
              scenarioName,
              executionSummary: { success: false, executionTimeMs: 0, errorSummary: `Network/API Error: ${apiErr.message}` },
              steps: []
            };
            console.log(`⚠️ Scenario failed critically (Network/API).`);
          }
        }

        // Inject mcp_config from payload into the result so reporters can access it
        if (payload.mcp_config) {
          result.mcp_config = payload.mcp_config;
        }

        // 5. Save results
        console.log(`💾 Saving results...`);
        const savedPath = await storage.saveRawExecution(`${featureName}_${scenarioName}`, result);
        console.log(`🎉 Execution completed. Raw results saved to:\n   ${savedPath}`);

        // 5. Save Cache if successful
        if (result.executionSummary?.success === true) {
          console.log(`🌟 Scenario successful. Saving Golden Copy to cache...`);
          const cachePath = await storage.saveCache(relativePath, featureName, scenarioName, result);
          console.log(`✅ Golden Copy saved to:\n   ${cachePath}`);
        }
      }

      // Always save raw-executions.json in the reports run directory
      const rawExecutions = await storage.getRawExecutions();
      const rawExecutionsPath = path.join(storage.getReportsDir(), 'raw-executions.json');
      fs.writeFileSync(rawExecutionsPath, JSON.stringify(rawExecutions, null, 2), 'utf8');
      console.log(`✅ Raw executions log successfully saved to:\n   ${rawExecutionsPath}`);

      // Generate Reports if requested
      const reportFormats = options.report
        ? options.report.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
        : [];

      if (reportFormats.length > 0) {
        console.log(`\n📊 Generating reports for formats: ${reportFormats.join(', ')}...`);
        const { ReporterFactory } = require('../reporters/factory');
        const reporters = ReporterFactory.getReporters(reportFormats);

        for (const reporter of reporters) {
          const reporterName = reporter.constructor.name;
          console.log(`🔹 Running ${reporterName}...`);
          try {
            const reportPaths = await reporter.generate(rawExecutions, runId, storage.getReportsDir());
            console.log(`   Generated:`);
            for (const p of reportPaths) {
              console.log(`   - ${p}`);
            }
          } catch (repError: any) {
            console.error(`❌ Error generating report with ${reporterName}: ${repError.message}`);
          }
        }
      }

    } catch (error: any) {
      console.error(`\n❌ Error during execution:`);
      console.error(error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);
