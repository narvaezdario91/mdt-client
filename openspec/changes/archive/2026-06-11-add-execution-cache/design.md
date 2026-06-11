## Context

El proyecto base `GUI_MDT` guardaba la última ejecución exitosa en una estructura de carpetas anidada (`executions/cache/<feature_dir>/<feature_name>/<scenario_name>.json`). Esta caché se utilizaba como "Golden Copy" en futuras ejecuciones.
El usuario desea que se siga utilizando esta misma estructura anidada (Golden Copy) en el nuevo `mdt-orchestrator`.

## Goals / Non-Goals

**Goals:**
- Almacenar la respuesta exitosa en una carpeta local `executions/cache`.
- Replicar la estructura de carpetas original anidada (`executions/cache/<RutaRelativa>/<NombreFeature>/<NombreEscenario>.json`).
- Condicionar el almacenamiento de la caché únicamente a los escenarios que terminan con estado exitoso.

**Non-Goals:**
- Implementar la funcionalidad de reanudar o restaurar la ejecución desde la caché en este cambio (solo abordamos la escritura).

## Decisions

- **Estructura Anidada para la Caché:** Se creará una estructura en base al path original del archivo feature. Para ello, el compilador debe exponer la ruta relativa o el CLI debe calcularla y enviarla a `Storage`.
  - *Rationale*: Solicitado por el usuario para mantener paridad con el concepto de Golden Copy original. Previene colisiones de nombres.
- **Validación de Éxito:** Se leerá `result.executionSummary.success` de la respuesta de la API. 
  - *Rationale*: Es la bandera oficial de la API de ejecución que indica si los pasos del escenario se completaron exitosamente.

## Risks / Trade-offs

- **[Complejidad de Rutas]** → Requiere calcular la ruta relativa del feature respecto al directorio base de ejecución o al directorio de `scenarios/features/`.
  - *Mitigación*: Se calculará la ruta relativa en el CLI usando `path.relative` y se la pasará al método de Storage.
