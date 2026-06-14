<p align="center">
  <img src="assets/logo.png" alt="MDT-CLIENT Logo" width="200">
</p>

<h1 align="center">MDT-CLIENT</h1>

<p align="center">
  <strong>Meta-Driven Testing — Cliente CLI de Orquestación</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen?style=flat-square&logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/TypeScript-5+-blue?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/licencia-MIT-green?style=flat-square" alt="Licencia MIT">
  <img src="https://img.shields.io/badge/versión-1.0.0-orange?style=flat-square" alt="Versión">
</p>

<p align="center">
  MDT-CLIENT es una herramienta CLI construida en Node.js que ejecuta pruebas BDD de manera ágil e inteligente.<br>
  Parsea escenarios Gherkin (<code>.feature</code>), mapea pasos con definiciones YAML (<code>.steps.yaml</code>),<br>
  y orquesta la automatización web a través de servidores MCP (Model Context Protocol).
</p>

---

## 📋 Tabla de Contenidos

- [Quick Start](#-quick-start)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#%EF%B8%8F-configuración)
- [Uso del CLI](#-uso-del-cli)
- [Sistema de Reportes](#-sistema-de-reportes)
- [Arquitectura](#-arquitectura)
- [Golden Copy (Cache Replay)](#-golden-copy-cache-replay)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

---

## 🚀 Quick Start

Pon MDT-CLIENT en funcionamiento en **4 pasos**:

```bash
# 1. Clonar el repositorio
git clone https://github.com/narvaezdario91/mdt-client.git
cd mdt-client

# 2. Instalar dependencias
npm install

# 3. Configurar (verificar que la Execution API esté corriendo)
# El archivo mdt.config.json ya viene preconfigurado con valores por defecto

# 4. Ejecutar tus escenarios
npm run dev run
```

> 💡 **Tip:** Asegúrate de que tu [Execution API](https://github.com/narvaezdario91/mdt-client) esté corriendo en `http://localhost:8000` antes de ejecutar.

---

## 📦 Requisitos Previos

| Requisito | Versión |
|-----------|---------|
| [Node.js](https://nodejs.org/) | v18+ |
| Execution API | Corriendo localmente (por defecto en `http://localhost:8000`) |

---

## 📥 Instalación

```bash
git clone https://github.com/narvaezdario91/mdt-client.git
cd mdt-client
npm install
```

Para compilar el proyecto a JavaScript:

```bash
npm run build
```

---

## ⚙️ Configuración

MDT-CLIENT se configura mediante un archivo `mdt.config.json` en la raíz del proyecto. Este archivo controla el comportamiento completo del framework:

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

### Detalle de Campos

| Sección | Campo | Descripción | Default |
|---------|-------|-------------|---------|
| `api` | `url` | URL de la API de Ejecución | `http://localhost:8000` |
| `paths` | `features` | Ruta a archivos/directorio `.feature` | — |
| `paths` | `steps` | Ruta al directorio de archivos `.steps.yaml` | — |
| `paths` | `reports` | Directorio de salida de reportes | `executions/reports` |
| `paths` | `cache` | Directorio de Golden Copy (cache) | `executions/cache` |
| `execution` | `useCache` | Activar/desactivar Cache Replay | `true` |
| `execution` | `report` | Formatos de reporte (separados por coma) | — |
| `mcp` | `type` | Tipo de conexión MCP | `stdio` |
| `mcp` | `command` | Comando para iniciar el servidor MCP | — |
| `mcp` | `args` | Argumentos del comando MCP | — |

---

## 💻 Uso del CLI

### Ejecución Básica

Si tienes configurado `mdt.config.json`, simplemente ejecuta:

```bash
npm run dev run
```

### Sobrescribir Configuración con Flags

```bash
npm run dev run -- --features scenarios/features/mi_prueba.feature --steps scenarios/steps --api-url http://localhost:8000
```

### Flags Disponibles

| Flag | Descripción | Default |
|------|-------------|---------|
| `-f, --features <path>` | Ruta a un archivo o directorio `.feature` | *Desde config* |
| `-s, --steps <path>` | Ruta al directorio de archivos `.steps.yaml` | *Desde config* |
| `-u, --api-url <url>` | URL de la API de Ejecución | `http://localhost:8000` |
| `--no-cache` | Desactiva Golden Copy (re-ejecuta todo desde cero) | `false` |
| `--report <formats>` | Formatos de reporte separados por coma (e.g., `cucumber,html,allure`) | *Desde config* |

---

## 📊 Sistema de Reportes

MDT-CLIENT incluye un sistema de reportes extensible que utiliza los patrones de diseño **Strategy** y **Factory** para generar múltiples reportes de forma simultánea.

### Formatos Soportados

| Formato | Clave | Descripción |
|---------|-------|-------------|
| **Cucumber JSON** | `cucumber` | Archivo estándar `cucumber-report.json` compatible con CI/CD |
| **HTML Visual** | `html` | Reporte HTML interactivo e independiente (`cucumber-report.html`) |
| **Allure 2** | `allure` | Resultados JSON compatibles con Allure 2 en `allure-results/` |

### Uso

```bash
# Un solo formato
npm run dev run -- --report cucumber

# Múltiples formatos simultáneos
npm run dev run -- --report cucumber,html,allure
```

O configúralo por defecto en `mdt.config.json`:

```json
{
  "execution": {
    "report": "cucumber,html,allure"
  }
}
```

### Registro Crudo Inmutable

Independientemente de los reporteros seleccionados, MDT-CLIENT **siempre** guarda el log exacto de lo retornado por la API en `raw-executions.json` dentro de la carpeta del Run ID, para fines de auditoría e historial.

### Rutas de Salida

| Reporte | Ruta |
|---------|------|
| Resultados crudos | `executions/reports/run_<timestamp>/raw-executions.json` |
| Cucumber JSON | `executions/reports/run_<timestamp>/cucumber-report.json` |
| HTML | `executions/reports/run_<timestamp>/cucumber-report.html` |
| Allure (por ejecución) | `executions/reports/run_<timestamp>/allure-results/` |
| Allure (acumulado) | `allure-results/` |

### Visualización de Reportes Allure

```bash
# Instalar Allure CLI (si no lo tienes)
npm install -g allure-commandline

# Servir reporte interactivo
allure serve allure-results

# Generar sitio estático
allure generate allure-results --clean -o allure-report
```

---

## 🏗️ Arquitectura

MDT-CLIENT sigue un flujo de ejecución lineal y modular:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        FLUJO DE EJECUCIÓN MDT-CLIENT                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────┐    ┌──────────────┐    ┌──────────────┐    ┌───────────┐ │
│  │  Gherkin  │───▶│  Compilador  │───▶│ API Client   │───▶│ Reporters │ │
│  │ .feature  │    │  + YAML      │    │   (Axios)    │    │ (Strategy)│ │
│  └──────────┘    └──────┬───────┘    └──────────────┘    └───────────┘ │
│                         │                                               │
│                         ▼                                               │
│                  ┌──────────────┐                                        │
│                  │ Cache Replay │  ◀── Inyección de Golden Copy          │
│                  │  (Optimizer) │      a nivel de instrucción            │
│                  └──────────────┘                                        │
│                                                                         │
│  Módulos:                                                               │
│  ├── src/parsers/     → Gherkin Parser + YAML Resolver                 │
│  ├── src/core/        → Compiler, API Client, Cache Replay, Storage    │
│  ├── src/models/      → Schemas (Zod) + Config Types                   │
│  └── src/reporters/   → Cucumber, HTML, Allure (Factory + Strategy)    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Flujo Paso a Paso

1. **Parseo**: Lee archivos `.feature` (Gherkin) y resuelve las definiciones de pasos desde `.steps.yaml`.
2. **Compilación**: Genera un payload estructurado y validado con Zod.
3. **Cache Replay**: Si hay Golden Copy disponible, inyecta resultados exitosos previos a nivel de instrucción.
4. **Ejecución**: Envía el payload a la Execution API, que utiliza servidores MCP para la automatización.
5. **Almacenamiento**: Guarda resultados crudos y actualiza el cache si la ejecución fue exitosa.
6. **Reportes**: Genera reportes en los formatos solicitados usando el patrón Strategy + Factory.

---

## 📦 Golden Copy (Cache Replay)

MDT-CLIENT optimiza los tiempos de ejecución mediante un algoritmo de **Merge a Nivel de Instrucción**:

```
┌──────────────────────────────────────────────────────┐
│              ALGORITMO DE CACHE REPLAY                │
├──────────────────────────────────────────────────────┤
│                                                       │
│  1. LECTURA                                          │
│     Busca caché previo en paths.cache                │
│                  │                                    │
│                  ▼                                    │
│  2. COMPARACIÓN FINA                                 │
│     Match del texto de cada paso e instrucción       │
│                  │                                    │
│         ┌───────┴───────┐                            │
│         ▼               ▼                            │
│    ¿Coincide?     ¿Desvío?                           │
│         │               │                            │
│         ▼               ▼                            │
│  3. INYECCIÓN    4. INTERRUPCIÓN                     │
│     Inyecta         Deja de inyectar                 │
│     success +       caché, API ejecuta               │
│     código          en tiempo real                   │
│     generado                                         │
│                                                       │
└──────────────────────────────────────────────────────┘
```

- **Lectura**: Al compilar un escenario, busca si existe un caché previo.
- **Comparación Fina**: Hace match del texto de cada paso (Gherkin) y cada instrucción interna de YAML.
- **Inyección**: Si los textos coinciden exactamente con la ejecución exitosa anterior, inyecta el estado `success` y el código generado.
- **Interrupción**: En el primer desvío (modificación en `.feature` o `.steps.yaml`), deja de inyectar caché para forzar ejecución real.

---

## 📁 Estructura del Proyecto

```
mdt-client/
├── src/
│   ├── cli/                # Punto de entrada CLI (Commander)
│   │   └── index.ts        # Configuración de comandos y flujo principal
│   ├── core/
│   │   ├── api-client.ts   # Cliente HTTP para la Execution API
│   │   ├── cache-replay.ts # Algoritmo de Golden Copy
│   │   ├── compiler.ts     # Compilador de Features → Payload
│   │   └── storage.ts      # Gestión de archivos (reportes, cache)
│   ├── models/
│   │   ├── config.ts       # Tipos de configuración (MDTConfig)
│   │   └── payload.schema.ts # Schema Zod para validación de payloads
│   ├── parsers/
│   │   ├── gherkin-parser.ts # Parser de archivos .feature
│   │   └── yaml-resolver.ts  # Resolver de definiciones .steps.yaml
│   └── reporters/
│       ├── allure.ts       # Reporter Allure 2
│       ├── cucumber.ts     # Reporter Cucumber JSON
│       ├── factory.ts      # Factory de reporters
│       ├── html.ts         # Reporter HTML visual
│       └── reporter.interface.ts # Interfaz común de reporters
├── scenarios/
│   ├── features/           # Archivos Gherkin (.feature)
│   └── steps/              # Definiciones de pasos (.steps.yaml)
├── executions/
│   ├── reports/            # Reportes por ejecución (Run ID)
│   └── cache/              # Golden Copy (ejecuciones exitosas)
├── assets/
│   └── logo.png            # Logo del proyecto
├── mdt.config.json         # Configuración centralizada
├── tsconfig.json           # Configuración TypeScript
├── package.json            # Dependencias y scripts
├── LICENSE                 # Licencia MIT
├── CONTRIBUTING.md         # Guía de contribución
└── CHANGELOG.md            # Historial de cambios
```

---

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Por favor lee la [Guía de Contribución](CONTRIBUTING.md) para conocer las pautas del proyecto.

---

## 📄 Licencia

Este proyecto está licenciado bajo la **Licencia MIT**. Consulta el archivo [LICENSE](LICENSE) para más detalles.

---

<p align="center">
  Desarrollado con ❤️ por <a href="https://github.com/narvaezdario91">Dario Narvaez</a>
</p>
