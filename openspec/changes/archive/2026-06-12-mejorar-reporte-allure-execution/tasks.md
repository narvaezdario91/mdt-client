## 1. Mapeo de Variables Básicas

- [x] 1.1 Eliminar la lógica de extracción iterativa de parámetros desde el arreglo `inst.actions`.
- [x] 1.2 Mapear el `status` del sub-step para que acepte y propague `"skipped"` adecuadamente, no limitándolo solo a `"passed"` o `"failed"`.
- [x] 1.3 Modificar el cálculo de `instDuration` para tomar `inst.execution.durationMs` si está presente, dejando el default si no existe.

## 2. Inserción de Tool y Telemetría

- [x] 2.1 Agregar `inst.execution.actionExecuted` como un nuevo parámetro `Tool` del sub-step de Allure.
- [x] 2.2 Extraer y mapear el objeto `telemetry` (incluyendo `executionPath`, `retries` y variables de `llmTokens`) como parámetros individuales dentro de la tabla del sub-step en Allure.

## 3. Adjuntos de Detalles y Errores

- [x] 3.1 Garantizar que `inst.execution.details` se guarde siempre como archivo Markdown adjunto al step cuando la ejecución sea exitosa, incluso sin extraer variables de actions.
- [x] 3.2 Inyectar `inst.execution.error` en la propiedad `statusDetails.message` y/o `trace` del sub-step en Allure cuando el paso haya fallado.
