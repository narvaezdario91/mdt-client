## ADDED Requirements

### Requirement: Caché de ejecución exitosa
El sistema SHALL almacenar una copia local del payload resultante de la API de ejecución siempre y cuando el escenario haya sido exitoso.

#### Scenario: Guardado en cache de ejecución exitosa
- **WHEN** un escenario finaliza su ejecución y `result.executionSummary.success === true`
- **THEN** el sistema calcula la ruta relativa del archivo feature original
- **AND** guarda una copia en disco en la ruta `executions/cache/<ruta_relativa>/<featureName>/<scenarioName>.json` (sanitizando nombres)
- **AND** si la ejecución falló, el sistema omite el guardado en la caché
