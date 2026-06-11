## Why

Actualmente, el orquestador BDD `GUI_MDT` está escrito en Python y utiliza un sistema de parseo manual (regex-based) para procesar archivos Gherkin. Esto es propenso a errores ante sintaxis compleja. Migrar la lógica principal a Node.js nos permite utilizar la librería oficial `@cucumber/gherkin` (que genera un Árbol de Sintaxis Abstracta exacto) y validar estrictamente todos los payloads con `zod` antes de enviarlos a la API de ejecución, reduciendo drásticamente los errores en tiempo de ejecución.

## What Changes

Esta migración reimplementará en TypeScript los motores críticos que actualmente viven en Python:
1. **Modelos**: Definición de esquemas estables para Feature, Scenario y Payload usando `zod`.
2. **Parsers**: 
   - Un adaptador para `@cucumber/gherkin` que extraiga la información.
   - Un lector de diccionarios YAML para mapear los "steps".
3. **Core Compilador**: Un motor que una el AST de Gherkin con los diccionarios YAML para construir un JSON ejecutable.
4. **Cliente HTTP & Almacenamiento**: Lógica para enviar el payload al servidor Python (`api-client.ts`) y guardar los resultados crudos (`storage.ts`).
5. **CLI**: Integración final de todos estos módulos en los comandos de `commander`.

## Capabilities

### New Capabilities
- `feature-compilation`: Capacidad de transformar de manera robusta `.feature` + `.steps.yaml` a un Payload JSON estructurado, con validación de tipos estricta en tiempo de compilación y ejecución.
- `api-orchestration`: Capacidad de disparar las pruebas contra el servidor de ejecución y registrar los tiempos/resultados de manera asíncrona.

## Impact

- Este es el hito principal de la migración. Una vez completado, `mdt-orchestrator` podrá reemplazar funcionalmente el uso de comandos como `python cli.py run` del proyecto antiguo.
- La ejecución en sí (la manipulación del navegador con Playwright) seguirá intacta en el servidor Python.
