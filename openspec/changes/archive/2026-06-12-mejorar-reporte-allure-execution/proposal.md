## Why

El JSON de respuesta de la API se ha enriquecido y ahora devuelve el detalle completo en un objeto `execution`, incluyendo el tiempo real de ejecución, el nombre de la herramienta, detalles de salida, errores crudos, y telemetría de los LLM (tokens, reintentos). Es necesario actualizar el generador del reporte de Allure para que este documento visualice fielmente la realidad técnica reportada por la API en lugar de inferirla, de manera que los errores y los detalles sean completamente transparentes para el usuario.

## What Changes

- Mapear el estado del paso de forma estricta: `success` a `passed`, `skipped` a `skipped` y `failed` a `failed`.
- Usar `execution.durationMs` para el tiempo del sub-step, reemplazando el valor fijo actual de 1000ms.
- Adjuntar directamente el contenido crudo de `execution.details` al reporte Allure en caso de éxito.
- Inyectar el contenido crudo de `execution.error` en el `statusDetails.message` del paso de Allure en caso de fallo, para que el error sea visible inmediatamente.
- Incluir `execution.actionExecuted` en los parámetros del paso de Allure como la herramienta utilizada.
- Agregar los datos de `execution.telemetry` (como `executionPath`, `retries`, y uso de tokens) a la tabla de parámetros del paso de Allure.
- Eliminar la limpieza e inferencia insegura de herramientas/argumentos desde el array `actions` previo, basando la verdad en el bloque `execution`.

## Capabilities

### New Capabilities
- `allure-reporter`: Incorporación y estructuración de reportes Allure con detalles avanzados de ejecución, tiempos reales, y telemetría.

### Modified Capabilities
- (ninguna)

## Impact

- **Código:** Modificación del archivo `src/reporters/allure.ts`.
- **Sistemas:** Los reportes generados en el directorio `allure-results` tendrán un formato enriquecido con más parámetros y precisión en los tiempos de la línea temporal.
