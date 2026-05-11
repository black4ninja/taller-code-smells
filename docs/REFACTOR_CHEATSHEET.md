# Refactor Cheatsheet — 9 tecnicas con plantillas antes/despues

> Reglas de oro: nunca refactorices sin tests · cambios pequenos · commit despues de cada uno · separa refactor de features.

---

## Extract Method

Saca un bloque cohesivo a una funcion con nombre.

**Antes:**
```js
function imprimirReporte(ventas) {
  let total = 0;
  for (const v of ventas) total += v.precio * v.cantidad;
  console.log('Subtotal:', total);
  const iva = total * 0.16;
  console.log('IVA:', iva);
  console.log('Total:', total + iva);
}
```

**Despues:**
```js
function calcularSubtotal(ventas) {
  return ventas.reduce((s, v) => s + v.precio * v.cantidad, 0);
}

function imprimirReporte(ventas) {
  const subtotal = calcularSubtotal(ventas);
  const iva = subtotal * 0.16;
  console.log(`Subtotal: ${subtotal}\nIVA: ${iva}\nTotal: ${subtotal + iva}`);
}
```

---

## Replace Conditional with Polymorphism

Mata el `switch` con un map / strategy.

**Antes:**
```js
function calcularDescuento(tipo, monto) {
  switch (tipo) {
    case 'regular': return 0;
    case 'plata':   return monto * 0.05;
    case 'oro':     return monto * 0.10;
    case 'diamante': return monto * 0.15;
    default: throw new Error('tipo desconocido');
  }
}
```

**Despues:**
```js
const TASAS = { regular: 0, plata: 0.05, oro: 0.10, diamante: 0.15 };

function calcularDescuento(tipo, monto) {
  const tasa = TASAS[tipo];
  if (tasa === undefined) throw new Error('tipo desconocido');
  return monto * tasa;
}
```

---

## Introduce Parameter Object

Agrupa parametros relacionados en un objeto.

**Antes:**
```js
function puedeAcceder(userId, role, banned, recursoId, ownerId, esPublic, ahora) { ... }
```

**Despues:**
```js
function puedeAcceder(user, recurso) {
  if (user.banned) return false;
  if (user.role === 'admin') return true;
  if (recurso.esPublico) return true;
  return user.id === recurso.ownerId;
}
```

---

## Extract Class

Saca campos y metodos relacionados a una clase nueva (o value object).

**Antes:**
```js
function formatear(calle, numero, colonia, ciudad, estado, cp, pais) {
  let r = '';
  if (calle) r += calle;
  if (numero) r += ' ' + numero;
  ...
}
```

**Despues:**
```js
function formatearDireccion(dir) {
  return [
    [dir.calle, dir.numero].filter(Boolean).join(' '),
    dir.colonia,
    [dir.ciudad, dir.estado, dir.cp].filter(Boolean).join(' '),
    dir.pais
  ].filter(Boolean).join(', ');
}
```

---

## Move Method

Si un metodo usa mas datos de otra clase que de la propia, **mueve el metodo** a esa clase.

**Antes:** `Cuenta.calcularInteres(otraCuenta)` que solo lee de `otraCuenta`.
**Despues:** `OtraCuenta.calcularInteres()`.

---

## Guard Clauses (Early Return)

Reemplaza `if/else` anidado con returns tempranos.

**Antes:**
```js
function f(x) {
  if (x.valido) {
    if (!x.banned) {
      if (x.role === 'admin') {
        return true;
      } else { return false; }
    } else { return false; }
  } else { return false; }
}
```

**Despues:**
```js
function f(x) {
  if (!x.valido) return false;
  if (x.banned) return false;
  return x.role === 'admin';
}
```

---

## Compose Method

Una funcion de alto nivel solo orquesta llamadas a otras funciones (no calcula).

**Antes:** 50 lineas mezclando subtotal, IVA, descuento, formato.

**Despues:**
```js
function resumenFactura(f) {
  const subtotal = calcSubtotal(f.items);
  const descuento = calcularDescuento(f.cliente.tipo, subtotal);
  const iva = (subtotal - descuento) * 0.16;
  return {
    subtotal, descuento, iva,
    total: subtotal - descuento + iva,
    lineaDireccion: formatearDireccion(f.direccion),
  };
}
```

---

## Introduce Null Object

En vez de `if (x === null) ...` en todas partes, usa un objeto "nulo" con defaults.

**Antes:** `const total = (user && user.descuento) || 0`
**Despues:** `function getUser(id) { return DB.find(id) || { descuento: 0 } }`

---

## Dependency Injection

En vez de instanciar dependencias adentro, recibelas por parametro/constructor.

**Antes:**
```js
function sendNotification(msg) {
  const email = new EmailService();
  email.send(msg);
}
```

**Despues:**
```js
function sendNotification(msg, notifier) {
  notifier.send(msg);
}
```

---

## Cuando usar cada una (decision rapida)

| Sintoma | Tecnica |
|---------|---------|
| funcion larga | Extract Method |
| switch(tipo) | Replace Conditional with Polymorphism |
| 5+ parametros | Introduce Parameter Object |
| muchos strings primitivos del mismo concepto | Extract Class / Parameter Object |
| ifs anidados | Guard Clauses |
| codigo casi identico en 2+ lugares | Extract Method + DRY |
| metodo lee mas de otra clase | Move Method |
| `if (x === null)` repetido | Introduce Null Object |
| hard-coded new ServiceX() | Dependency Injection |
