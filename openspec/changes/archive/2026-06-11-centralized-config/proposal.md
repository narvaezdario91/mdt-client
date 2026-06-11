## Why

Actualmente, el orquestador tiene varios valores *hardcodeados* (como el `mcp_config` en el compilador o la carpeta base de reportes) y la configuración inicial introducida (`mdt.config.json`) solo contempla variables básicas. Para que el proyecto pueda crecer y soportar distintos clientes MCP (Playwright, Selenium, Appium) y personalizar rutas, se necesita expandir la configuración centralizada.

## What Changes

- Refactorizar la interfaz `MDTConfig` a una estructura anidada y categorizada (`api`, `paths`, `execution`, `mcp`).
- Actualizar `src/cli/index.ts` para leer y fusionar esta nueva estructura, haciendo fallback a valores por defecto.
- Extraer el `mcp_config` del compilador (`src/core/compiler.ts`) para que sea inyectado dinámicamente desde la configuración.
- Asegurarse de que `Storage` y otros módulos utilicen las rutas dinámicas provistas por la configuración.

## Capabilities

### New Capabilities
- `centralized-config`: Soporte para un archivo JSON anidado que configura rutas, ejecución y agentes MCP.

### Modified Capabilities
- `<ninguna>`

## Impact
- **`src/models/config.ts`**: Se actualizará la estructura a un modelo anidado.
- **`src/cli/index.ts`**: Lógica robusta de lectura y validación de `mdt.config.json`.
- **`src/core/compiler.ts`**: Recibirá el `mcp_config` por parámetro o inyección en lugar de instanciarlo estáticamente.
