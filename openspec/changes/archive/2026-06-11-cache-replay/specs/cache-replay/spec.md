## ADDED Requirements

### Requirement: Merge de Caché de Ejecución (Golden Copy Replay)
El sistema SHALL intentar inyectar ejecuciones exitosas previas en el nuevo payload compilado, comparando a nivel de instrucciones para maximizar el reúso sin romper la lógica cuando cambian los pasos.

#### Scenario: Configuración centralizada
- **WHEN** el usuario ejecuta el CLI
- **THEN** el sistema lee `mdt.config.json` para definir rutas por defecto y configuraciones como `useCache`.

#### Scenario: Salto manual de caché
- **WHEN** el usuario pasa el flag `--no-cache`
- **THEN** el sistema desactiva la inyección de caché y ejecuta desde cero.

#### Scenario: Inyección exitosa hasta divergencia
- **WHEN** el orquestador tiene un payload compilado y una caché válida
- **THEN** itera sobre las instrucciones
- **AND** si la instrucción coincide textualmente con la caché, inyecta el objeto `execution` con status "success"
- **AND** en el momento en que una instrucción no coincide, detiene la inyección para el resto del escenario.
