## MODIFIED Requirements

### Requirement: Compilación y Orquestación BDD
El orquestador SHALL ser capaz de transformar escenarios BDD en instrucciones ejecutables y orquestarlas vía HTTP, agrupando sus resultados.

#### Scenario: Compilación exitosa de Payload
- **WHEN** el usuario ejecuta `bdd-orchestrator run --features path/to/feature --report cucumber`
- **THEN** el sistema lee el AST del archivo feature usando `@cucumber/gherkin`
- **AND** cruza los pasos con las definiciones en los archivos `.steps.yaml`
- **AND** genera un payload validado mediante Zod
- **AND** envía el payload a la API de ejecución configurada
- **AND** el Storage guarda la respuesta cruda en disco agrupada bajo el directorio del Run ID generado para la corrida.
