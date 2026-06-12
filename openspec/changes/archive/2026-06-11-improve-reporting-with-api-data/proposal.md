## Why

Mejorar la reportería de las ejecuciones BDD aprovechando la información detallada (Playwright code, URLs de página, console logs, snapshots, etc.) que retorna la API de ejecución en `execution.details`. Actualmente, esta información se ignora y el estado de los pasos en Cucumber se hereda de manera errónea del escenario entero.

## What Changes

- **Enriquecer Cucumber Reporter**:
  - Calcular el estado real (`passed`, `failed`, `skipped`) para cada paso secuencialmente en lugar de copiar el estado global.
  - Distribuir la duración total del escenario equitativamente entre los pasos ejecutados.
  - Generar un attachment (`embeddings`) en base64 de formato markdown con el resumen detallado de la ejecución de instrucciones de cada paso.
- **Enriquecer Allure Reporter**:
  - Generar y guardar archivos de attachments (`.md` o `.txt`) conteniendo `execution.details` por cada instrucción en el directorio de resultados de Allure.
  - Registrar la referencia del attachment en el campo `attachments` de los subpasos (`subSteps`) correspondientes.
  - Agregar la herramienta de Playwright y argumentos como parámetros para cada instrucción.

## Capabilities

### New Capabilities

- (Ninguna)

### Modified Capabilities

- `cucumber-reporter`: Refinar la generación de reportes Cucumber JSON para incluir estados precisos en steps, distribución realista de duraciones y detalles de instrucciones mediante embeddings.
- `multi-reporters`: Extender la generación de resultados de Allure para inyectar attachments con detalles de ejecución (`execution.details`) y parámetros por cada subpaso de instrucción.

## Impact

- `src/reporters/cucumber.ts` (modificación de mapeo de pasos, cálculo de estados, embeddings)
- `src/reporters/allure.ts` (modificación para escribir archivos de attachment físicos de Allure, asociar attachments y parámetros a subpasos)
