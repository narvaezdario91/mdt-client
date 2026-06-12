import { IReporter } from './reporter.interface';
import { CucumberReporter } from './cucumber';
import { HtmlReporter } from './html';
import { AllureReporter } from './allure';

export class ReporterFactory {
  public static getReporters(names: string[]): IReporter[] {
    const reporters: IReporter[] = [];

    for (const name of names) {
      const normalized = name.trim().toLowerCase();
      switch (normalized) {
        case 'cucumber':
          reporters.push(new CucumberReporter());
          break;
        case 'html':
          reporters.push(new HtmlReporter());
          break;
        case 'allure':
          reporters.push(new AllureReporter());
          break;
        default:
          console.warn(`⚠️  Warning: Unknown reporter format "${name}"`);
          break;
      }
    }

    return reporters;
  }
}
