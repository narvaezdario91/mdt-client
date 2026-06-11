import * as fs from 'fs/promises';
import * as path from 'path';

export class Storage {
  private baseDir: string;

  constructor(baseDir: string = 'executions') {
    this.baseDir = path.resolve(process.cwd(), baseDir);
  }

  public async saveRawExecution(featureName: string, data: any): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const safeName = featureName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    
    // Create executions/raw/<timestamp>_<feature> directory
    const runDir = path.join(this.baseDir, 'raw', `run_${timestamp}_${safeName}`);
    await fs.mkdir(runDir, { recursive: true });

    const filePath = path.join(runDir, 'result.json');
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');

    return filePath;
  }
}
