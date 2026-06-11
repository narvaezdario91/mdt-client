## Why
Actualmente el CLI de `mdt-orchestrator` asume que el parámetro `--features` siempre apunta a un único archivo con extensión `.feature`. Si un usuario intenta ejecutar múltiples pruebas pasando la ruta de un directorio (por ejemplo `scenarios/features/eShop`), la aplicación lanza un error `EISDIR` en el momento en que `GherkinParser` intenta hacer `readFileSync` sobre dicho directorio. Para facilitar la ejecución de *test suites* y escalar, el CLI debe poder escanear directorios y encontrar archivos Gherkin.

## What Changes
- En `src/cli/index.ts`, se agregará lógica (apoyada en recursión manual o una librería como `glob`) para detectar si el *path* provisto en `--features` (o desde `mdt.config.json`) es un archivo o un directorio.
- Si es un archivo, se compila tal cual.
- Si es un directorio, se escaneará recursivamente buscando archivos `*.feature`.
- Se agruparán todos los *Payloads* resultantes de múltiples compilaciones y se mandarán en ciclo a la API de ejecución.

## Capabilities
### New Capabilities
- `recursive-feature-scan`: Capacidad de ejecutar un directorio entero (y subdirectorios) de archivos `.feature` usando un solo comando.

## Impact
- **CLI (`index.ts`)**: Se modifica el bloque de compilación. En vez de llamar a `compiler.compile` una sola vez, se iterará sobre un arreglo de rutas resultantes de la exploración.
- **Compilador (`compiler.ts`)**: Se mantiene puro, procesando un solo archivo a la vez. No sufre modificaciones en su lógica interna de mapeo.
