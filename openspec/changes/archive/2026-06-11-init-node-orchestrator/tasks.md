## 1. Configuración del Proyecto Base

- [x] 1.1 Ejecutar `npm init -y` para crear el `package.json`.
- [x] 1.2 Instalar dependencias de producción: `npm install commander zod @cucumber/gherkin @cucumber/messages yaml axios`.
- [x] 1.3 Instalar dependencias de desarrollo: `npm install -D typescript @types/node ts-node`.
- [x] 1.4 Generar y configurar `tsconfig.json` (`outDir: "./dist"`, `rootDir: "./src"`, `strict: true`).

## 2. Estructura de Directorios

- [x] 2.1 Crear la estructura base en `src/`: `cli/`, `core/`, `models/`, `parsers/`, `reporters/`.
- [x] 2.2 Configurar el punto de entrada del CLI en `src/cli/index.ts` usando `commander` para imprimir un mensaje de inicialización.

## 3. Scripts de Ejecución

- [x] 3.1 Añadir al `package.json` los scripts:
  - `"build": "tsc"`
  - `"start": "node dist/cli/index.js"`
  - `"dev": "ts-node src/cli/index.ts"`
- [x] 3.2 Verificar que `npm run dev` imprime el mensaje del CLI sin errores de tipos.
