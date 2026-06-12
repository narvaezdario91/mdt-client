## MODIFIED Requirements

### Requirement: Consolidación de resultados en formato Cucumber JSON
El sistema SHALL leer todos los archivos JSON crudos agrupados bajo un Run ID y generar un reporte unificado en el formato estándar Cucumber JSON.

#### Scenario: Generación exitosa de Cucumber Report
- **WHEN** el CLI finaliza la ejecución de los escenarios con la bandera `--report cucumber`
- **THEN** la clase CucumberReporter procesa los archivos en `executions/reports/<run_id>/raw/`
- **AND** mapea la metadata y estructura de steps al esquema Cucumber JSON
- **AND** calcula el estado real (`passed`, `failed`, `skipped`) de cada step analizando secuencialmente el estado de sus instrucciones, implementando una salvaguarda para asignar el estado fallido (con el errorSummary) al paso correspondiente si el escenario falla globalmente pero no presenta instrucciones fallidas
- **AND** distribuye equitativamente la duración total del escenario entre los pasos que fueron ejecutados
- **AND** formatea e incrusta el detalle de ejecución (`execution.details`) de cada instrucción como embeddings de tipo `text/plain` codificados en Base64 en los respectivos pasos
- **AND** guarda el archivo final en `executions/reports/<run_id>/cucumber-report.json`
