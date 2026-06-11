## 1. Configuración Centralizada

- [x] 1.1 Crear la interfaz/tipo para la configuración en `src/models/config.ts` (con `apiUrl`, `features`, `steps`, `useCache`).
- [x] 1.2 En `src/cli/index.ts`, intentar leer `mdt.config.json` (usando `fs.readFileSync`) y fusionar los valores con las opciones de commander. Asegurar que `--no-cache` fije `useCache: false`.

## 2. Lógica de Merge (Cache Replay)

- [x] 2.1 Crear el archivo `src/core/cache-replay.ts` con una clase o función que reciba el `Payload` original y el caché JSON.
- [x] 2.2 Implementar el algoritmo de inyección a nivel de instrucción: debe hacer match por `stepText` y `instruction.instruction`. Debe detenerse (`canInject = false`) en la primera divergencia.

## 3. Integración en el CLI

- [x] 3.1 En `src/cli/index.ts`, después de que se compila el Payload con Zod, si `useCache` es verdadero, calcular la ruta de la Golden Copy usando `Storage`.
- [x] 3.2 Si existe el archivo en la caché, leerlo, pasarlo al módulo `CacheReplay`, e inyectar el resultado en el payload antes de enviarlo a `apiClient.executeFeature`.
