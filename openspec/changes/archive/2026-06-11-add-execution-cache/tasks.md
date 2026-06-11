## 1. Storage

- [x] 1.1 Modificar `src/core/storage.ts` añadiendo el método `saveCache(relativePath: string, featureName: string, scenarioName: string, data: any)`.
- [x] 1.2 Dentro de `saveCache`, construir la ruta anidada: `executions/cache/<relativePath>/<featureName>/<scenarioName>.json` asegurando nombres seguros.
- [x] 1.3 Utilizar `fs.mkdir` (con recursive) para asegurar que la jerarquía de carpetas exista, y `fs.writeFile` para almacenar el payload.

## 2. CLI

- [x] 2.1 En `src/cli/index.ts`, capturar la ruta relativa del feature (ej. usando `path.relative` entre la carpeta raíz de features o el `process.cwd()` y `options.features`).
- [x] 2.2 Una vez que se obtiene el resultado (`result`), evaluar `result.executionSummary?.success === true`.
- [x] 2.3 Si fue exitoso, invocar `storage.saveCache(relativePath, featureName, scenarioName, result)` y registrar el guardado en consola.
