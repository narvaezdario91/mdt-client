## 1. Gherkin Parser a Pickles
- [x] 1.1 Modificar `src/parsers/gherkin-parser.ts` para usar `compile()` de `@cucumber/gherkin`.
- [x] 1.2 Ajustar el modelo de retorno `ParsedFeature` (o crear un nuevo wrapper) para exponer un arreglo plano de `ParsedScenario` (basados en Pickles) en lugar del AST anidado.

## 2. Ajustar Feature Compiler
- [x] 2.1 Actualizar `src/core/compiler.ts` para que itere sobre los Pickles generados y construya los Payloads.

## 3. YamlResolver con Variables Dinámicas
- [x] 3.1 En `src/parsers/yaml-resolver.ts`, definir la interfaz para almacenar patrones Regex precompilados.
- [x] 3.2 Implementar método interno `buildRegex(key)` que convierta placeholders `{var}` en Named Capture Groups `(?<var>.*?)`.
- [x] 3.3 Modificar `resolve(stepText)` para iterar los patrones, hacer exec() en la regex, y limpiar comillas en los valores capturados.
- [x] 3.4 Hacer el replace iterativo en las instrucciones (tanto strings puros como dentro del objeto si es instrucción compleja) con los valores limpios.
