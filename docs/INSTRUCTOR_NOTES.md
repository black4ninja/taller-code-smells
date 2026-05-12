# Notas para el Instructor

Guía operativa del taller. **No compartir con alumnos.**

---

## Cronograma sugerido (~1h 55min total con intro)

| Tiempo | Actividad |
|--------|-----------|
| 0-15 min | **Presentación** (abre `docs/PRESENTACION.html` en navegador, modo pantalla completa con la tecla `F`) |
| 15-25 min | Setup: clonar, `npm install`, `npm start`, `npm test` |
| 25-35 min | Walkthrough C0 en pantalla (sigue `docs/WALKTHROUGH.md`) |
| 35-50 min | Trabajo C1 (~13 min) + check de progreso |
| 50-65 min | Trabajo C2 (~13 min) |
| 65-80 min | Trabajo C3 (~13 min) |
| 80-95 min | Trabajo C4 (~13 min) |
| 95-110 min | Trabajo C5 (~13 min) |
| 110-120 min | Trabajo C6 (~10 min) + cierre: leaderboard y reflexión |

> Si necesitas apretar a 1h 40min, salta el bloque de setup (que cada alumno lo haga antes de llegar) y comienza con presentación + walkthrough C0 = 25 min, dejando 75 min para los 6 retos (~12 min c/u).

---

## Antes del taller

1. Asegúrate de que la rama `main` está lista con todo el scaffolding **y los retos vacíos**.
2. Corre `npm run lock-tests` en `main` para fijar hashes.
3. Verifica que `npm test` muestra los 7 bloques rojos esperados.
4. Tag `v1.0-baseline`.
5. Crea la branch `solution` con las implementaciones limpias (NO hacer push al remoto).
6. Tag `v1.0-solution`.
7. Comparte el remoto con los alumnos (default branch: `main`).

---

## Durante el taller

### Comandos útiles

- **Ver el progreso de un alumno:**
  ```bash
  ssh alumno@maquina  # o pídele que comparta pantalla
  npm test 2>&1 | grep -E '(PASS|FAIL)'
  ```
- **Validar entrega final:**
  ```bash
  cat data/leaderboard.json | jq .
  ```
- **Detectar trampa (alumno modificó tests o quality lib):**
  ```bash
  npm test 2>&1 | grep -i integridad
  ```

### Hints para dar (sin spoilear)

- **C1 atorado:** "¿Qué pasaría si las tasas fueran un objeto en lugar de un `switch`?"
- **C2 atorado:** "¿Cuántos parámetros máximos te permite el test? ¿Cómo agrupar lo del usuario y lo del recurso?"
- **C3 atorado:** "¿Qué pasa si pones los valores en un array y filtras los vacíos?"
- **C4 atorado:** "¿Puedes reusar código de C1 y C3?"
- **C5 atorado:** "Si en vez de una función por tipo, iteras el esquema con `Object.entries`..."
- **C6 atorado:** "¿Cuántos formatters distintos hay? ¿Qué tal un objeto donde la key es el tipo?"

---

## Soluciones (branch solution)

Consulta la branch `solution` para las implementaciones limpias. Resumen:

- **C0** ~10 LOC: helper `precioConIva` + `reduce`.
- **C1** ~8 LOC: const `TASAS`, lookup + check de `undefined` + check de monto < 0.
- **C2** ~9 LOC: 4 guard clauses (`banned`, `admin`, `publico`, `owner`).
- **C3** ~5 LOC: `[[calle, numero].filter().join(' '), colonia, [ciudad, estado, cp].filter().join(' '), pais].filter().join(', ')`.
- **C4** ~6 LOC en `resumenFactura` + 3 helpers (subtotal, impuestos).
- **C5** ~10 LOC en `validar` con un mapa `{ string: fn, number: fn, boolean: fn }`.
- **C6** ~5 LOC en `generarReporte` + 4 formatters cortos.

### Nota sobre C5 y el quality gate `expectFunctionCount`

El detector ignora por default las arrow functions usadas como **valor de una propiedad de objeto literal** (ej. `{ string: (v) => v.length }`). Es deliberado: las estrategias dentro de una tabla de reglas son datos, no unidades de lógica reutilizables. Así, la solución idiomática de C5 (un mapa de estrategias por tipo con arrows) cumple el límite de `max: 3` funciones aunque tenga 3-4 arrows en el mapa.

Si en algún futuro reto quieres que SÍ cuenten, pasa `includeObjectValues: true` al asserter.

---

## Troubleshooting

| Problema | Solución |
|----------|----------|
| `npm install` falla por `better-sqlite3` | El taller NO requiere nativos. Verifica que el alumno clonó el repo correcto. |
| `npm test` truena con `MODULE_NOT_FOUND @babel/parser` | Falta `npm install`. |
| Tests pasan en local pero `integridad` falla | El alumno editó un test o `src/lib/quality/*`. Restaura desde git. |
| Dashboard no actualiza el badge | El polling JS no espera más de 36 segundos. Si el subproceso tarda más, ver consola de jest. |
| `EADDRINUSE :3000` | Otro proceso usa el puerto. Usa `PORT=3001 npm start`. |

---

## Calificación final

Recibe del alumno:

1. URL del repo o fork con su trabajo
2. `docs/ENTREGABLE.md` lleno
3. Captura del leaderboard mostrando su posición

Corre en su clon:

```bash
git checkout <su-rama>
npm install
npm test  # cuenta cuántos retos quedaron en verde
```

Verifica integridad: si `C_integrity.test.js` falla, el alumno hizo trampa y se descuenta según la política de la clase.

---

## Después del taller

- Empuja la branch `solution` al remoto para que los alumnos puedan revisarla.
- Comparte el ranking final con la clase.
