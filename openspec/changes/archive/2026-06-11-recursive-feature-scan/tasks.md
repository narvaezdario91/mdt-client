## 1. Scanner Helper
- [x] 1.1 Crear una función recursiva en `src/cli/index.ts` (o archivo de utils) para buscar archivos `*.feature` dado un path.

## 2. CLI Integration
- [x] 2.1 En `src/cli/index.ts`, validar usando `fs.statSync` si `options.features` es un archivo o un directorio.
- [x] 2.2 Si es archivo, agregar el string a un arreglo de rutas.
- [x] 2.3 Si es directorio, usar el Scanner Helper para llenar el arreglo de rutas.
- [x] 2.4 Modificar la llamada a `compiler.compile()` iterando sobre el arreglo de rutas y acumulando resultados en `rawPayloads`.
