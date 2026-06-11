## ADDED Requirements

### Requirement: Compilación y Orquestación BDD
El orquestador SHALL ser capaz de transformar escenarios BDD en instrucciones ejecutables y orquestarlas vía HTTP.

#### Scenario: Compilación exitosa de Payload
- **WHEN** el usuario ejecuta `bdd-orchestrator run --features path/to/feature --env QA`
- **THEN** el sistema lee el AST del archivo feature usando `@cucumber/gherkin`
- **AND** cruza los pasos con las definiciones en los archivos `.steps.yaml`
- **AND** genera un payload validado mediante Zod
- **AND** envía el payload a la API de ejecución configurada, guardando la respuesta cruda en disco.
