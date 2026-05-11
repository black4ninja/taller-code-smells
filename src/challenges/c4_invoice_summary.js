// =============================================================
// C4 - Resumen de factura (integrador)
// =============================================================
//
// Implementa: resumenFactura(factura)
//
// - factura: {
//     cliente: { tipo: 'regular'|'plata'|'oro'|'diamante'|'empleado', nombre },
//     items:   [ { precio: number, cantidad: number } ],
//     direccion: { calle, numero, colonia, ciudad, estado, cp, pais }
//   }
//
// Retorna: {
//   subtotal:        suma de precio*cantidad de todos los items
//   descuento:       monto descontado segun tipo de cliente (reusa C1)
//   iva:             16% sobre (subtotal - descuento)
//   total:           subtotal - descuento + iva
//   lineaDireccion:  string formateado (reusa C3)
// }
//
// Restricciones que validan los tests:
//   - resumenFactura <= 10 lineas
//   - archivo completo <= 60 lineas no vacias
//   - el archivo define AL MENOS 3 funciones (SRP)
//   - sin duplicacion (jscpd / detector simple)
//
// Hint pedagogico: el junior hace TODO en una funcion de 50 lineas.
// El refactor limpio extrae helpers (calcSubtotal, calcImpuestos, etc.)
// y REUSA C1 y C3 via require.
// =============================================================

// Puedes importar de C1 y C3:
// const { calcularDescuento } = require('./c1_discount');
// const { formatearDireccion } = require('./c3_format_address');

function resumenFactura(factura) {
  // TODO: implementar
  return { subtotal: 0, descuento: 0, iva: 0, total: 0, lineaDireccion: '' };
}

module.exports = { resumenFactura };
