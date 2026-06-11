## ADDED Requirements

### Requirement: Yaml Step Dynamic Variables
El sistema SHALL interpretar `{variable_name}` en las definiciones YAML, extraer su valor del texto de Gherkin, y reemplazar cualquier instancia de `{variable_name}` dentro del arreglo de `instructions`.

#### Scenario: Mapeo de múltiples variables
- **GIVEN** la llave `"inicia sesión con usuario {username} y clave {password}"`
- **AND** el paso Gherkin es `"inicia sesión con usuario 'alice' y clave '123'"`
- **WHEN** se resuelve el paso
- **THEN** las instrucciones deben inyectar "alice" y "123" sin comillas envolventes.

### Requirement: Scenario Outline Support
El sistema SHALL expandir tablas `Examples` (Ejemplos) adjuntas a un `Scenario Outline` en múltiples escenarios individuales compilados.

#### Scenario: Expansión por Pickles
- **GIVEN** un Gherkin con 1 `Scenario Outline` y una tabla de 3 filas
- **WHEN** el compilador lo procesa
- **THEN** el sistema debe generar 3 payloads independientes.
