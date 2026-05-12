# Smells Reference — 11 code smells del temario

Resumen rápido (síntoma → ejemplo → técnica).

---

## 1. Rigidez

**Síntoma:** dificultad para cambiar el software, incluso de formas sencillas. Un cambio
en una clase provoca cambios en muchas otras.

**Ejemplo:** una función con 6 niveles de `if/else` anidados.

**Técnicas:** Guard Clauses, Extract Method, Polymorphism.

---

## 2. Fragilidad

**Síntoma:** tendencia a romperse en múltiples lugares con un solo cambio. Lógica copy-pasted
que no se actualiza en todas partes.

**Ejemplo:** validaciones duplicadas en 4 endpoints distintos.

**Técnicas:** Extract Method, DRY, single source of truth.

---

## 3. Inmovilidad

**Síntoma:** no puedes reutilizar componentes en otros proyectos porque dependen de detalles
internos.

**Técnicas:** Dependency Injection, Extract Interface.

---

## 4. Viscosidad

**Síntoma:** es más fácil hacer lo incorrecto que lo correcto. El "atajo malo" es más cómodo
que el "camino limpio".

**Técnicas:** refactor + utilidades comunes para que la opción correcta sea trivial.

---

## 5. Código duplicado

**Síntoma:** el mismo bloque (literal, semántico o por coincidencia) aparece en más de un lugar.

**Ejemplo:** tres funciones `validarNombre`, `validarEmail`, `validarEdad` con la misma
estructura `if(!x) errors.push(...)`.

**Técnica:** **Extract Method** + tabla de reglas / mapa de validadores.

---

## 6. Método largo

**Síntoma:** una función con más de 15-20 líneas.

**Ejemplo:** función que valida, calcula, formatea y persiste en una sola pieza.

**Técnica:** **Extract Method** (Compose Method). Una función = una idea.

---

## 7. Clase grande / God function

**Síntoma:** una clase con más de 200-300 líneas o más de 10 métodos públicos. Hace demasiadas cosas.

**Técnica:** **Extract Class**, separar por **SRP**.

---

## 8. Lista larga de parámetros

**Síntoma:** función que recibe más de 3-4 parámetros sueltos.

**Ejemplo:** `puedeAcceder(userId, role, banned, recursoId, ownerId, esPublic, ahora)`.

**Técnica:** **Introduce Parameter Object** → `puedeAcceder(user, recurso)`.

---

## 9. Obsesión primitiva

**Síntoma:** usar strings, ints o booleanos para representar conceptos de dominio
(emails, dinero, IDs, direcciones).

**Ejemplo:** pasar 7 strings sueltos por una dirección postal.

**Técnica:** **Extract Class** (`Direccion`), Parameter Object, value objects.

---

## 10. Envidia de características

**Síntoma:** un método está más interesado en los datos de otra clase que en los propios:
hace muchos `otro.x`, `otro.y`, `otro.z`.

**Técnica:** **Move Method** a la clase correcta. "Tell, Don't Ask".

---

## 11. Switch statements excesivos

**Síntoma:** `switch(tipo)` con muchas ramas. Cada vez que agregas un tipo, tocas el
switch (violación de **OCP**).

**Ejemplo:** `switch(tipoCliente) { case 'regular': ... case 'plata': ... }`.

**Técnica:** **Replace Conditional with Polymorphism** → mapa de estrategias o subclases.

---

## Heurísticas rápidas

- **Regla del WTF:** si una línea te hace decir "¿wtf?", es un smell.
- **Regla de la línea vacía:** si necesitas separar código con líneas vacías dentro de una función, probablemente quieras Extract Method.
- **Regla del comentario:** si tienes que explicar algo con un comentario, probablemente la función debería llamarse así.
- **Regla del pulgar:** si una función no cabe en tu pantalla sin scroll, es muy larga.
- **Regla del highlighter:** si dos bloques de código se ven idénticos al destacarlos, hay duplicación.
