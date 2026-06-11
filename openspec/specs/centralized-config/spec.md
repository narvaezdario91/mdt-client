## ADDED Requirements

### Requirement: Centralized Nested Configuration
El sistema SHALL leer un archivo de configuración estructurado en categorías para controlar parámetros del sistema sin hardcoding.

#### Scenario: Lectura de estructura anidada
- **GIVEN** que existe un archivo `mdt.config.json` con categorías `api`, `paths`, `execution`, `mcp`
- **WHEN** el usuario ejecuta el CLI
- **THEN** el sistema debe mapear estos valores a sus respectivas opciones internas.

#### Scenario: Inyección dinámica de MCP
- **GIVEN** una configuración de MCP válida
- **WHEN** el compilador ensambla el payload de ejecución
- **THEN** el bloque `mcp_config` debe provenir de la configuración y no estar quemado en el código fuente.
