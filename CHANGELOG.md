# Changelog

Todos los cambios notables de este proyecto se documentarán en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/),
y este proyecto se adhiere a [Versionado Semántico](https://semver.org/lang/es/).

## [1.0.0] - 2025-06-14

### Agregado

- **CLI de orquestación** con Commander para ejecución de escenarios BDD.
- **Parser de Gherkin** para leer archivos `.feature` con soporte multi-escenario.
- **Resolver de YAML** para mapear pasos de lenguaje natural desde archivos `.steps.yaml`.
- **Compilador de Features** que genera payloads validados con Zod para la API de ejecución.
- **Cliente de API** (Axios) para enviar payloads a la Execution API.
- **Golden Copy (Cache Replay)** para inyección de ejecuciones exitosas previas a nivel de instrucción.
- **Escaneo recursivo de features** para procesar directorios completos de archivos `.feature`.
- **Sistema de Multi-Reporters** con patrón Strategy + Factory:
  - Reporter Cucumber JSON estándar.
  - Reporter HTML visual con `cucumber-html-reporter`.
  - Reporter Allure 2 con resultados acumulados y aislados por ejecución.
- **Configuración centralizada** vía `mdt.config.json` (API, rutas, ejecución, MCP).
- **MCP dinámico** configurable para soportar cualquier servidor MCP (Playwright, Selenium, etc.).
- **Registro crudo inmutable** (`raw-executions.json`) de cada ejecución para auditoría.
- **Variables dinámicas en pasos** con sintaxis `{{variable}}` para reutilización de datos entre pasos.
