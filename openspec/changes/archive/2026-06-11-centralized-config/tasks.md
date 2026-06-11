## 1. Refactor de Modelos

- [x] 1.1 Modificar la interfaz `MDTConfig` en `src/models/config.ts` para que soporte las propiedades anidadas (`api`, `paths`, `execution`, `mcp`).

## 2. Refactor del CLI y Parsers

- [x] 2.1 Actualizar `src/cli/index.ts` para parsear la nueva estructura anidada. Fusionar con valores por defecto si ciertas claves no existen.
- [x] 2.2 Actualizar el `Storage` en `src/cli/index.ts` para recibir el path base de los directorios de ejecuciones (`paths.reports` o ruta general). (Si aplica).

## 3. Inyección en el Compiler

- [x] 3.1 Actualizar el constructor de `FeatureCompiler` en `src/core/compiler.ts` para que reciba `mcpConfig`.
- [x] 3.2 Remover el MCP hardcodeado en `compiler.ts` y usar el parámetro inyectado.
- [x] 3.3 Pasar la variable `config.mcp` desde `src/cli/index.ts` hacia el compilador al instanciarlo.
