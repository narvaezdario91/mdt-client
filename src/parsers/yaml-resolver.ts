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

export class YamlResolver {
  private registry: Map<string, StepDefinition> = new Map();

  constructor(private stepsDir: string) {
    this.loadAll(this.stepsDir);
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
          this.registry.set(stepName, details as StepDefinition);
        }
      }
    } catch (err) {
      console.error(`[Error] Failed to parse YAML file ${filePath}`, err);
    }
  }

  public resolve(stepText: string): StepDefinition | undefined {
    return this.registry.get(stepText);
  }

  public getRegistrySize(): number {
    return this.registry.size;
  }
}
