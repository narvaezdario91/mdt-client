## Why

Re-ejecutar escenarios BDD completos desde cero es costoso en tiempo y recursos. Si una ejecución previa (Golden Copy) fue exitosa, podemos omitir instrucciones ya validadas y enfocarnos solo en lo que cambió o falló, ahorrando tiempo y estabilizando las pruebas. Adicionalmente, necesitamos centralizar la configuración en un archivo para no depender constantemente de flags en el CLI.

## What Changes

- Añadir soporte para cargar configuración desde un archivo `mdt.config.json`.
- Implementar la carga y *merge* de la caché (Golden Copy) dentro del ciclo de ejecución.
- El *merge* se hará a nivel de `instructions`: se inyectará el bloque `"execution"` de la caché en el nuevo payload siempre que las instrucciones y pasos coincidan textualmente, deteniéndose en la primera divergencia.
- Añadir el flag `--no-cache` al CLI para saltar este comportamiento y forzar una ejecución en limpio.

## Capabilities

### New Capabilities
- `cache-replay`: Lógica para realizar merge inteligente de la Golden Copy con el payload recién compilado, a nivel de instrucciones.

### Modified Capabilities
- `<ninguna>`

## Impact
- **CLI (`src/cli/index.ts`)**: Se actualizará para buscar el archivo de caché y aplicar el merge antes de enviar a la API. También procesará la configuración y el flag `--no-cache`.
