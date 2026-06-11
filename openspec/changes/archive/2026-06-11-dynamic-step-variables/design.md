## Context
Se desea soportar *Scenario Outlines* y variables de pasos en la nueva arquitectura de Node.js, imitando la legibilidad de la versión antigua en Python pero usando la robustez del AST y Pickles de la librería de Cucumber oficial.

## Goals / Non-Goals
**Goals:**
- Compilar el documento Gherkin a Pickles para obtener soporte instantáneo de `Background` y `Examples`.
- Extraer variables nombradas en los keys de los pasos (`el usuario ingresa a {tienda}`) usando Named Capture Groups en JS (`/(?<tienda>.*?)/`).
- Inyectar los valores extraídos en las instrucciones de texto del YAML.
- Eliminar comillas envolventes (`'valor'` -> `valor`) durante la extracción de parámetros.

**Non-Goals:**
- No usaremos `@cucumber/cucumber-expressions` puro, ya que forzaría un cambio de sintaxis en todos los archivos YAML existentes hacia tipos posicionales (ej. `{string}`), perdiendo la legibilidad que da `{username}`.

## Decisions
1. **Regex Generator en YamlResolver**:
   Se creará un método `_buildRegex(key)` que transforma `"el producto {product}"` en `^el producto (?<product>.*?)$`.
2. **Reemplazo de Cadenas**:
   Al resolver, si hay un match, se usa `String.prototype.replace(/{var}/g, match.groups.var)` en cada instrucción.
3. **Migración a Pickles**:
   `GherkinParser` usará `compile(document, ...)` de `@cucumber/gherkin` el cual retorna `messages.Pickle[]`. El compiler de la app ya no iterará sobre el feature.scenarios, sino sobre el array de Pickles, cada uno siendo una corrida independiente (Payload).

## Risks / Trade-offs
- Refactorizar a Pickles significa que el `Payload` final podría requerir pequeños ajustes si dependía de IDs específicos del AST, pero `Pickle` provee la estructura plana que de hecho es más limpia para iterar que el AST jerárquico.
