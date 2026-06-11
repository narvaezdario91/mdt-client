## Why
Actualmente el orquestador (`FeatureCompiler` / `YamlResolver`) usa coincidencia exacta de texto para emparejar pasos de Gherkin con definiciones YAML. Esto impide el uso de parámetros dinámicos, y fallan escenarios como los de `eShop` que requieren extraer texto (como `{product}`, `{username}`, `{password}`) de los escenarios y reemplazarlos en las instrucciones del payload enviado al LLM. 
Adicionalmente, el `GherkinParser` no soporta la expansión de `Scenario Outlines` con sus tablas de ejemplos (`Examples`), por lo que no es posible iterar sobre juegos de datos.

## What Changes
1. **Gherkin Parser con Pickles**: Se refactorizará `GherkinParser` para aprovechar el concepto de *Pickles* nativo de la librería `@cucumber/gherkin`. Esto habilitará el soporte automático para Scenario Outlines y Backgrounds.
2. **YamlResolver Dinámico con Regex**: Se refactorizará `YamlResolver` para que lea llaves en el YAML (`{username}`) y construya Expresiones Regulares con *Named Capture Groups*. Al hacer match con un *Pickle step*, extraerá los valores y los inyectará reemplazando los placeholders en el array de `instructions` del YAML antes de devolverlas.

## Capabilities
### New Capabilities
- `dynamic-step-variables`: Soporte para mapear y reemplazar variables con la sintaxis `{variable}` en archivos `.steps.yaml`.
- `scenario-outlines-support`: Soporte nativo para esquemas de escenarios (Data Tables en Examples) usando Pickles de Cucumber.

## Impact
- **`src/parsers/gherkin-parser.ts`**: Cambia su salida de procesar manualmente el AST a retornar arreglos de Pickles pre-expandidos.
- **`src/core/compiler.ts`**: Se adapta para iterar sobre `Pickles` en lugar del AST crudo.
- **`src/parsers/yaml-resolver.ts`**: Pasa de un mapa de strings a iterar sobre un array de objetos con `RegExp`.
