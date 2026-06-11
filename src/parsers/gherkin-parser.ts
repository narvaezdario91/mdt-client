import { AstBuilder, Parser, GherkinClassicTokenMatcher } from '@cucumber/gherkin';
import * as messages from '@cucumber/messages';

export interface ParsedStep {
  keyword: string;
  text: string;
}

export interface ParsedScenario {
  name: string;
  steps: ParsedStep[];
}

export interface ParsedFeature {
  name: string;
  description?: string | null;
  scenarios: ParsedScenario[];
}

export class GherkinParser {
  public parse(content: string): ParsedFeature {
    // Generate IDs using the incrementing method to avoid external dependencies
    const newId = messages.IdGenerator.incrementing();
    const builder = new AstBuilder(newId);
    const matcher = new GherkinClassicTokenMatcher();
    const parser = new Parser(builder, matcher);

    let document: messages.GherkinDocument;
    try {
      document = parser.parse(content);
    } catch (err) {
      throw new Error(`Failed to parse Gherkin document: ${(err as Error).message}`);
    }

    if (!document.feature) {
      throw new Error('No Feature found in the provided Gherkin document');
    }

    const feature = document.feature;
    const parsedFeature: ParsedFeature = {
      name: feature.name,
      description: feature.description?.trim() || null,
      scenarios: [],
    };

    for (const child of feature.children) {
      if (child.scenario) {
        const scenario = child.scenario;
        const parsedScenario: ParsedScenario = {
          name: scenario.name,
          steps: [],
        };

        for (const step of scenario.steps) {
          parsedScenario.steps.push({
            keyword: step.keyword.trim(), // e.g. "Given ", "Then " -> "Given"
            text: step.text.trim(),
          });
        }
        
        parsedFeature.scenarios.push(parsedScenario);
      }
    }

    return parsedFeature;
  }
}
