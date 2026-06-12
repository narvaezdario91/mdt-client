## MODIFIED Requirements

### Requirement: Allure Results Generation
El sistema SHALL generar archivos JSON por cada escenario de prueba compatibles con `allure-commandline`.

#### Scenario: Generación de resultados Allure con detalles
- **WHEN** el CLI finaliza la ejecución de los escenarios y se procesa el reportero Allure
- **THEN** la clase AllureReporter mapea los pasos e instrucciones a la estructura de Allure
- **AND** genera archivos físicos de attachment en formato Markdown (`-attachment.md`) en el directorio de resultados de Allure con la información de `execution.details` para cada instrucción, procesando la I/O de manera secuencial segura
- **AND** asocia cada archivo generado en la lista de `attachments` de la instrucción correspondiente especificando el tipo de contenido como `text/markdown`
- **AND** inyecta la herramienta y los argumentos ejecutados como parámetros del subpaso de Allure
