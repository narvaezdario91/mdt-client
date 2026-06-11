## ADDED Requirements

### Requirement: Recursive Feature Directory Scanning
El sistema SHALL ejecutar todos los archivos `.feature` contenidos dentro del path provisto, de manera recursiva.

#### Scenario: Ejecutar sobre un directorio con subcarpetas
- **GIVEN** que el usuario especifica un directorio `--features scenarios/eShop`
- **AND** dicho directorio contiene un archivo `cart/buy.feature` y un `login.feature`
- **WHEN** se ejecuta el orquestador
- **THEN** el sistema debe encontrar y compilar ambos archivos sin fallar por `EISDIR`.

#### Scenario: Ejecutar sobre un archivo específico (backward compatibility)
- **GIVEN** que el usuario especifica un archivo `--features scenarios/login.feature`
- **WHEN** se ejecuta el orquestador
- **THEN** el sistema debe compilar únicamente ese archivo.
