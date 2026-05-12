# Notas para el Instructor

Guia operativa del taller. **No compartir con alumnos.**

---

## Cronograma sugerido (1h 40min)

| Tiempo | Actividad |
|--------|-----------|
| 0-10 min | Setup: clonar, `npm install`, `npm start`, `npm test` |
| 10-20 min | Walkthrough C0 en pantalla (sigue `docs/WALKTHROUGH.md`) |
| 20-35 min | Trabajo C1 (~13 min) + check de progreso |
| 35-50 min | Trabajo C2 (~13 min) |
| 50-65 min | Trabajo C3 (~13 min) |
| 65-80 min | Trabajo C4 (~13 min) |
| 80-95 min | Trabajo C5 (~13 min) |
| 95-105 min | Trabajo C6 (~10 min final apretado) |
| 105-110 min | Cierre: leaderboard, reflexion, premios |

---

## Antes del taller

1. Asegurate de que la rama `main` esta lista con todo el scaffolding **y los retos vacios**.
2. Corre `npm run lock-tests` en main para fijar hashes.
3. Verifica que `npm test` muestra 7 bloques rojos esperados.
4. Tag `v1.0-baseline`.
5. Crea branch `solution` con las implementaciones limpias (NO push al remote).
6. Tag `v1.0-solution`.
7. Comparte el remote con alumnos (default branch: `main`).

---

## Durante el taller

### Comandos utiles

- **Ver el progreso de un alumno:**
  ```bash
  ssh alumno@maquina  # o pidele que comparta pantalla
  npm test 2>&1 | grep -E '(PASS|FAIL)'
  ```
- **Validar entrega final:**
  ```bash
  cat data/leaderboard.json | jq .
  ```
- **Detectar trampa (alumno modifico tests o quality lib):**
  ```bash
  npm test 2>&1 | grep -i integridad
  ```

### Hints para dar (sin spoilear)

- **C1 atorado:** "Que pasaria si las tasas fueran un objeto en lugar de un switch?"
- **C2 atorado:** "Cuantos parametros maximos te permite el test? Como agrupar lo de usuario y lo de recurso?"
- **C3 atorado:** "Que pasa si pones los valores en un array y filtras vacios?"
- **C4 atorado:** "Puedes reusar codigo de C1 y C3?"
- **C5 atorado:** "Si en vez de una funcion por tipo, iteras el esquema con `Object.entries`..."
- **C6 atorado:** "Cuantos formatters distintos hay? Que tal un objeto donde la key es el tipo?"

---

## Soluciones (branch solution)

Ver el branch `solution` para las implementaciones limpias. Resumen:

- **C0** ~10 LOC: helper `precioConIva` + `reduce`.
- **C1** ~8 LOC: const `TASAS`, lookup + check de undefined + check de monto < 0.
- **C2** ~9 LOC: 4 guard clauses (banned, admin, publico, owner).
- **C3** ~5 LOC: `[[calle, numero].filter().join(' '), colonia, [ciudad, estado, cp].filter().join(' '), pais].filter().join(', ')`.
- **C4** ~6 LOC en `resumenFactura` + 3 helpers (subtotal, impuestos).
- **C5** ~10 LOC en `validar` con un mapa `{ string: fn, number: fn, boolean: fn }`.
- **C6** ~5 LOC en `generarReporte` + 4 formatters cortos.

### Nota sobre C5 y el quality gate `expectFunctionCount`

El detector ignora por default las arrow functions usadas como **valor de propiedad de un object literal** (ej. `{ string: (v) => v.length }`). Esto es deliberado: las estrategias dentro de una tabla de reglas son datos, no unidades de logica reutilizables. Asi, la solucion idiomatica de C5 (un mapa de estrategias por tipo con arrows) cumple el limite de `max: 3` funciones aunque tenga 3-4 arrows en el mapa.

Si en algun futuro reto quieres que SI cuenten, pasa `includeObjectValues: true` al asserter.

---

## Troubleshooting

| Problema | Solucion |
|----------|----------|
| `npm install` falla por `better-sqlite3` | El taller NO requiere nativos. Verifica que el alumno clono el repo correcto. |
| `npm test` truena con `MODULE_NOT_FOUND @babel/parser` | Falta `npm install`. |
| Tests pasan en local pero `integridad` falla | Alumno edito un test o `src/lib/quality/*`. Restaura desde git. |
| Dashboard no actualiza el badge | El polling JS no espera mas de 36 segundos. Si el subprocess tarda mas, ver consola de jest. |
| `EADDRINUSE :3000` | Otro proceso usa el puerto. `PORT=3001 npm start`. |

---

## Calificacion final

Recibe del alumno:

1. URL del repo o fork con su trabajo
2. `docs/ENTREGABLE.md` lleno
3. Captura del leaderboard mostrando su posicion

Corre en su clon:

```bash
git checkout <su-rama>
npm install
npm test  # cuenta cuantos retos en verde
```

Verifica integridad: si `C_integrity.test.js` falla, alumno hizo trampa y se descuenta segun politica de la clase.

---

## Despues del taller

- Pushea la branch `solution` al remote para que los alumnos puedan revisar.
- Comparte el ranking final con la clase.
