## ADDED Requirements

### Requirement: Consolidación de resultados en formato Cucumber JSON
El sistema SHALL leer todos los archivos JSON crudos agrupados bajo un Run ID y generar un reporte unificado en el formato estándar Cucumber JSON.

#### Scenario: Generación exitosa de Cucumber Report
- **WHEN** el CLI finaliza la ejecución de los escenarios con la bandera `--report cucumber`
- **THEN** la clase CucumberReporter procesa los archivos en `executions/reports/<run_id>/raw/`
- **AND** mapea la metadata y estructura de steps al esquema Cucumber JSON
- **AND** guarda el archivo final en `executions/reports/<run_id>/cucumber-report.json`
