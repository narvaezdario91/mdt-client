## Why

Actualmente los reportes generados (como Allure) no muestran cuál Engine (por ejemplo, Playwright o Selenium) se utilizó para ejecutar los escenarios de prueba. Esto genera un "agujero negro" de observabilidad que impide filtrar los reportes o tener la certeza de la herramienta subyacente que resolvió los pasos, afectando el análisis de las ejecuciones.

## What Changes

- Extraer el Engine utilizado leyendo la propiedad `mcp_config` (o equivalente en la configuración MCP) que retorna el API de ejecución, ya que el API mantiene la misma estructura que la entrada.
- Analizar los argumentos de la configuración MCP (por ejemplo, extraer `playwright` de `@playwright/mcp`) para determinar el nombre del Engine.
- Agregar una etiqueta (Label) a nivel de escenario en el reporte de Allure indicando el Engine extraído.

## Capabilities

### New Capabilities

- Ninguna capacidad nueva a nivel macro, esto es una mejora sobre un reportero existente.

### Modified Capabilities

- `allure-reporter`: Se modifican los requerimientos de metadata para extraer e inyectar un nuevo label "engine" derivado de la configuración `mcp_config` en la respuesta del API.

## Impact

- `src/reporters/allure.ts`: Lógica de inyección de metadatos analizando la configuración de MCP.
- Metadatos visualizados en los reportes de Allure generados.
- No hay impacto en el CLI core ni en la forma en que se ejecuta la prueba.
