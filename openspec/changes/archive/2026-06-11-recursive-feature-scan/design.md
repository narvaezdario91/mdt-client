## Context
Queremos soportar la ejecución masiva de features apuntando el CLI a un directorio, evitando el error de lectura `EISDIR`. Esto permite correr _suites_ enteras o pruebas organizadas en árboles de carpetas profundos.

## Goals / Non-Goals
**Goals:**
- Identificar si `options.features` es archivo o directorio.
- Búsqueda recursiva (archivos `*.feature`) si es directorio.
- Acumular todos los escenarios de todos los archivos y ejecutarlos como un solo flujo consolidado.
- Mantener la lógica de `FeatureCompiler` agnóstica del filesystem.

**Non-Goals:**
- Implementar filtrado complejo de tags (e.g. `--tags @login`) en esta iteración.
- Ejecución paralela (multithreading) en esta iteración.

## Decisions
1. **Lógica de Escaneo**: En lugar de inflar `index.ts` con una función recursiva larga, se usará una librería ligera de Node como `glob` si está instalada, o se creará una función recursiva síncrona `findFeaturesRecursive(dir)` utilizando `fs.readdirSync`.
2. **Iteración de Compilación**: En `src/cli/index.ts` se reemplazará la invocación singular con un ciclo:
   ```typescript
   let rawPayloads: any[] = [];
   for (const file of featureFiles) {
     rawPayloads.push(...compiler.compile(file));
   }
   ```
3. **Reportes y Caché**: La lógica ya existente iterará sobre el consolidado de `rawPayloads`, guardando múltiples Golden Copies y consolidando todo en un solo reporte de Cucumber. No requiere ajustes.

## Risks / Trade-offs
- **Performance**: Leer y compilar masivamente de manera síncrona puede tardar unos milisegundos más, pero para la escala de Gherkin no representará un impacto notable. El verdadero tiempo ocurre durante la ejecución de Selenium/Playwright (que ya es asíncrona).
