# MDT Orchestrator (Model-Driven Testing)

MDT Orchestrator es una herramienta CLI construida en Node.js diseñada para ejecutar pruebas de Comportamiento Guiado por Desarrollo (BDD) de manera ágil e inteligente. 

Se encarga de parsear escenarios Gherkin (`.feature`) y mapear sus pasos utilizando definiciones en archivos YAML (`.steps.yaml`). Luego, compila estos datos en un Payload que se envía a una API de Ejecución central, la cual, a través de servidores MCP (Model Context Protocol) como Playwright o Selenium, convierte las instrucciones de lenguaje natural en automatización web real.

## Características Principales

- **Configuración Centralizada:** Control total mediante `mdt.config.json` (rutas, endpoints, clientes MCP).
- **Golden Copy (Cache Replay):** Inyección a nivel de instrucciones de ejecuciones exitosas previas para omitir pasos ya validados y acelerar la ejecución de pruebas.
- **MCP Dinámico:** Configuración inyectable para soportar cualquier tipo de servidor MCP sin tocar el código fuente.
- **Reportes Múltiples (Multi-Reporters):** Generación pluggable de reportes (Cucumber JSON, HTML visual, Allure 2) y almacenamiento inmutable de logs crudos del API.

---

## Requisitos Previos

- [Node.js](https://nodejs.org/) v18+
- [Execution API](https://github.com/tu-usuario/openspec-api) corriendo localmente (por defecto en `http://localhost:8000`).

---

## Instalación

Clona el repositorio e instala las dependencias:

```bash
git clone <repo-url>
cd mdt-orchestrator
npm install
```

---

## Configuración (`mdt.config.json`)

Para evitar enviar parámetros constantemente a través del CLI, puedes crear un archivo `mdt.config.json` en la raíz del proyecto. Este archivo rige el comportamiento completo del framework:

```json
{
  "api": {
    "url": "http://localhost:8000"
  },
  "paths": {
    "features": "scenarios/features",
    "steps": "scenarios/steps",
    "reports": "executions/reports",
    "cache": "executions/cache"
  },
  "execution": {
    "useCache": true,
    "report": "cucumber"
  },
  "mcp": {
    "type": "stdio",
    "command": "npx",
    "args": ["-y", "@playwright/mcp"]
  }
}
```

---

## Ejecución Básica

Si ya tienes configurado tu `mdt.config.json`, simplemente ejecuta:

```bash
npm run dev run
```

Si prefieres usar comandos explícitos o sobrescribir la configuración, puedes pasar flags al CLI:

```bash
npm run dev run -- --features escenarios/features/mi_prueba.feature --steps escenarios/steps --api-url http://localhost:8000
```

---

## Opciones y Flags del CLI

| Flag | Descripción | Default (si no está en config) |
|------|-------------|--------------------------------|
| `-f, --features <path>` | Ruta a un archivo o directorio `.feature`. | *Requerido* |
| `-s, --steps <path>` | Ruta al directorio que contiene los archivos `.steps.yaml`. | *Requerido* |
| `-u, --api-url <url>` | URL de la API de Ejecución (Execution API). | `http://localhost:8000` |
| `--no-cache` | Desactiva el Golden Copy (re-ejecuta todo desde cero ignorando cachés). | *Falso* |
| `--report <formats>` | Genera reportes de ejecución en múltiples formatos separados por comas (e.g., `cucumber,html,allure`). | *Ninguno* |

## Sistema de Reportes (Multi-Reporters)

El framework incluye un sistema de reportes extensible que utiliza los patrones de diseño *Strategy* y *Factory* para permitir la generación simultánea de múltiples reportes de ejecución.

### Formatos Soportados

1. **Cucumber JSON (`cucumber`)**: Genera el archivo estándar `cucumber-report.json` compatible con herramientas CI/CD y visores tradicionales.
2. **HTML Básico (`html`)**: Produce un reporte HTML visual interactivo e independiente (`cucumber-report.html`) utilizando la librería `cucumber-html-reporter`.
3. **Allure 2 (`allure`)**: Genera archivos JSON de resultados compatibles con Allure 2 en la carpeta `allure-results/` a nivel de raíz y de ejecución, listos para servir con `allure serve`.

### Registro Crudo Inmutable (Raw execution log)

Independientemente de los reporteros seleccionados, el orquestador **siempre** guarda el log exacto de lo que retornó la API de ejecución en un archivo llamado `raw-executions.json` dentro de la carpeta del Run ID correspondiente para fines de auditoría e historial.

### Ejemplos de Uso

Generar múltiples reportes de forma simultánea:
```bash
npm run dev run -- --report cucumber,html,allure
```

También puedes especificar el reporte por defecto en tu archivo de configuración `mdt.config.json`:
```json
  "execution": {
    "useCache": true,
    "report": "cucumber,html,allure"
  }
```

### Rutas de Salida de Reportes

Los reportes se organizan de forma estructurada en el directorio correspondiente a cada ejecución:
- **Resultados Crudos**: `executions/reports/run_<timestamp>/raw-executions.json`
- **Cucumber JSON**: `executions/reports/run_<timestamp>/cucumber-report.json`
- **Reporte HTML**: `executions/reports/run_<timestamp>/cucumber-report.html`
- **Allure 2 Results**: `allure-results/` (acumulado a nivel raíz) y `executions/reports/run_<timestamp>/allure-results/` (aislado por ejecución)

### Visualización de Reportes Allure

Dado que Allure 2 genera archivos JSON de resultados independientes por cada escenario, se requiere la herramienta de línea de comandos de Allure para compilar y visualizar el reporte final en el navegador:

1. **Instalación de Allure CLI** (si no lo tienes instalado):
   - **Vía NPM** (Global o de desarrollo):
     ```bash
     npm install -g allure-commandline
     ```
   - **macOS** (Homebrew): `brew install allure`
   - **Windows** (Scoop): `scoop install allure`

2. **Servir el reporte interactivo**:
   Ejecuta el siguiente comando en la raíz del proyecto para levantar un servidor web local temporal que cargue y muestre el panel interactivo de Allure:
   ```bash
   allure serve allure-results
   ```

3. **Generar reporte estático**:
   Si quieres exportar un sitio web estático autocontenido del reporte (por ejemplo, para integradores CI/CD o servidores web estáticos):
   ```bash
   allure generate allure-results --clean -o allure-report
   ```
   Esto creará la carpeta estática `allure-report/`.

---

## Estructura de Proyecto Sugerida

```text
mdt-orchestrator/
├── src/                    # Código fuente del CLI y Orchestrator
├── scenarios/
│   ├── features/           # Archivos Gherkin (.feature)
│   └── steps/              # Definiciones en Lenguaje Natural (.steps.yaml)
├── executions/
│   ├── reports/            # Reportes y resultados en bruto por ejecución (Run ID)
│   └── cache/              # Archivos Golden Copy (ejecuciones exitosas reusables)
├── mdt.config.json         # Configuración centralizada
└── package.json            # Dependencias y scripts
```

## Arquitectura de Golden Copy (Cache Replay)

El orquestador optimiza masivamente el tiempo de ejecución mediante un algoritmo de *Merge a Nivel de Instrucción*:

1. **Lectura**: Al compilar un escenario, el orquestador busca si existe un caché previo en `paths.cache`.
2. **Comparación Fina**: Hace *match* del texto de cada paso (Gherkin) y de cada instrucción interna de YAML.
3. **Inyección**: Si los textos coinciden exactamente con la ejecución exitosa anterior, inyecta el estado `success` y el código generado por la API subyacente.
4. **Interrupción**: En el primer desvío (modificaste una palabra en el `.feature` o el `.steps.yaml`), el orquestador deja de inyectar caché para obligar a la API a ejecutar en tiempo real el nuevo flujo.
