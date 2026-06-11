## Context

Se ha acordado implementar una estructura de configuración anidada que permita el crecimiento futuro del orquestador, e inyectar configuraciones dinámicas en componentes como el compilador (específicamente la configuración de MCP).

## Goals / Non-Goals

**Goals:**
- Estructura JSON anidada: `api`, `paths`, `execution`, `mcp`.
- Inyectar el bloque `mcp` al compilador para que no dependa de Playwright por defecto a nivel de código.
- CLI lee la configuración y mantiene precedencia sobre los flags.

**Non-Goals:**
- Soporte para variables de entorno (ej. `.env`) en esta iteración.
- Refactorización mayor del ciclo de ejecución.

## Decisions

1. **Config Structure**:
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
    "useCache": true
  },
  "mcp": {
    "type": "stdio",
    "command": "npx",
    "args": ["-y", "@playwright/mcp"]
  }
}
```
2. **Inyección de MCP Config**: El `FeatureCompiler` recibirá el objeto `mcpConfig` en su constructor, y lo usará al momento de ensamblar el `Payload`.

## Risks / Trade-offs
- Si la configuración del MCP está mal formada en el `mdt.config.json`, la API fallará al inicializar el agente. *Trade-off*: El esquema del payload ya valida que `mcp_config` sea un registro clave-valor genérico. Conviene agregar un pequeño try/catch o fallback en el CLI.
