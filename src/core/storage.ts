import * as fs from 'fs/promises';
import * as path from 'path';

export class Storage {
  private baseDir: string;
  private runId?: string;

  constructor(baseDir: string = 'executions', runId?: string) {
    this.baseDir = path.resolve(process.cwd(), baseDir);
    this.runId = runId;
  }

  public async saveRawExecution(featureName: string, data: any): Promise<string> {
    const safeName = featureName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    
    let runDir: string;
    let fileName: string;

    if (this.runId) {
      runDir = path.join(this.baseDir, 'reports', this.runId, 'raw');
      fileName = `${safeName}.json`;
    } else {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      runDir = path.join(this.baseDir, 'raw', `run_${timestamp}_${safeName}`);
      fileName = 'result.json';
    }
    
    await fs.mkdir(runDir, { recursive: true });

    const filePath = path.join(runDir, fileName);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');

    return filePath;
  }

  public async getRawExecutions(): Promise<any[]> {
    if (!this.runId) {
      throw new Error('runId is required to get raw executions');
    }
    const rawDir = path.join(this.baseDir, 'reports', this.runId, 'raw');
    
    try {
      const files = await fs.readdir(rawDir);
      const executions = [];
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(rawDir, file);
          const content = await fs.readFile(filePath, 'utf8');
          executions.push(JSON.parse(content));
        }
      }
      return executions;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  public getReportsDir(): string {
    if (!this.runId) {
      throw new Error('runId is required to get reports dir');
    }
    return path.join(this.baseDir, 'reports', this.runId);
  }

  public async saveCache(relativePath: string, featureName: string, scenarioName: string, data: any): Promise<string> {
    const safeFeatureName = featureName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const safeScenarioName = scenarioName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    
    // Create nested directory: executions/cache/<relativePath>/<safeFeatureName>
    const cacheDir = path.join(this.baseDir, 'cache', relativePath, safeFeatureName);
    await fs.mkdir(cacheDir, { recursive: true });

    // File: <safeScenarioName>.json
    const filePath = path.join(cacheDir, `${safeScenarioName}.json`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');

    return filePath;
  }
}
