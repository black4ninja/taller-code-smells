# Refactor Race — Taller de Code Smells (TC3004B)

> Implementa 7 funciones desde cero. Los tests no solo validan que **funcionen**: tambien
> miden lineas, complejidad, anidamiento, switches y duplicacion. Tu mision: pasar los
> 7 retos en 1h 40min con codigo limpio. El junior que llevas dentro hoy va a sufrir y aprender.

---

## Reglas del race

1. **Individual.** Clonas el repo, trabajas en tu copia local.
2. **1h 40min** desde el banderazo. C0 es warm-up guiado los primeros 10 minutos.
3. Gana quien tenga **mas retos en verde**; desempate por tiempo total.
4. Valida con `npm test` o desde el dashboard web (`npm start`).
5. **NO edites** archivos en `tests/refactor/` ni en `src/lib/quality/`. Hay un test de integridad que lo detecta.
6. Entregable paralelo: llena `docs/ENTREGABLE.md` con smell, tecnica y reflexion por reto.

---

## Setup (minuto 0-5)

```bash
git clone <repo> taller-code-smells
cd taller-code-smells
npm install     # ~30 segundos
npm start       # dashboard en http://localhost:3000
```

Verifica que se levante. Luego en otra terminal:

```bash
npm test
```

Veras **7 bloques rojos** (C0..C6 + un integrity). Es lo esperado: tu tarea es ponerlos en verde.

> Requisito: Node.js >= 20. Si tienes una version vieja: `nvm install 20 && nvm use 20`.

---

## Si es tu primera vez: empieza por C0

Abre [`docs/WALKTHROUGH.md`](docs/WALKTHROUGH.md). C0 esta resuelto paso a paso para que veas
el loop completo:

```
implementacion junior  ->  tests rojos  ->  identificar smell  ->
   aplicar tecnica  ->  tests verdes  ->  documentar en ENTREGABLE
```

Repite el mismo loop en C1..C6.

---

## Los retos

| Reto | Smell principal | Tecnica clave | Archivo a editar |
|------|------------------|----------------|------------------|
| C0 | Codigo duplicado + metodo largo | Extract Method | `src/challenges/c0_warmup_total.js` |
| C1 | Switch excesivo | Replace Conditional with Polymorphism | `src/challenges/c1_discount.js` |
| C2 | Lista larga de parametros + anidamiento | Introduce Parameter Object + Guard Clauses | `src/challenges/c2_user_role_access.js` |
| C3 | Obsesion primitiva | Parameter Object + filter().join() | `src/challenges/c3_format_address.js` |
| C4 | Metodo largo / God function | Extract Method (Compose Method) | `src/challenges/c4_invoice_summary.js` |
| C5 | Codigo duplicado | DRY + tabla de reglas | `src/challenges/c5_validators.js` |
| C6 | God function + switch + long params | Strategy + Factory + DI | `src/challenges/c6_report_builder.js` |

Lee `docs/SMELLS_REFERENCE.md` y `docs/REFACTOR_CHEATSHEET.md` para repaso rapido.

---

## Quality gates: que castigan los tests

Cada reto mide:

- **LOC** maximos por funcion (lineas de codigo no vacias)
- **Complejidad ciclomatica** (McCabe)
- **Profundidad de anidamiento** maxima
- **Numero de parametros** maximo o exacto
- Presencia de **`switch`**
- Numero de **`if`** / `else if`
- **`+=`** sobre strings (concat manual)
- **Duplicacion** detectable entre fragmentos del archivo

Cuando un quality gate falla, el mensaje **nombra el smell** y sugiere la **tecnica** de refactor a aplicar.

---

## Dashboard web

`npm start` abre http://localhost:3000:

- **`/`** Grid de retos con badge pass/fail y boton "Correr tests"
- **`/challenge/:id`** Enunciado, restricciones y ultimo resultado de un reto
- **`/leaderboard`** Ranking local (por retos verdes y tiempo total)
- **`/submit`** Registra tu nombre/matricula para aparecer en el leaderboard
- **`/finalize`** Cierra tu tiempo final cuando terminaste

El dashboard corre `jest` en subprocess y muestra resultados en vivo. CLI sigue siendo la fuente de verdad (`npm test`).

---

## Scripts npm

| Comando | Que hace |
|---------|----------|
| `npm start` | Levanta dashboard en :3000 |
| `npm test` | Corre toda la suite |
| `npm run test:c0` ... `test:c6` | Solo un reto |
| `npm run test:watch` | Watch mode |
| `npm run quality` | Reporte de calidad por archivo (sin Jest) |
| `npm run lock-tests` | Recalcula hashes de integridad (solo profesor) |

---

## Cheatsheets

- [`docs/PRESENTACION.html`](docs/PRESENTACION.html) - introduccion al taller (~15 min, abrir en navegador)
- [`docs/SMELLS_REFERENCE.md`](docs/SMELLS_REFERENCE.md) - los 11 code smells con sintoma y fix
- [`docs/REFACTOR_CHEATSHEET.md`](docs/REFACTOR_CHEATSHEET.md) - 9 tecnicas con plantillas antes/despues
- [`docs/WALKTHROUGH.md`](docs/WALKTHROUGH.md) - C0 resuelto paso a paso
- [`docs/ENTREGABLE.md`](docs/ENTREGABLE.md) - plantilla a llenar (parte de la calificacion)
- [`docs/INSTRUCTOR_NOTES.md`](docs/INSTRUCTOR_NOTES.md) - guia del profesor

---

## Stack

Node.js 20+ - Express - EJS - Jest - @babel/parser - jscpd. Sin DB. Sin Docker.
