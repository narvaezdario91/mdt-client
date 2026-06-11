import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';

export interface YamlInstruction {
  instruction: string;
  actions?: any[];
}

export interface StepDefinition {
  instructions: (string | YamlInstruction)[];
}

interface PatternInfo {
  originalKey: string;
  regex: RegExp;
  definition: StepDefinition;
  variableNames: string[];
}

export class YamlResolver {
  private patterns: PatternInfo[] = [];

  constructor(private stepsDir: string) {
    this.loadAll(this.stepsDir);
  }

  private buildRegex(key: string): { regex: RegExp, variableNames: string[] } {
    const variableNames: string[] = [];
    const parts = key.split(/\{(\w+)\}/g);
    let patternStr = '^';
    
    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        // Literal part (escape regex chars)
        patternStr += parts[i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      } else {
        // Variable part
        const varName = parts[i];
        variableNames.push(varName);
        patternStr += `(?<${varName}>.*?)`;
      }
    }
    patternStr += '$';
    return { regex: new RegExp(patternStr), variableNames };
  }

  private loadAll(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
      console.warn(`[Warning] Steps directory not found: ${dirPath}`);
      return;
    }

    const files = fs.readdirSync(dirPath);

    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        this.loadAll(fullPath); // recursive
      } else if (file.endsWith('.steps.yaml')) {
        this.loadFile(fullPath);
      }
    }
  }

  private loadFile(filePath: string) {
    try {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const data = yaml.parse(fileContents);

      if (data) {
        // The yaml root is the step name
        for (const [stepName, details] of Object.entries(data)) {
          const { regex, variableNames } = this.buildRegex(stepName);
          this.patterns.push({
            originalKey: stepName,
            regex,
            definition: details as StepDefinition,
            variableNames
          });
        }
      }
    } catch (err) {
      console.error(`[Error] Failed to parse YAML file ${filePath}`, err);
    }
  }

  public resolve(stepText: string): StepDefinition | undefined {
    for (const pattern of this.patterns) {
      const match = pattern.regex.exec(stepText);
      if (match) {
        const variables = match.groups || {};
        
        const resolvedInstructions = pattern.definition.instructions.map(inst => {
          if (typeof inst === 'string') {
            let resolvedInst = inst;
            for (const [key, val] of Object.entries(variables)) {
              let cleanVal = val as string;
              if (cleanVal.length >= 2 && ((cleanVal.startsWith('"') && cleanVal.endsWith('"')) || (cleanVal.startsWith("'") && cleanVal.endsWith("'")))) {
                 cleanVal = cleanVal.slice(1, -1);
              }
              resolvedInst = resolvedInst.split(`{${key}}`).join(cleanVal);
            }
            return resolvedInst;
          } else {
             let resolvedInstStr = inst.instruction;
             for (const [key, val] of Object.entries(variables)) {
                let cleanVal = val as string;
                if (cleanVal.length >= 2 && ((cleanVal.startsWith('"') && cleanVal.endsWith('"')) || (cleanVal.startsWith("'") && cleanVal.endsWith("'")))) {
                   cleanVal = cleanVal.slice(1, -1);
                }
                resolvedInstStr = resolvedInstStr.split(`{${key}}`).join(cleanVal);
             }
             return { ...inst, instruction: resolvedInstStr };
          }
        });

        return { instructions: resolvedInstructions };
      }
    }
    return undefined; // No match found
  }

  public getRegistrySize(): number {
    return this.patterns.length;
  }
}
