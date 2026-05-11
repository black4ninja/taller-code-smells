// =============================================================
// C5 - Validador de payload por esquema
// =============================================================
//
// Implementa: validar(payload, esquema)
//
// - payload: objeto con valores arbitrarios
// - esquema: {
//     campo: { tipo: 'string'|'number'|'boolean', requerido: bool, min?, max? }
//   }
//
// Reglas:
//   - Si requerido y el campo falta -> error "campo X es requerido"
//   - Si typeof no coincide con tipo -> error "campo X debe ser tipo Y"
//   - Para 'string': min/max validan length
//   - Para 'number': min/max validan valor
//
// Retorna: { valido: boolean, errores: string[] }
//   - valido: true sii errores.length === 0
//
// Restricciones que validan los tests:
//   - El archivo define MAXIMO 3 funciones (sin copy-paste por tipo)
//   - PROHIBIDO usar switch
//   - validar tiene complejidad ciclomatica <= 6
//   - Sin duplicacion entre fragmentos
//
// Hint pedagogico: el junior hace validarNombre, validarEmail, validarEdad...
// El refactor DRY itera el esquema con un mapa de validadores por tipo.
// =============================================================

function validar(payload, esquema) {
  // TODO: implementar
  return { valido: true, errores: [] };
}

module.exports = { validar };
