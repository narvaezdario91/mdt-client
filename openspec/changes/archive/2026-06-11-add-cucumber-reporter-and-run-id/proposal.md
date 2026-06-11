## Why

El orquestador en Node.js actualmente genera un archivo crudo por escenario en una carpeta aislada y no agrupa los resultados. Esto hace difícil interpretar la ejecución completa de una suite de pruebas, y bloquea la integración con sistemas de CI/CD que dependen del formato estándar de Cucumber JSON para dashboards de reportes. Esta migración recupera la funcionalidad del orquestador anterior de agrupar por corrida y consolidar los reportes.

## What Changes

- Modificación en el CLI para generar un `run_id` global al inicio de la ejecución.
- El almacenamiento (Storage) cambiará su ruta destino de `executions/raw/<...>` a `executions/reports/<run_id>/raw/`.
- Nueva bandera CLI `--report <format>` (ej. `--report cucumber`).
- Nueva clase `CucumberReporter` que lee los JSONs crudos de una ejecución agrupada y genera un `cucumber-report.json`.

## Capabilities

### New Capabilities
- `cucumber-reporter`: Capacidad de consolidar resultados crudos de un "Run" global en un JSON compatible con el estándar Cucumber.
- `run-grouping`: Capacidad de identificar un ciclo de ejecución del CLI mediante un identificador único (Run ID) y agrupar todos los JSON crudos generados bajo este ciclo.

### Modified Capabilities
- `core`: Los requisitos básicos de compilación se actualizan para soportar múltiples archivos (o agrupaciones) y soportar el uso de reportería (bandera `--report`).

## Impact

- `src/cli/index.ts`: Integración de lógica de Run ID y Reporter.
- `src/core/storage.ts`: Cambios en la ruta base de guardado de JSONs de resultados crudos.
- `src/reporters/cucumber.ts`: Nueva clase de reportería.
