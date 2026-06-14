# Guía de Contribución

¡Gracias por tu interés en contribuir a **MDT-CLIENT**! 🎉

Este documento describe las pautas para contribuir al proyecto. Siguiendo estas instrucciones ayudas a mantener la calidad y consistencia del código.

---

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Reportar Bugs](#-reportar-bugs)
- [Proponer Features](#-proponer-features)
- [Enviar Pull Requests](#-enviar-pull-requests)
- [Convenciones de Código](#-convenciones-de-código)
- [Estructura del Proyecto](#-estructura-del-proyecto)

---

## Código de Conducta

Este proyecto se adhiere a un entorno respetuoso y colaborativo. Se espera que todos los contribuidores mantengan una comunicación profesional y constructiva.

---

## 🐛 Reportar Bugs

Si encuentras un bug, por favor abre un **Issue** en GitHub con la siguiente información:

1. **Título claro y descriptivo** del problema.
2. **Pasos para reproducir** el error (lo más detallados posible).
3. **Comportamiento esperado** vs. **comportamiento actual**.
4. **Entorno**: versión de Node.js, sistema operativo, versión de MDT-CLIENT.
5. **Logs o capturas de pantalla** si aplican.

### Ejemplo de un buen reporte

```
Título: Error al generar reporte Allure con escenarios fallidos

Pasos para reproducir:
1. Crear un .feature con un paso inválido
2. Ejecutar: npm run dev run -- --report allure
3. Observar error en consola

Comportamiento esperado: Se genera el reporte con el escenario marcado como fallido
Comportamiento actual: El proceso termina con un error no controlado

Entorno: Node.js v22.x, Windows 11, MDT-CLIENT v1.0.0
```

---

## 💡 Proponer Features

¿Tienes una idea para mejorar MDT-CLIENT? ¡Nos encantaría escucharla!

1. Abre un **Issue** con la etiqueta `feature-request`.
2. Describe **el problema que resuelve** tu propuesta.
3. Proporciona **ejemplos de uso** si es posible.
4. Indica si estás dispuesto a contribuir la implementación.

---

## 🔀 Enviar Pull Requests

### Antes de empezar

1. **Verifica** que no exista un Issue o PR abierto para el mismo cambio.
2. **Abre un Issue** describiendo el cambio que quieres hacer (si no existe uno).
3. **Fork** el repositorio y crea una rama desde `main`.

### Flujo de trabajo

```bash
# 1. Fork y clona el repositorio
git clone https://github.com/tu-usuario/mdt-client.git
cd mdt-client

# 2. Instala las dependencias
npm install

# 3. Crea una rama descriptiva
git checkout -b feat/mi-nueva-funcionalidad

# 4. Haz tus cambios y asegúrate de que compila
npm run build

# 5. Haz commit siguiendo las convenciones
git commit -m "feat: agregar soporte para nuevo formato de reporte"

# 6. Push y abre un Pull Request
git push origin feat/mi-nueva-funcionalidad
```

### Checklist del PR

- [ ] El código compila sin errores (`npm run build`).
- [ ] Los cambios siguen las convenciones de código del proyecto.
- [ ] Se actualizó la documentación si aplica.
- [ ] Se agregaron entries al `CHANGELOG.md` si aplica.

---

## 📝 Convenciones de Código

### Estilo General

- **Lenguaje**: TypeScript estricto (`strict: true` en tsconfig).
- **Indentación**: 2 espacios (configurado en `.editorconfig`).
- **Charset**: UTF-8.
- **Salto de línea final**: Siempre incluir.

### Nomenclatura

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Archivos | kebab-case | `cache-replay.ts` |
| Clases | PascalCase | `FeatureCompiler` |
| Funciones/Métodos | camelCase | `findFeaturesRecursive()` |
| Constantes | UPPER_SNAKE_CASE | `MAX_RETRIES` |
| Interfaces | PascalCase | `MDTConfig` |

### Commits

Seguimos la convención de [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: agregar nuevo tipo de reporte
fix: corregir parseo de escenarios con tablas
docs: actualizar sección de Quick Start
refactor: extraer lógica de validación a módulo separado
chore: actualizar dependencias
```

### Patrones de Diseño

- **Strategy + Factory** para reporters (`src/reporters/`).
- **Inyección de dependencias** a través del config para MCP.
- **Validación con Zod** para schemas de payload.

---

## 📁 Estructura del Proyecto

```
mdt-client/
├── src/
│   ├── cli/              # Punto de entrada CLI (Commander)
│   ├── core/             # Lógica central (compilador, API, cache, storage)
│   ├── models/           # Schemas y tipos (Zod, config)
│   ├── parsers/          # Parsers de Gherkin y YAML
│   └── reporters/        # Sistema de reportes (Strategy + Factory)
├── scenarios/
│   ├── features/         # Archivos Gherkin (.feature)
│   └── steps/            # Definiciones de pasos (.steps.yaml)
├── executions/           # Reportes y cache generados (gitignored)
├── mdt.config.json       # Configuración centralizada
└── package.json
```

---

## ❓ ¿Preguntas?

Si tienes dudas sobre cómo contribuir, no dudes en abrir un Issue con la etiqueta `question`. ¡Estamos para ayudarte!
