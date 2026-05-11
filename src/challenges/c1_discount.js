// =============================================================
// C1 - Calculo de descuento por tipo de cliente
// =============================================================
//
// Implementa: calcularDescuento(tipoCliente, monto)
//
// Tabla de descuentos:
//   regular   -> 0%
//   plata     -> 5%
//   oro       -> 10%
//   diamante  -> 15%
//   empleado  -> 25%
//
// - Retorna el MONTO de descuento (no el total con descuento aplicado)
// - tipo desconocido -> throw new Error(...)
// - monto negativo   -> throw new Error(...)
//
// Restricciones que validan los tests:
//   - PROHIBIDO usar switch (Replace Conditional with Polymorphism)
//   - Maximo 2 "if" en la funcion
//   - calcularDescuento <= 10 lineas
//   - complejidad ciclomatica <= 3
//
// Hint pedagogico: el junior siempre intenta switch o if/else if encadenado.
// El refactor limpio es un MAP de tasas y un lookup.
// =============================================================

function calcularDescuento(tipoCliente, monto) {
  // TODO: implementar
  return 0;
}

module.exports = { calcularDescuento };
