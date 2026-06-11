## Why

El orquestador BDD necesita mantener una copia de la última ejecución exitosa (Golden Copy) de cada escenario. Esta caché actúa como historial de referencia válido para futuras ejecuciones o validaciones, replicando una funcionalidad valiosa del proyecto original `GUI_MDT`, pero simplificada con una estructura de carpetas plana.

## What Changes

- Añadir capacidad para almacenar copias de resultados en la carpeta `executions/cache`.
- Mantener la estructura anidada original del proyecto (Golden Copy) para la caché: `executions/cache/<RutaRelativaFeature>/<NombreFeature>/<NombreEscenario>.json`.
- Implementar lógica para que **solo las ejecuciones exitosas** (`success === true`) sean almacenadas/sobreescritas en el caché.

## Capabilities

### New Capabilities
- `execution-cache`: Funcionalidad para determinar el estado de la ejecución y guardar localmente la última copia "exitosa" (golden copy) de forma plana.

### Modified Capabilities
- `core`: Integración del guardado de la caché en el Storage y el ciclo de vida del CLI durante la ejecución de los payloads.

## Impact

- **Storage**: Nuevo método `saveCache` en `src/core/storage.ts`.
- **CLI**: Llamado adicional a `storage.saveCache()` si el resultado de la API de ejecución es exitoso (`result.executionSummary.success === true`).
- No afecta las integraciones externas ni las dependencias actuales.
