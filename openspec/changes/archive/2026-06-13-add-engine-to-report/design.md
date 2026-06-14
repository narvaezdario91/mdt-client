## Context

Los reportes de ejecución actuales no muestran qué Engine se está utilizando. Al analizar el Execution API y los archivos cacheados, identificamos que el CLI pasa la configuración MCP (e.g. `mcp: { args: ['-y', '@playwright/mcp'] }`) como parte del Payload. El Execution API devuelve el resultado manteniendo la estructura de `mcp_config` en la raíz. El objetivo es aprovechar este dato para exponerlo a los usuarios.

## Goals / Non-Goals

**Goals:**
- Extraer de forma confiable el Engine usado a partir del `mcp_config` retornado por la ejecución.
- Añadir el Engine como etiqueta a nivel de escenario en el reporte Allure.

**Non-Goals:**
- No modificaremos el CLI core ni el Execution API.
- No inferiremos el navegador en esta iteración.

## Decisions

1. **Uso de `mcp_config` para inferir el Engine:**
   - Evaluamos buscar dentro del arreglo `actions` comparando el `actionExecuted`, pero decidimos (según alineamiento) que extraerlo de la configuración devuelta por el API (`mcp_config`) es más robusto a nivel de escenario y representa directamente la herramienta conectada.
   - **Implementación:** En `src/reporters/allure.ts`, leeremos `exec.mcp_config?.args`. Buscaremos el argumento principal (ej. `@playwright/mcp` o `@selenium/mcp`) y extraeremos el nombre del engine.

2. **Inyección en Allure como Label:**
   - La etiqueta se agregará en el arreglo de `labels` de `allureResult`.
   - Formato: `{ name: 'engine', value: engineName }`.

## Risks / Trade-offs

- **Risk:** El formato de los `args` del MCP podría cambiar o venir vacío si el usuario no configura un MCP estándar.
- **Mitigation:** Implementar un fallback seguro (ej. si no se detecta un engine conocido, omitir el label o poner "unknown").
