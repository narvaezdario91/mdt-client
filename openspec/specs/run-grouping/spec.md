# Capability: run-grouping

## Purpose
TBD

## Requirements

### Requirement: Agrupación de ejecuciones mediante Run ID global
El sistema SHALL generar un identificador único (Run ID) al inicio de la ejecución del CLI, y utilizarlo para agrupar todos los JSONs de resultados resultantes de esa corrida.

#### Scenario: Guardado de resultados bajo Run ID
- **WHEN** el usuario inicia una ejecución de pruebas
- **THEN** el CLI genera un `run_id` (ej. basado en timestamp)
- **AND** Storage utiliza la ruta `executions/reports/<run_id>/raw/<featureName>.json` para persistir los payloads ejecutados.
