## Context

En la arquitectura actual de `mdt-orchestrator`, los resultados crudos de las ejecuciones BDD retornados por la API son almacenados individualmente en JSONs y unificados en `raw-executions.json`. A partir de ahí, las implementaciones de `CucumberReporter` y `AllureReporter` generan reportes consolidados en sus formatos respectivos. Sin embargo, no se está procesando detalladamente el arreglo de instrucciones ni el estado secuencial dentro de los pasos, y se ignora el campo enriquecido de `execution.details` (código de Playwright, console logs, estado del browser).

## Goals / Non-Goals

**Goals:**
* Mapear secuencialmente los estados individuales de los pasos (`passed`, `failed`, `skipped`) en el reporte unificado de Cucumber para reflejar con precisión dónde falló un escenario.
* Dividir el tiempo total del escenario equitativamente entre los pasos que sí se ejecutaron, evitando reportar tiempos erróneos o en un solo paso.
* Incrustar los detalles markdown del campo `execution.details` en el reporte de Cucumber mediante `embeddings` de texto plano (Base64).
* Inyectar attachments en Allure con los detalles completos (`execution.details`) de cada instrucción individual (substep), escribiendo los archivos correspondientes en los directorios de resultados de Allure.
* Registrar parámetros en Allure de la herramienta Playwright y argumentos.

**Non-Goals:**
* Modificar la API de ejecución o cambiar los formatos en que esta retorna las ejecuciones crudas.
* Modificar el comportamiento de caché/golden copy o la ejecución CLI base de los escenarios.
* Generar reportes no soportados por el framework (HTML de Cucumber se seguirá generando a través del JSON unificado usando `cucumber-html-reporter`).

## Decisions

### 1. Procesamiento secuencial del estado en Cucumber
* **Opción elegida**: Llevaremos un control en `CucumberReporter` mediante una bandera `hasFailed` inicializada en `false`. Si las instrucciones de un paso fallaron, marcamos el paso como `failed` y ponemos `hasFailed = true`. Los siguientes pasos sin instrucciones ejecutadas o evaluados con `hasFailed === true` se marcan automáticamente como `skipped`. Además, implementaremos una salvaguarda defensiva: si el escenario falla globalmente (`executionSummary.success === false`) pero no se encontró ninguna instrucción fallida (ej. fallo en hooks o timeout), marcaremos el último paso ejecutado (o el primero) como `failed` con el error general para no perder el rastro del fallo.
* **Alternativas consideradas**: Mantener el comportamiento simplista actual (donde todos se marcan como fallidos o exitosos). Se descartó por ser impreciso y no reflejar el flujo real de BDD.

### 2. Estructura de Embeddings en Cucumber
* **Opción elegida**: Usar embeddings de tipo `text/plain` y codificar en Base64 una plantilla detallada en Markdown de las instrucciones y sus ejecuciones. Cucumber y `cucumber-html-reporter` admiten la decodificación y renderizado HTML de estas secciones preformateadas, logrando expandir los detalles de Playwright.
* **Alternativas consideradas**: No usar embeddings y dejar solo el texto de instrucción. Se descartó porque no permitiría ver el código Playwright ejecutado ni los console logs del navegador.

### 3. Gestión de Archivos Físicos de Attachment en Allure
* **Opción elegida**: Allure requiere que los attachments estén referenciados en el JSON del resultado mediante su nombre de archivo fuente (`source`), y que este archivo exista físicamente en el mismo directorio. Por ello, en `AllureReporter.generate()`, por cada instrucción crearemos un archivo UUID (`${crypto.randomUUID()}-attachment.md`) tanto en el directorio global `allure-results` como en el específico del run `reportsDir/allure-results`. Usaremos explícitamente el tipo de contenido `text/markdown` en la definición del attachment para que la interfaz web de Allure renderice correctamente los bloques de código y detalles. Para evitar problemas de agotamiento de descriptores de archivo (EMFILE) con un alto volumen de instrucciones, la escritura asíncrona se realizará de forma secuencial segura usando un bucle `for...of` con `await`.
* **Alternativas consideradas**: Intentar adjuntar los detalles como logs de consola o strings en la descripción del paso. Se descartó porque la interfaz web de Allure no lo renderiza de forma óptima comparado con los bloques dedicados de attachments.

## Risks / Trade-offs

* **[Riesgo]**: Incremento de tamaño en los reportes Cucumber JSON y de archivos en Allure Results por el volumen de detalles y logs de consola.
  * *Mitigación*: `cucumber-html-reporter` maneja bien archivos JSON de hasta decenas de megabytes. Para ejecuciones extremadamente masivas, se mantendrán los archivos en el disco del run.
* **[Riesgo]**: Fallos en Allure al intentar escribir archivos concurrentemente o problemas de rutas en Windows.
  * *Mitigación*: Usaremos `path.join` y `path.resolve` para garantizar la compatibilidad con el sistema operativo actual (Windows) usando la API asíncrona de `fs/promises`.
