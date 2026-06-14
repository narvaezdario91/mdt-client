# Project Docs

Especificación de los archivos estándar de proyecto open-source para MDT-CLIENT.

## Requirements

### Requirement: Archivo LICENSE MIT presente
El proyecto SHALL contener un archivo `LICENSE` en la raíz con la licencia MIT completa, año 2025-presente, y atribución a "Dario Narvaez".

#### Scenario: LICENSE existe y es válido
- **WHEN** se lee el archivo `LICENSE` en la raíz del proyecto
- **THEN** MUST contener el texto estándar de la licencia MIT
- **AND** MUST contener "Dario Narvaez" como titular de copyright
- **AND** MUST contener el año actual

### Requirement: Guía de contribución en español
El proyecto SHALL contener un archivo `CONTRIBUTING.md` en la raíz, escrito en español, con instrucciones para: reportar bugs, proponer features, enviar pull requests, y convenciones de código.

#### Scenario: CONTRIBUTING.md existe con secciones requeridas
- **WHEN** se lee el archivo `CONTRIBUTING.md`
- **THEN** MUST estar escrito en español
- **AND** MUST contener sección de reporte de bugs
- **AND** MUST contener sección de pull requests
- **AND** MUST contener convenciones de código

### Requirement: Historial de cambios inicial
El proyecto SHALL contener un archivo `CHANGELOG.md` en la raíz siguiendo el formato de [Keep a Changelog](https://keepachangelog.com/), con al menos una entrada para la versión 1.0.0.

#### Scenario: CHANGELOG.md existe con formato correcto
- **WHEN** se lee el archivo `CHANGELOG.md`
- **THEN** MUST seguir el formato "Keep a Changelog"
- **AND** MUST contener una entrada para la versión `1.0.0`
- **AND** MUST estar escrito en español

### Requirement: Configuración de editor consistente
El proyecto SHALL contener un archivo `.editorconfig` en la raíz que defina: indentación (2 espacios), charset (UTF-8), salto de línea final, y trim de espacios en blanco.

#### Scenario: .editorconfig existe con reglas básicas
- **WHEN** se lee el archivo `.editorconfig`
- **THEN** MUST definir `indent_style = space`
- **AND** MUST definir `indent_size = 2`
- **AND** MUST definir `charset = utf-8`
- **AND** MUST definir `insert_final_newline = true`

### Requirement: .gitignore incluye carpeta de agente
El archivo `.gitignore` SHALL incluir la entrada `.agent/` para excluir archivos de configuración del agente del control de versiones.

#### Scenario: .agent/ excluido del control de versiones
- **WHEN** se lee el archivo `.gitignore`
- **THEN** MUST contener una línea con `.agent/`
