## Context

Continuando con el andamiaje inicial, debemos construir el núcleo de la herramienta: el motor que lee archivos `.feature` y `.steps.yaml`, los compila en un Payload unificado, y se comunica con el servidor de ejecución BDD que sigue alojado en Python.

## Goals / Non-Goals

**Goals:**
- Implementar validación fuerte de datos con Zod para todo dato de entrada y salida.
- Replicar la funcionalidad de compilación del orquestador Python aprovechando el AST oficial de Cucumber.
- Implementar un cliente HTTP resiliente para comunicarse con la API de Playwright.

**Non-Goals:**
- En esta iteración NO migraremos todavía la generación de los reportes finales (Cucumber JSON / HTML). Solo nos concentraremos en el ciclo de vida central: Parsear -> Compilar -> Ejecutar -> Guardar Raw JSON.

## Decisions

**1. Parseo Gherkin Oficial**
- **Decisión:** En lugar de replicar el código de Python que leía línea por línea, usaremos el ecosistema oficial `@cucumber/gherkin` y `@cucumber/messages`.
- **Rationale:** Provee un AST (Abstract Syntax Tree) que garantiza 100% de compatibilidad con el estándar Gherkin, soportando *DataTables*, *DocStrings* y *Backgrounds* de manera nativa.

**2. Tipado Fuerte con Zod**
- **Decisión:** Crearemos el archivo `src/models/payload.schema.ts` donde se definirán todos los tipos (Payload, Feature, Scenario, Instruction) que la API de Python espera recibir.
- **Rationale:** Previene enviar peticiones malformadas a la API. Si un archivo `.feature` está mal construido o falta un step en el YAML, el orquestador fallará rápido y localmente.

**3. Arquitectura del Compilador**
- **Decisión:** Se implementará una clase `FeatureCompiler` que recibirá las rutas del `.feature` y la carpeta de steps, delegando el trabajo a un `GherkinParser` y un `YamlResolver`.
- **Rationale:** Principio de Responsabilidad Única (SRP).

## Risks / Trade-offs

- **Risk:** La complejidad del AST de Cucumber. La librería devuelve mensajes muy anidados que pueden ser verbosos de manipular.
  - **Mitigation:** Crearemos un "adaptador" (`gherkin-parser.ts`) cuya única responsabilidad sea aplanar el AST de Cucumber hacia nuestras interfaces simples.
