## 1. Diseño Base y Logs
- [x] 1.1 Modificar `src/cli/index.ts` para permitir múltiples valores en la opción `--report` (ej. `cucumber,allure`).
- [x] 1.2 En `src/cli/index.ts`, añadir lógica inamovible que guarde `rawExecutions` en `executions/reports/{runId}/raw-executions.json`.
- [x] 1.3 Crear `src/reporters/reporter.interface.ts` con la interfaz `IReporter`.

## 2. Implementación de Estrategias
- [x] 2.1 Refactorizar `src/reporters/cucumber.ts` para que implemente `IReporter`.
- [x] 2.2 Crear `src/reporters/html.ts` que implemente `IReporter`, llame internamente al `CucumberReporter` y luego use `cucumber-html-reporter` para generar el HTML.
- [x] 2.3 Crear `src/reporters/allure.ts` que implemente `IReporter` iterando sobre `rawExecutions` para emitir los JSON de Allure en `allure-results/`.

## 3. Implementación del Factory
- [x] 3.1 Crear `src/reporters/factory.ts` con `ReporterFactory.getReporters(names: string[])` que retorne las instancias correctas.
- [x] 3.2 Conectar el `ReporterFactory` en `src/cli/index.ts` e invocar el método `generate` de cada uno secuencialmente.
