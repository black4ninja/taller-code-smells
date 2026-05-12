# Walkthrough — C0 resuelto paso a paso

> C0 es el ejemplo guiado. Sigues estos 8 pasos y repites el patrón en C1..C6.

---

## Paso 1 — Lee el test

Abre `tests/refactor/C0_warmup.test.js`. Te pide:

- `totalCarrito([]) === 0`
- Aplicar IVA 16% a items con `esEnvio = false`
- Los envíos NO llevan IVA
- **Quality:** `totalCarrito` ≤ 8 LOC, complejidad ≤ 3, profundidad ≤ 2, sin `switch`

## Paso 2 — Escribe la primera versión (la que se te ocurra de inmediato)

Abre `src/challenges/c0_warmup_total.js` y escribe:

```js
function totalCarrito(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.esEnvio) {
      total = total + item.precio * item.cantidad;
    } else {
      const sub = item.precio * item.cantidad;
      const iva = sub * 0.16;
      total = total + sub + iva;
    }
  }
  return total;
}

module.exports = { totalCarrito };
```

## Paso 3 — Corre los tests y observa rojo

```bash
npm run test:c0
```

Resultado esperado:

- Correctitud: 6/6 PASA
- Quality: falla `totalCarrito no excede 8 lineas` con mensaje:

  > La función "totalCarrito" tiene 11 líneas (límite: 8).
  > Smell: **Método largo**.
  > Técnica sugerida: **Extract Method**.

## Paso 4 — Identifica el smell

El test mismo te dice el smell. Mira tu código: `precio * cantidad` aparece **dos veces**.
Las dos ramas del `if/else` son **simétricas** (envío = base; no envío = base × 1.16).

## Paso 5 — Elige la técnica

- "Método largo" + duplicación → **Extract Method**
- Rama simétrica → simplificar con **operador ternario**

## Paso 6 — Refactoriza

```js
const IVA = 0.16;

function precioConIva(item) {
  const base = item.precio * item.cantidad;
  return item.esEnvio ? base : base * (1 + IVA);
}

function totalCarrito(items) {
  return items.reduce((sum, it) => sum + precioConIva(it), 0);
}

module.exports = { totalCarrito };
```

## Paso 7 — Vuelve a correr

```bash
npm run test:c0
```

Ahora `totalCarrito` tiene 3 líneas. Quality verde. Correctitud verde.

## Paso 8 — Documenta tu refactor

Abre `docs/ENTREGABLE.md` y llena la fila de C0:

| Reto | Smell | Técnica | LOC antes / después | Reflexión |
|------|-------|---------|---------------------|-----------|
| C0 | Método largo + duplicación de cálculo | Extract Method (`precioConIva`) + ternario | 11 / 3 | El IVA condicional reemplazó las dos ramas simétricas. |

---

## Checklist mental para C1..C6

- [ ] Leí el test y entiendo qué pide (correctitud + quality)
- [ ] Implementé la primera versión (la que se me ocurrió de inmediato)
- [ ] Vi el rojo y el mensaje del test me dijo el smell
- [ ] Elegí **una sola** técnica de refactor
- [ ] La apliqué; todos los tests están verdes
- [ ] Llené mi fila en `ENTREGABLE.md`

> Si te atascas más de 10 minutos en un reto, relee este walkthrough y aplica el loop.
> Los smells cambian; el método no.
