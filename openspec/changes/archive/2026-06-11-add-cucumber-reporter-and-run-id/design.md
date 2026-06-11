## Context

Actualmente el orquestador BDD en Node.js (mdt-orchestrator) ejecuta escenarios de Gherkin y guarda cada JSON de resultado de manera aislada en `executions/raw/run_<timestamp>_<featureName>`. Esto funciona para depuración individual, pero al ejecutar una suite entera es imposible tener un consolidado o integrarse con herramientas de reportería (como plugins de Cucumber en Jenkins).
Este diseño incorpora el agrupamiento lógico por "Run" y la transformación a Cucumber JSON, tal como lo hacía la versión anterior en Python (`GUI_MDT`).

## Goals / Non-Goals

**Goals:**
- Generar un ID global (Run ID) al iniciar el CLI y propagarlo hasta el guardado.
- Agrupar los JSONs crudos de todas las ejecuciones bajo `executions/reports/<run_id>/raw/`.
- Permitir la conversión de esos JSONs crudos al formato estándar Cucumber JSON.
- Añadir la opción `--report` al CLI.

**Non-Goals:**
- Implementar envío de reportes automáticos por correo o slack.
- Proveer una interfaz gráfica para visualizar los reportes (solo se genera el JSON estándar).
- Paralelismo en la ejecución (la agrupación asume ejecución secuencial por ahora, o al menos un solo Run ID para todo el lote concurrente).

## Decisions

- **Generación de Run ID:** Se generará una sola vez al inicio del comando CLI y se inyectará como parámetro en el constructor o método de la clase `Storage`.
- **Duración de pasos (Cucumber JSON):** El JSON crudo actualmente provee el tiempo total del escenario (`executionTimeMs`), pero Cucumber requiere nanosegundos a nivel de `step`. Como no tenemos tiempos granulares, inyectaremos el tiempo total en el primer o último step, o 0 en los intermedios, para cumplir con el esquema.
- **Flujo del Reporter:** En lugar de guardar el payload de Cucumber directamente desde el API Client, el Reporter procesará *todos* los archivos en la carpeta `raw/` de ese `run_id` al final de la corrida. Esto mantiene el orquestador desacoplado de los formatos de reportería.

## Risks / Trade-offs

- **Risk:** Crecimiento excesivo de la carpeta de reportes.
  **Mitigation:** Eventualmente se requerirá un comando o política de limpieza (`purge`) para eliminar ejecuciones viejas.
- **Risk:** Falsos positivos en Cucumber si el formato JSON cambia en la API.
  **Mitigation:** El transformador `CucumberReporter` debe validar y manejar casos nulos o fallos parciales sin romper todo el reporte.
