## Context

El usuario desea que el orquestador pueda reutilizar la caché de ejecuciones exitosas (Golden Copy). Cuando el compilador genere un nuevo Payload, si existe una caché para ese escenario, el orquestador debe hacer un *merge* inteligente y enviarlo a la API de ejecución. La API omitirá los pasos que ya tengan estado `success`.

## Goals / Non-Goals

**Goals:**
- Configuración centralizada en `mdt.config.json`.
- Inyectar estado de éxito de la caché a nivel de "instructions" (granulidad fina).
- Detener la inyección de caché en cuanto se encuentre la primera instrucción que no coincida textualmente con el caché, o cuando se agoten las instrucciones cacheadas.
- CLI flag `--no-cache`.

**Non-Goals:**
- Merge a nivel de Gherkin step (esto sobreescribiría cambios en el `.steps.yaml`).
- Modificar la API de ejecución (la API ya maneja bien saltarse instrucciones si tienen `execution`).

## Decisions

1. **Config File (`mdt.config.json`)**: El CLI leerá este archivo en la raíz si existe, y hará merge con las opciones por defecto y los flags proveídos.
2. **Merge Algorithm (Golden Copy Replay)**:
   - Dado un `payload` recién compilado y una `cache` guardada.
   - Iterar `step` en `payload.cache_content.steps`.
   - Iterar `instruction` en `step.instructions`.
   - Buscar el mismo `step` (por `stepText`) y la misma `instruction` (por `instruction` text) en la caché.
   - Si coinciden, copiar `instruction.execution` de la caché al `payload`.
   - Si hay una discrepancia en el texto de la instrucción, detener la inyección en **ese escenario completo** (porque la aplicación podría haber cambiado de estado).

## Risks / Trade-offs
- **[Divergencia de Estado]** → Si una instrucción falla o diverge, las subsecuentes no deben inyectarse aunque sean iguales, porque dependen del estado que dejó la instrucción divergente.
  - *Mitigación*: Implementar una bandera booleana `canInject` que se vuelva `false` en la primera discrepancia dentro de un escenario.
