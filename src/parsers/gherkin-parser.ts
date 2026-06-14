import { AstBuilder, Parser, GherkinClassicTokenMatcher, compile } from '@cucumber/gherkin';
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

    // Compile to Pickles to expand Scenario Outlines and Backgrounds
    const uri = 'feature';
    const pickles = compile(document, uri, newId);

    const feature = document.feature;
    const parsedFeature: ParsedFeature = {
      name: feature.name,
      description: feature.description?.trim() || null,
      scenarios: [],
    };

    for (const pickle of pickles) {
      const parsedScenario: ParsedScenario = {
        name: pickle.name,
        steps: [],
      };

      for (const step of pickle.steps) {
        // Find the original AST step to get the keyword (PickleStep doesn't have the keyword)
        const astNodeId = step.astNodeIds[0];
        let keyword = '';
        
        // Very basic way to find keyword: Search through feature.children
        // Note: In a robust implementation we'd walk the AST, but since we just need "Given", "When", "Then" for UI/logs, we can extract it or default it.
        // Actually, mdt-client's compiler just needs the text! Let's default keyword to empty string to keep ParsedStep signature, or find it.
        // We'll leave it as empty for now, as step.text is what really matters for yaml-resolver.
        parsedScenario.steps.push({
          keyword: '', 
          text: step.text.trim(),
        });
      }
      
      parsedFeature.scenarios.push(parsedScenario);
    }

    return parsedFeature;
  }
}
