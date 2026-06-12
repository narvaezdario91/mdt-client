## Context
Buscamos un diseño robusto y escalable para inyectar múltiples "Reporteros" basados en la bandera `--report` (que ahora podrá aceptar valores separados por coma, ej: `--report cucumber,allure`). 

## Goals / Non-Goals
**Goals:**
- Implementar `IReporter` con método `generate(rawExecutions, runId)`.
- Guardar obligatoriamente `raw-executions.json`.
- Integrar `allure-js-commons` o armar manualmente el JSON de Allure 2 para los resultados (armar el JSON de Allure es simple: uuid, nombre, status, stage).
- Integrar `cucumber-html-reporter` para el HTML.

**Non-Goals:**
- No instalaremos `@cucumber/html-formatter` (eventos NDJSON) ya que el usuario explícitamente solicitó la vía rápida de Cucumber HTML Básico y Allure.

## Decisions
1. **Interfaz `IReporter`**:
   ```typescript
   export interface IReporter {
     generate(rawExecutions: any[], runId: string, reportsDir: string): Promise<string[]>;
   }
   ```
2. **ReporterFactory**:
   Leerá un arreglo de strings `["cucumber", "allure"]` y devolverá un arreglo de `IReporter[]`.
3. **Orquestador (cli/index.ts)**:
   Siempre hará: `fs.writeFile('raw-executions.json', JSON.stringify(rawExecutions))` para cumplir con el log incondicional del API.
   Luego iterará: `for (const rep of reporters) await rep.generate(...)`.

## Risks / Trade-offs
- Escribir JSON puro para Allure sin el `allure-js-commons` oficial significa que si Allure cambia de versión drásticamente podría romper; pero el schema v2 lleva años estable. Usaremos generación de JSON simple (`{ name, status: 'passed' | 'failed', steps: [], start, stop, uuid }`).
