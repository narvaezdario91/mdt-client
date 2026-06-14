## Why

El proyecto actualmente se identifica como "MDT Orchestrator" con la sigla MDT expandida incorrectamente como "Model-Driven Testing". El nombre real es **Meta-Driven Testing** y el proyecto debe llamarse **MDT-CLIENT**. Además, el repositorio carece de archivos profesionales estándar (LICENSE, CONTRIBUTING.md, CHANGELOG.md) y el README actual, aunque funcional, no tiene la presentación profesional esperada para un proyecto open-source (sin logo, badges, tabla de contenidos, ni quick start).

## What Changes

- **Renombrar el proyecto** de `mdt-orchestrator` a `mdt-client` en todos los archivos de configuración y código.
- **Corregir la sigla MDT**: de "Model-Driven Testing" a "Meta-Driven Testing" en toda la documentación.
- **Reescribir README.md** con estándares profesionales: logo, badges, tabla de contenidos, quick start, diagrama de arquitectura y documentación completa.
- **Crear LICENSE** (MIT) con atribución a Dario Narvaez.
- **Crear CONTRIBUTING.md** con guía de contribución en español.
- **Crear CHANGELOG.md** con el historial inicial del proyecto.
- **Crear .editorconfig** para consistencia de formateo entre editores.
- **Actualizar package.json** con metadata completa (description, author, keywords, license).
- **Actualizar el CLI** para reflejar el nuevo nombre del proyecto.
- **Actualizar .gitignore** para incluir la carpeta `.agent/`.
- **Agregar logo** al proyecto en `assets/logo.png`.

## Capabilities

### New Capabilities
- `project-branding`: Identidad visual y textual del proyecto (logo, nombre MDT-CLIENT, sigla Meta-Driven Testing) aplicada en README, CLI y configuración.
- `project-docs`: Archivos estándar de proyecto open-source (LICENSE MIT, CONTRIBUTING.md, CHANGELOG.md, .editorconfig).

### Modified Capabilities
_(Ninguna capacidad existente cambia a nivel de requisitos funcionales. Los cambios son de identidad y documentación.)_

## Impact

- **package.json**: Campos `name`, `description`, `author`, `license`, `keywords` actualizados.
- **src/cli/index.ts**: Nombre y descripción del comando CLI actualizados (líneas 29-31).
- **README.md**: Reescritura completa.
- **.gitignore**: Adición menor de `.agent/`.
- **Archivos nuevos**: `LICENSE`, `CONTRIBUTING.md`, `CHANGELOG.md`, `.editorconfig`, `assets/logo.png`.
- **Renombre de carpeta**: `mdt-orchestrator/` → `mdt-client/` (acción manual del usuario).
