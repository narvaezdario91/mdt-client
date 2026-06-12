## 1. Modificaciones en Cucumber Reporter

- [x] 1.1 Modificar la asignación de estados de los pasos en `src/reporters/cucumber.ts` para que se calculen secuencialmente (passed, failed, skipped) basándose en el resultado de sus instrucciones.
- [x] 1.2 Implementar salvaguarda defensiva: si el escenario falló pero no hay instrucciones fallidas, marcar el paso correspondiente (último o primero) como `failed` con el error general.
- [x] 1.3 Modificar la distribución de duración de forma que el tiempo total del escenario se divida proporcionalmente entre los pasos ejecutados.
- [x] 1.4 Implementar la generación del embedding en Base64 con el detalle de las instrucciones y adjuntarlo al step de Cucumber, asegurando un formato texto seguro estructurado como markdown legible para su correcta visualización.

## 2. Modificaciones en Allure Reporter

- [x] 2.1 Modificar `src/reporters/allure.ts` para inyectar la herramienta y los argumentos de Playwright como parámetros para cada instrucción (substep).
- [x] 2.2 Implementar la creación física de archivos de attachments (usando extensión `.md`) con el contenido de `execution.details` para cada instrucción, procesando la I/O de manera secuencial segura (ej. `for...of` con `await`) para evitar errores `EMFILE`.
- [x] 2.3 Asociar la referencia del attachment (`attachments` array con name, source y type `text/markdown`) en el objeto de la instrucción.

## 3. Pruebas y Verificación

- [x] 3.1 Ejecutar los escenarios de prueba locales con la bandera `--report cucumber,allure,html` para generar los nuevos reportes.
- [x] 3.2 Validar que el reporte HTML generado en `cucumber-report.html` se visualice correctamente y contenga los detalles legibles.
- [x] 3.3 Validar que la carpeta de Allure Results contenga los archivos `.md` de attachment y que al abrir los resultados con Allure se visualice el Markdown correctamente renderizado para cada subpaso.
