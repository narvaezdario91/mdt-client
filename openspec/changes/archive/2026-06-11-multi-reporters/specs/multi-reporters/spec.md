## ADDED Requirements

### Requirement: Always Log Raw Execution
El sistema SHALL escribir siempre el arreglo crudo `rawExecutions` (como lo devuelve el API) en un archivo `raw-executions.json` dentro de la carpeta del `runId`.

### Requirement: Pluggable Reporters (Strategy/Factory)
El sistema SHALL permitir instanciar diferentes reportes visuales usando una fábrica y un patrón estrategia.
- **GIVEN** que el usuario pasa `--report cucumber,allure`
- **WHEN** finaliza la ejecución
- **THEN** el sistema debe generar tanto el JSON Legacy de Cucumber como los resultados de Allure.

### Requirement: Allure Results Generation
El sistema SHALL generar archivos JSON por cada escenario de prueba compatibles con `allure-commandline`.
