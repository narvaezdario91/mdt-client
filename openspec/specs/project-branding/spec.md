# Project Branding

Especificación de la identidad visual y textual del proyecto MDT-CLIENT (Meta-Driven Testing).

## Requirements

### Requirement: Nombre del proyecto es MDT-CLIENT
El proyecto SHALL identificarse como `mdt-client` en todos los archivos de configuración (package.json `name`), el CLI (Commander `.name()`), y la documentación (README.md).

#### Scenario: package.json refleja el nombre correcto
- **WHEN** se inspecciona el campo `name` en package.json
- **THEN** el valor MUST ser `mdt-client`

#### Scenario: CLI muestra el nombre correcto
- **WHEN** se ejecuta `mdt-client --help`
- **THEN** el nombre mostrado MUST ser `mdt-client`

#### Scenario: README usa el nombre correcto
- **WHEN** se lee el README.md
- **THEN** el título principal MUST contener "MDT-CLIENT"

### Requirement: Sigla MDT expande a Meta-Driven Testing
Toda referencia a la sigla MDT en documentación SHALL expandirse como "Meta-Driven Testing". No MUST existir ninguna instancia de "Model-Driven Testing" en el proyecto.

#### Scenario: README usa la expansión correcta
- **WHEN** se busca "Model-Driven Testing" en cualquier archivo del proyecto
- **THEN** no MUST encontrarse ninguna coincidencia

#### Scenario: Expansión correcta presente en README
- **WHEN** se lee el README.md
- **THEN** MUST contener "Meta-Driven Testing" como expansión de la sigla

### Requirement: Logo del proyecto visible en README
El README.md SHALL mostrar el logo del proyecto centrado en la cabecera, referenciando la imagen desde `assets/logo.png`.

#### Scenario: Logo presente y referenciado
- **WHEN** se renderiza el README.md
- **THEN** MUST mostrarse una imagen del logo en la cabecera del documento

### Requirement: README contiene badges informativos
El README.md SHALL incluir badges estáticos que indiquen: versión de Node.js mínima, lenguaje TypeScript, tipo de licencia (MIT) y versión del proyecto.

#### Scenario: Badges visibles en README
- **WHEN** se renderiza el README.md
- **THEN** MUST mostrarse al menos 4 badges (Node.js, TypeScript, License, Version)

### Requirement: README contiene tabla de contenidos
El README.md SHALL incluir una tabla de contenidos navegable con links a cada sección principal.

#### Scenario: Tabla de contenidos funcional
- **WHEN** se hace clic en un enlace de la tabla de contenidos
- **THEN** MUST navegar a la sección correspondiente del documento

### Requirement: README contiene sección Quick Start
El README.md SHALL incluir una sección de inicio rápido que permita a un usuario nuevo ejecutar su primera prueba en menos de 5 pasos.

#### Scenario: Quick Start completo
- **WHEN** se lee la sección Quick Start
- **THEN** MUST contener pasos numerados desde la clonación hasta la ejecución

### Requirement: README contiene diagrama de arquitectura
El README.md SHALL incluir un diagrama visual (ASCII o Mermaid) que muestre el flujo de ejecución del orquestador: parseo → compilación → API → reportes.

#### Scenario: Diagrama presente
- **WHEN** se lee la sección de arquitectura del README
- **THEN** MUST contener un diagrama que ilustre el flujo del sistema

### Requirement: Metadata de package.json completa
El archivo package.json SHALL contener campos `description`, `author`, `keywords` y `license` con valores válidos y descriptivos.

#### Scenario: Campos de metadata presentes
- **WHEN** se inspecciona package.json
- **THEN** `description` MUST ser una descripción no vacía del proyecto
- **AND** `author` MUST contener "Dario Narvaez"
- **AND** `license` MUST ser "MIT"
- **AND** `keywords` MUST contener al menos 3 términos relevantes

### Requirement: Nombre del CLI actualizado en código fuente
El archivo `src/cli/index.ts` SHALL usar `mdt-client` como nombre del programa Commander y una descripción que mencione "Meta-Driven Testing".

#### Scenario: CLI configurado correctamente
- **WHEN** se inspecciona la configuración de Commander en `src/cli/index.ts`
- **THEN** `.name()` MUST ser `mdt-client`
- **AND** `.description()` MUST contener "Meta-Driven Testing"
