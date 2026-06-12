## Why
Actualmente el framework tiene el reportero quemado en la lógica (sólo soporta un JSON Legacy de Cucumber). El usuario desea poder elegir en tiempo de ejecución qué tipo de reporte generar (ej. Cucumber HTML Básico, Allure, JSON crudo) usando patrones de diseño adecuados (Strategy/Factory). Adicionalmente, requiere que siempre, de manera obligatoria y paralela a cualquier reportero seleccionado, se guarde el log exacto de lo que retornó la API de ejecución (`raw-executions.json`).

## What Changes
1. **Patrón Strategy para Reporteros**: Definiremos una interfaz `IReporter` que unifique cómo se genera un reporte a partir del arreglo de `rawExecutions`.
2. **Patrón Factory**: Crearemos una fábrica `ReporterFactory` que reciba el input del CLI (`--report cucumber|allure|raw`) y devuelva la instancia de la estrategia adecuada.
3. **Log Inmutable de API**: Modificaremos el orquestador o la fábrica para asegurar que los resultados crudos de la API se guarden siempre en un `executions.json` dentro del directorio del `run_id`, sin importar qué reportero visual se escoja.
4. **Implementación AllureReporter**: Se creará un reportero para generar los archivos JSON compatibles con Allure 2 en la carpeta `allure-results`.
5. **Implementación HtmlReporter**: Se integrará `cucumber-html-reporter` para generar automáticamente el `report.html` si el CLI lo pide.

## Capabilities
### New Capabilities
- `multi-reporters`: Soporte dinámico para múltiples formatos de salida (Strategy + Factory).
- `allure-support`: Generación nativa de Allure 2 JSON results.
- `html-basic-support`: Generación de reporte HTML clásico.
- `raw-api-log`: Persistencia automática del output crudo del API para auditoría.

## Impact
- **`src/cli/index.ts`**: Pasará un array de reporters a usar, o el orquestador llamará al Factory.
- **`src/reporters/*`**: Nueva carpeta con la estructura Strategy y clases concretas.
