## 1. Storage & Run ID

- [x] 1.1 Modificar `src/core/storage.ts` para aceptar `runId` opcional en el constructor.
- [x] 1.2 Actualizar `saveRawExecution` para guardar en `executions/reports/<run_id>/raw/` si `runId` está presente.
- [x] 1.3 Implementar un método auxiliar en `Storage` para leer todos los archivos JSON de una carpeta `raw` específica (útil para el reporter).

## 2. CLI Updates

- [x] 2.1 En `src/cli/index.ts`, generar `runId` usando formato de fecha (ej. `run_<timestamp>`).
- [x] 2.2 Actualizar instanciación de `Storage` para que reciba el `runId` generado.
- [x] 2.3 Añadir opción `--report <format>` a `commander` en `index.ts`.

## 3. Cucumber Reporter

- [x] 3.1 Crear `src/reporters/cucumber.ts` con una clase `CucumberReporter`.
- [x] 3.2 Implementar transformación: de formato `Payload` a Cucumber JSON.
- [x] 3.3 Implementar método en `CucumberReporter` que lea la carpeta `raw` usando el método de `Storage`, agrupe y escriba `cucumber-report.json` en `executions/reports/<run_id>/`.

## 4. Reporter CLI Integration

- [x] 4.1 En `index.ts`, al final de iterar los payloads, revisar si `options.report === 'cucumber'`.
- [x] 4.2 Si aplica, instanciar `CucumberReporter` e invocar generación de reporte.
- [x] 4.3 Añadir log de consola confirmando dónde se guardó el reporte consolidado.
