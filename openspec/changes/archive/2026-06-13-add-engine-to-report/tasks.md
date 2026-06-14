## 1. Actualización de AllureReporter

- [x] 1.1 En `src/reporters/allure.ts`, localizar donde se iteran las ejecuciones (`for (const exec of rawExecutions)`) y se construyen los labels de `allureResult`.
- [x] 1.2 Implementar lógica para extraer el engine name desde `exec.mcp_config?.args` (ej. buscar si incluye `playwright` o `selenium`).
- [x] 1.3 Agregar el objeto `{ name: 'engine', value: engineName }` a la lista de `labels` en la estructura final de `allureResult`.
- [x] 1.4 Si el engine no puede determinarse o `mcp_config` no existe, usar el valor `"unknown"`.

## 2. Pruebas y Validación

- [x] 2.1 Ejecutar un escenario de prueba para generar un nuevo reporte en la caché.
- [x] 2.2 Verificar que el archivo generado en `allure-results/` contenga el label `"engine"` con el valor esperado.
