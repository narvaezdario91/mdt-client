## Why

Actualmente, el orquestador BDD está escrito en Python (`GUI_MDT`). Aunque funciona de manera estable, el ecosistema de Node.js es el estándar de la industria para herramientas de automatización web y procesamiento de JSON asíncrono. Migrar la capa de orquestación a Node.js (manteniendo la API de ejecución en Python) nos permitirá aprovechar herramientas nativas (como `cucumber-html-reporter` o librerías de AST oficiales) y adoptar Arquitectura Limpia estricta usando TypeScript en un repositorio independiente.

## What Changes

- Creación del repositorio y andamiaje de un proyecto Node.js.
- Configuración de TypeScript con comprobación estricta de tipos.
- Adopción de `zod` para validación de esquemas y `commander` para la interfaz de línea de comandos (CLI).
- Implementación de la estructura de carpetas (Clean Architecture): `cli/`, `core/`, `parsers/`, `models/`, `reporters/`.

## Capabilities

### New Capabilities
- `node-orchestrator-cli`: Un nuevo CLI escrito en TypeScript capaz de servir como punto de partida para reemplazar al actual `bdd_parser`.

## Impact

- Este repositorio será el nuevo "Frontend / Orquestador".
- Cero impacto en el servidor de ejecución actual en Python (seguirán comunicándose vía JSON HTTP).
