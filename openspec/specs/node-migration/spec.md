## ADDED Requirements

### Requirement: Andamiaje Node.js y CLI
El sistema SHALL inicializar un repositorio Node.js con TypeScript, capaz de compilar y ejecutar un CLI básico.

#### Scenario: Instalación y ejecución exitosa
- **WHEN** el desarrollador hace `npm run build` y luego `npm start`
- **THEN** el proyecto TypeScript se compila sin errores hacia el directorio `dist/`
- **AND** el CLI muestra un mensaje de bienvenida en consola, indicando que el orquestador está inicializado.
