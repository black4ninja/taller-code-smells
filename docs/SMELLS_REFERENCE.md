# Smells Reference — 11 code smells del temario

Resumen rapido (sintoma -> ejemplo -> tecnica).

---

## 1. Rigidez

**Sintoma:** Dificultad para cambiar el software, incluso de formas sencillas. Un cambio
en una clase provoca cambios en muchas otras.

**Ejemplo:** Una funcion con 6 niveles de `if/else` anidados.

**Tecnicas:** Guard Clauses, Extract Method, Polymorphism.

---

## 2. Fragilidad

**Sintoma:** Tendencia a romperse en multiples lugares con un solo cambio. Logica copy-pasted
que no se actualiza en todas partes.

**Ejemplo:** Validaciones duplicadas en 4 endpoints distintos.

**Tecnicas:** Extract Method, DRY, single source of truth.

---

## 3. Inmovilidad

**Sintoma:** No puedes reutilizar componentes en otros proyectos porque dependen de detalles
internos.

**Tecnicas:** Dependency Injection, Extract Interface.

---

## 4. Viscosidad

**Sintoma:** Es mas facil hacer lo incorrecto que lo correcto. El "atajo malo" es mas comodo
que el "camino limpio".

**Tecnicas:** Refactor + utilidades comunes para que la cosa correcta sea trivial.

---

## 5. Codigo duplicado

**Sintoma:** Mismo bloque (literal, semantico o por coincidencia) aparece en mas de un lugar.

**Ejemplo:** Tres funciones `validarNombre`, `validarEmail`, `validarEdad` con la misma
estructura `if(!x) errors.push(...)`.

**Tecnica:** **Extract Method** + tabla de reglas / mapa de validadores.

---

## 6. Metodo largo

**Sintoma:** Una funcion con mas de 15-20 lineas.

**Ejemplo:** Funcion que valida, calcula, formatea y persiste en una sola pieza.

**Tecnica:** **Extract Method** (Compose Method). Una funcion = una idea.

---

## 7. Clase grande / God function

**Sintoma:** Una clase con > 200-300 lineas o > 10 metodos publicos. Hace demasiadas cosas.

**Tecnica:** **Extract Class**, separar por **SRP**.

---

## 8. Lista larga de parametros

**Sintoma:** Funcion que recibe mas de 3-4 parametros sueltos.

**Ejemplo:** `puedeAcceder(userId, role, banned, recursoId, ownerId, esPublic, ahora)`.

**Tecnica:** **Introduce Parameter Object** -> `puedeAcceder(user, recurso)`.

---

## 9. Obsesion primitiva

**Sintoma:** Usar strings, ints o booleanos para representar conceptos de dominio
(emails, dinero, IDs, direcciones).

**Ejemplo:** Pasar 7 strings sueltos por una direccion postal.

**Tecnica:** **Extract Class** (`Direccion`), Parameter Object, value objects.

---

## 10. Envidia de caracteristicas

**Sintoma:** Un metodo esta mas interesado en los datos de otra clase que en los propios:
hace muchos `otro.x`, `otro.y`, `otro.z`.

**Tecnica:** **Move Method** a la clase correcta. "Tell, Don't Ask".

---

## 11. Switch statements excesivos

**Sintoma:** `switch(tipo)` con muchas ramas. Cada vez que agregas un tipo, tocas el
switch (violacion **OCP**).

**Ejemplo:** `switch(tipoCliente) { case 'regular': ... case 'plata': ... }`.

**Tecnica:** **Replace Conditional with Polymorphism** -> map de estrategias o subclases.

---

## Heuristicas rapidas

- **Regla del WTF:** si una linea te hace decir "wtf?", es un smell
- **Regla de la linea vacia:** si necesitas separar codigo con lineas vacias dentro de una funcion, probablemente quieres Extract Method
- **Regla del comentario:** si tienes que explicar algo con comentario, probablemente la funcion deberia llamarse asi
- **Regla del pulgar:** si una funcion no cabe en tu pantalla sin scroll, es muy larga
- **Regla del highlighter:** si dos bloques de codigo se ven identicos al destacarlos, son duplicacion
