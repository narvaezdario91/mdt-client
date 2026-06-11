# MDT Orchestrator (Model-Driven Testing)

MDT Orchestrator es una herramienta CLI construida en Node.js diseñada para ejecutar pruebas de Comportamiento Guiado por Desarrollo (BDD) de manera ágil e inteligente. 

Se encarga de parsear escenarios Gherkin (`.feature`) y mapear sus pasos utilizando definiciones en archivos YAML (`.steps.yaml`). Luego, compila estos datos en un Payload que se envía a una API de Ejecución central, la cual, a través de servidores MCP (Model Context Protocol) como Playwright o Selenium, convierte las instrucciones de lenguaje natural en automatización web real.

## Características Principales

- **Configuración Centralizada:** Control total mediante `mdt.config.json` (rutas, endpoints, clientes MCP).
- **Golden Copy (Cache Replay):** Inyección a nivel de instrucciones de ejecuciones exitosas previas para omitir pasos ya validados y acelerar la ejecución de pruebas.
- **MCP Dinámico:** Configuración inyectable para soportar cualquier tipo de servidor MCP sin tocar el código fuente.
- **Reportes Nativos:** Soporte para generar reportes en formato Cucumber para ser integrados con herramientas CI/CD o generadores HTML.

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
| `--report <format>` | Genera un reporte tras la ejecución (e.g., `cucumber`). | *Ninguno* |

### Generar Reporte Cucumber

Para procesar los resultados JSON crudos de una ejecución y emitir un reporte compatible con el estándar Cucumber:

```bash
npm run dev run -- --report cucumber
```
Esto generará un archivo `cucumber-report.json` en el directorio de la ejecución dentro de `paths.reports`.

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
