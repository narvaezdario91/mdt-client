## 1. Definición de Modelos (Zod)

- [x] 1.1 Crear `src/models/payload.schema.ts`. Definir los esquemas de Zod para las estructuras exactas que espera el API de Python: `InstructionSchema`, `ScenarioSchema`, `FeatureSchema`, y `PayloadSchema`. Exportar los tipos inferidos.

## 2. Implementación de Parsers

- [x] 2.1 Crear `src/parsers/yaml-resolver.ts`. Implementar la clase `YamlResolver` que lea recursivamente una carpeta buscando archivos `*.steps.yaml` e indexe las instrucciones disponibles.
- [x] 2.2 Crear `src/parsers/gherkin-parser.ts`. Implementar una función/clase que utilice `@cucumber/gherkin` para leer un `.feature` y extraer la meta-información (nombre, descripción, lista de escenarios y pasos en texto plano).

## 3. Lógica Core

- [x] 3.1 Crear `src/core/compiler.ts`. Implementar la clase `FeatureCompiler` que orqueste a `GherkinParser` y `YamlResolver` para mapear los pasos en texto plano hacia instrucciones técnicas, retornando un `Payload` tipado.
- [x] 3.2 Crear `src/core/api-client.ts`. Implementar un wrapper alrededor de `axios` o `fetch` para hacer POST a la API de ejecución (ej. `http://localhost:8000/api/v1/execute/feature`).
- [x] 3.3 Crear `src/core/storage.ts`. Implementar funciones para guardar de manera asíncrona los JSON de respuesta en un directorio `executions/raw/`.

## 4. Integración con CLI

- [x] 4.1 Modificar `src/cli/index.ts` para aceptar las opciones `--features <path>` (requerido), `--steps <path>` (requerido) y `--api-url <url>` (opcional, default: `http://localhost:8000`).
- [x] 4.2 Enlazar el comando `run` para que instancie el Compilador, valide el payload, lo pase al API Client y guarde el resultado, mostrando progreso en la terminal.
