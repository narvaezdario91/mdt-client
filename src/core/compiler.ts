import * as fs from 'fs';
import { GherkinParser } from '../parsers/gherkin-parser';
import { YamlResolver } from '../parsers/yaml-resolver';
import { Payload, Step, Instruction } from '../models/payload.schema';

export class FeatureCompiler {
  private gherkinParser: GherkinParser;
  private yamlResolver: YamlResolver;
  private mcpConfig: Record<string, any>;

  constructor(stepsDir: string, mcpConfig?: Record<string, any>) {
    this.gherkinParser = new GherkinParser();
    this.yamlResolver = new YamlResolver(stepsDir);
    this.mcpConfig = mcpConfig || {
      type: "stdio",
      command: "npx",
      args: ["-y", "@playwright/mcp"]
    };
  }

  public compile(featureFilePath: string): Payload[] {
    if (!fs.existsSync(featureFilePath)) {
      throw new Error(`Feature file not found: ${featureFilePath}`);
    }

    const content = fs.readFileSync(featureFilePath, 'utf8');
    const parsedFeature = this.gherkinParser.parse(content);

    const payloads: Payload[] = [];

    for (const parsedScenario of parsedFeature.scenarios) {
      const steps: Step[] = [];

      for (const step of parsedScenario.steps) {
        const stepDef = this.yamlResolver.resolve(step.text);
        
        if (!stepDef || !stepDef.instructions) {
          throw new Error(`Step definition not found for step: "${step.text}" in scenario "${parsedScenario.name}"`);
        }

        const instructions: Instruction[] = stepDef.instructions.map((inst: any) => {
          if (typeof inst === 'string') {
            return { instruction: inst };
          }
          return {
            instruction: inst.instruction,
            actions: inst.actions || null
          };
        });

        steps.push({
          stepText: step.text,
          instructions,
        });
      }

      payloads.push({
        cache_content: {
          featureName: parsedFeature.name,
          scenarioName: parsedScenario.name,
          createdAt: new Date().toISOString(),
          steps,
        },
        mcp_config: this.mcpConfig
      });
    }

    return payloads;
  }
}
