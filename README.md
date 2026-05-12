# Refactor Race — Taller de Code Smells (TC3004B)

> Implementa 7 funciones desde cero. Los tests no solo validan que **funcionen**: también
> miden líneas, complejidad, anidamiento, switches y duplicación. Tu misión: pasar los
> 7 retos en 1h 40min con código limpio. El junior que llevas dentro hoy va a sufrir y a aprender.

---

## Reglas del race

1. **Individual.** Clonas el repo y trabajas en tu copia local.
2. **1h 40min** desde el banderazo. C0 es warm-up guiado los primeros 10 minutos.
3. Gana quien tenga **más retos en verde**.
4. Valida con `npm test` o desde el dashboard web (`npm start`).
5. **NO edites** archivos en `tests/refactor/` ni en `src/lib/quality/`. Hay un test de integridad que lo detecta.
6. Entregable paralelo: llena `docs/ENTREGABLE.md` con smell, técnica y reflexión por reto.

---

## Setup (minuto 0-5)

```bash
git clone <repo> taller-code-smells
cd taller-code-smells
npm install     # ~30 segundos
npm start       # dashboard en http://localhost:3000
```

Verifica que se levante. Luego, en otra terminal:

```bash
npm test
```

Verás **7 bloques rojos** (C0..C6 + un integrity). Es lo esperado: tu tarea es ponerlos en verde.

> Requisito: Node.js >= 20. Si tienes una versión vieja: `nvm install 20 && nvm use 20`.

---

## Si es tu primera vez: empieza por C0

Abre [`docs/WALKTHROUGH.md`](docs/WALKTHROUGH.md). C0 está resuelto paso a paso para que veas
el loop completo:

```
implementación junior  ->  tests rojos  ->  identificar smell  ->
   aplicar técnica  ->  tests verdes  ->  documentar en ENTREGABLE
```

Repite el mismo loop en C1..C6.

---

## Los retos

| Reto | Smell principal | Técnica clave | Archivo a editar |
|------|------------------|----------------|------------------|
| C0 | Código duplicado + método largo | Extract Method | `src/challenges/c0_warmup_total.js` |
| C1 | Switch excesivo | Replace Conditional with Polymorphism | `src/challenges/c1_discount.js` |
| C2 | Lista larga de parámetros + anidamiento | Introduce Parameter Object + Guard Clauses | `src/challenges/c2_user_role_access.js` |
| C3 | Obsesión primitiva | Parameter Object + `filter().join()` | `src/challenges/c3_format_address.js` |
| C4 | Método largo / God function | Extract Method (Compose Method) | `src/challenges/c4_invoice_summary.js` |
| C5 | Código duplicado | DRY + tabla de reglas | `src/challenges/c5_validators.js` |
| C6 | God function + switch + long params | Strategy + Factory + DI | `src/challenges/c6_report_builder.js` |

Lee `docs/SMELLS_REFERENCE.md` y `docs/REFACTOR_CHEATSHEET.md` para un repaso rápido.

---

## Quality gates: qué castigan los tests

Cada reto mide:

- **LOC** máximos por función (líneas de código no vacías)
- **Complejidad ciclomática** (McCabe)
- **Profundidad de anidamiento** máxima
- **Número de parámetros** máximo o exacto
- Presencia de **`switch`**
- Número de **`if`** / `else if`
- **`+=`** sobre strings (concatenación manual)
- **Duplicación** detectable entre fragmentos del archivo

Cuando un quality gate falla, el mensaje **nombra el smell** y sugiere la **técnica** de refactor a aplicar.

---

## Dashboard web

`npm start` abre http://localhost:3000:

- **`/`** — grid con los 7 retos. Cada tarjeta tiene un botón **"Correr tests"** para ese reto, y arriba del grid hay un botón **"Correr toda la suite"** equivalente a `npm test`.
- **`/challenge/:id`** — enunciado, restricciones y botón para correr ese reto.

El dashboard ejecuta `jest` en un subproceso y muestra el resultado en vivo. La CLI sigue siendo la fuente de verdad (`npm test`). Usa el botón global al final para asegurarte de que **todo** sigue verde.

---

## Scripts npm

| Comando | Qué hace |
|---------|----------|
| `npm start` | Levanta el dashboard en `:3000` |
| `npm test` | Corre toda la suite |
| `npm run test:c0` ... `test:c6` | Solo un reto |
| `npm run test:watch` | Watch mode |
| `npm run quality` | Reporte de calidad por archivo (sin Jest) |
| `npm run lock-tests` | Recalcula hashes de integridad (solo profesor) |

---

## Cheatsheets

- [`docs/PRESENTACION.html`](docs/PRESENTACION.html) — introducción al taller (~15 min, abrir en navegador)
- [`docs/SMELLS_REFERENCE.md`](docs/SMELLS_REFERENCE.md) — los 11 code smells con síntoma y fix
- [`docs/REFACTOR_CHEATSHEET.md`](docs/REFACTOR_CHEATSHEET.md) — 9 técnicas con plantillas antes/después
- [`docs/WALKTHROUGH.md`](docs/WALKTHROUGH.md) — C0 resuelto paso a paso
- [`docs/ENTREGABLE.md`](docs/ENTREGABLE.md) — plantilla a llenar (parte de la calificación)
- [`docs/INSTRUCTOR_NOTES.md`](docs/INSTRUCTOR_NOTES.md) — guía del profesor

---

## Stack

Node.js 20+ · Express · EJS · Jest · @babel/parser · jscpd. Sin DB. Sin Docker.
