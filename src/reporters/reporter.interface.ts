export interface IReporter {
  generate(rawExecutions: any[], runId: string, reportsDir: string): Promise<string[]>;
}
