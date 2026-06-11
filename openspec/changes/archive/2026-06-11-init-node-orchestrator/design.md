## Context

Necesitamos establecer un esqueleto de proyecto robusto para `mdt-orchestrator` en Node.js que facilite el desarrollo a futuro de las funcionalidades BDD.

## Goals / Non-Goals

**Goals:**
- Configurar un andamiaje base en TypeScript que siga las mejores prácticas de la industria.
- Establecer una arquitectura de carpetas escalable y un sistema de scripts de NPM básicos (`build`, `start`).

**Non-Goals:**
- No programaremos todavía la lógica de parseo de Gherkin ni el cliente HTTP; este cambio es estrictamente para andamiaje y dependencias iniciales.

## Decisions

**1. Lenguaje y Herramientas Base**
- **Decisión:** Usar TypeScript estricto.
- **Rationale:** TS garantiza mantenibilidad. Dependencias: `commander` (CLI), `zod` (Validación de Payload), `yaml` y `@cucumber/gherkin` (Parsers).

**2. Convenciones de Nomenclatura**
- **Decisión:** `kebab-case` para archivos/directorios. `PascalCase` para Clases/Interfaces. `camelCase` para variables.
- **Rationale:** Estándar moderno de la comunidad Node/TS.

**3. Compilación**
- **Decisión:** Usar el compilador oficial `tsc` y emitir a un directorio `dist/`.
- **Rationale:** Mantiene el proyecto sin dependencias pesadas de bundlers hasta que sea estrictamente necesario.

## Risks / Trade-offs

- **Risk:** Fricción inicial por la configuración estricta de TypeScript.
  - **Mitigation:** Crearemos un `tsconfig.json` muy claro con las exclusiones correctas y tipos `@types/node`.
