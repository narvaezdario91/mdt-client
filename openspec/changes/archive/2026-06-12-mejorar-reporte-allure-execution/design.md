## Context

El proyecto `mdt-orchestrator` utiliza un reportero para integrar los resultados de las ejecuciones dentro de Allure. Anteriormente, el reporte se armaba infiriendo los argumentos de la acción a ejecutar y calculando un tiempo estándar para todos los comandos, lo que enmascaraba el tiempo real y ocultaba los detalles técnicos o los errores.
Con el reciente cambio de la API, el objeto de respuesta ahora trae un bloque `execution` por cada paso de prueba que proporciona la duración real en milisegundos (`durationMs`), detalles exactos (`details`), errores concretos (`error`), y telemetría sobre el uso de recursos y LLMs.

## Goals / Non-Goals

**Goals:**
- Actualizar `AllureReporter` (en `src/reporters/allure.ts`) para que parsee e incruste fielmente los datos provenientes del objeto `execution`.
- Mostrar tiempos de ejecución exactos en el timeline de Allure.
- Exponer el mensaje de error directo de Playwright en la interfaz de Allure sin necesidad de rebuscar en logs crudos.

**Non-Goals:**
- No modificaremos los reporteros de Cucumber ni ninguna otra interfaz.
- No se alterarán los tests de Playwright, únicamente se trata del formateo de salida (Reporte).
- No se inferirán argumentos ni se modificará el comportamiento en runtime; solo lectura de los reportes en crudo finalizados.

## Decisions

1. **Reemplazo de la extracción de parámetros de Actions:**
   - *Decisión:* Remover el intento de iterar sobre `inst.actions` para sacar la herramienta y los argumentos.
   - *Rationale:* Cuando el LLM falla, el array `actions` puede venir vacío, y perdemos contexto de qué falló. Leeremos `inst.execution.actionExecuted`.

2. **Inclusión de Errores:**
   - *Decisión:* Inyectar `inst.execution.error` en la propiedad `message` o `trace` del objeto `statusDetails` del step.
   - *Rationale:* Allure utiliza `statusDetails` para colorear de rojo el texto y mostrar el stacktrace/mensaje en su GUI.

3. **Inclusión de Detalles:**
   - *Decisión:* Si `inst.execution.details` está presente, seguir asociándolo como archivo adjunto (`.md`) pero asegurarnos de que sucede independientemente de si hay argumentos mapeados o no.

4. **Telemetría como `parameters`:**
   - *Decisión:* Agregar `executionPath`, `retries` y `llmTokens` como parámetros de tipo llave-valor en el paso para facilitar el debug visual en Allure.

## Risks / Trade-offs

- *Riesgo:* Que la API no envíe la propiedad `execution` para ejecuciones muy antiguas.
  *Mitigación:* Se utilizará enrutamiento seguro (`?.`) y fallback, por ejemplo, mantener estado `"passed"` o `"failed"` basado en validaciones anteriores si el bloque no está presente.
