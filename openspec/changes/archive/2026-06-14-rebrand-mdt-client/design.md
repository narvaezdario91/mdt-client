## Context

El proyecto MDT (Meta-Driven Testing) es un CLI en Node.js/TypeScript que orquesta pruebas BDD. Actualmente lleva el nombre interno `mdt-orchestrator` en package.json, la carpeta raíz, y el CLI (`bdd-orchestrator`). La sigla MDT se expande incorrectamente como "Model-Driven Testing" en el README. El proyecto carece de archivos estándar de un repositorio open-source profesional (LICENSE, CONTRIBUTING, CHANGELOG, .editorconfig) y el README no tiene identidad visual ni estructura moderna.

El autor es **Dario Narvaez** (GitHub: `narvaezdario91`). Aún no hay repositorio remoto publicado, por lo que este es el momento ideal para establecer la identidad correcta antes de la primera publicación.

## Goals / Non-Goals

**Goals:**
- Renombrar el proyecto a `mdt-client` en todos los archivos de configuración y código fuente.
- Corregir la expansión de la sigla MDT a "Meta-Driven Testing" en toda la documentación.
- Producir un README.md profesional con logo, badges, tabla de contenidos, quick start, y diagrama de arquitectura.
- Crear archivos estándar de proyecto open-source: LICENSE (MIT), CONTRIBUTING.md, CHANGELOG.md, .editorconfig.
- Completar metadata en package.json (description, author, keywords, license).
- Actualizar el nombre del comando CLI de `bdd-orchestrator` a `mdt-client`.

**Non-Goals:**
- Cambios funcionales en el código (parsers, reporters, cache, compiler, etc.).
- Migración o reestructuración de la arquitectura del código fuente.
- Publicación en npm o creación del repositorio remoto en GitHub (se hará después por el usuario).
- Internacionalización del README (se mantiene 100% en español).

## Decisions

### 1. Nombre del paquete: `mdt-client`
**Decisión**: Usar `mdt-client` como nombre en package.json y en el CLI.
**Alternativas consideradas**:
- `mdt-orchestrator` (nombre actual) — descartado porque el usuario quiere explícitamente renombrar.
- `mdt-cli` — descartado porque el proyecto es más que un CLI: incluye compilador, cache, reporteros.
- `meta-driven-testing` — demasiado largo para un nombre de paquete.
**Rationale**: `mdt-client` es corto, descriptivo, y refleja que es el componente cliente del ecosistema MDT.

### 2. Idioma del README: Español
**Decisión**: Mantener toda la documentación en español.
**Rationale**: El usuario lo solicitó explícitamente. Si en el futuro se quiere internacionalizar, se puede agregar un `README.en.md`.

### 3. Licencia: MIT
**Decisión**: Usar MIT en lugar de ISC (que estaba configurado en package.json).
**Rationale**: MIT es la licencia open-source más reconocida y ampliamente adoptada en el ecosistema de herramientas de desarrollo. El usuario lo confirmó explícitamente.

### 4. Logo del proyecto
**Decisión**: Almacenar el logo en `assets/logo.png` y referenciarlo en el README.
**Alternativas**: Usar un banner ASCII — descartado porque un logo gráfico da una impresión más profesional.
**Rationale**: Un logo visual en la cabecera del README es estándar en proyectos open-source de calidad.

### 5. Archivos de proyecto a crear
**Decisión**: Crear LICENSE, CONTRIBUTING.md, CHANGELOG.md y .editorconfig.
**Rationale**: Son los archivos mínimos esperados en un repositorio open-source profesional. No se incluye CODE_OF_CONDUCT.md por ahora para mantener el scope acotado.

### 6. Estructura del README
**Decisión**: Secciones en este orden: Logo → Badges → Descripción → Tabla de Contenidos → Quick Start → Configuración → CLI → Reportes → Arquitectura (Golden Copy + diagrama) → Estructura de Proyecto → Contribución → Licencia.
**Rationale**: Sigue convenciones de READMEs populares en GitHub. El quick start antes de la documentación detallada ayuda a la adopción rápida.

## Risks / Trade-offs

- **Renombre de carpeta raíz** → El agente no puede renombrar la carpeta del workspace. **Mitigación**: Documentar instrucción clara para que el usuario renombre `mdt-orchestrator/` → `mdt-client/` manualmente después de los cambios.
- **Links rotos en el README** → Al no tener repo remoto aún, los badges apuntarán a un repo que no existe. **Mitigación**: Usar badges estáticos (shields.io con datos hardcodeados) en lugar de badges dinámicos que dependen de un repo.
- **Logo generado puede no gustar** → La imagen es generada por IA. **Mitigación**: El logo se puede regenerar o reemplazar fácilmente en `assets/logo.png`.
