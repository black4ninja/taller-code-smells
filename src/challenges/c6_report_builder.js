// =============================================================
// C6 - Generador de reportes (integrador final)
// =============================================================
//
// Implementa: generarReporte(tipo, datos, opciones)
//
// - tipo:     'json' | 'csv' | 'markdown' | 'plain'
// - datos:    array de objetos planos { col1, col2, ... }
// - opciones: objeto opcional (separador, encabezados, etc.)
//
// Retorna: string formateado segun el tipo
//   - json:     JSON.stringify(datos, null, 2)
//   - csv:      encabezado + filas con separador ","
//   - markdown: tabla con | y separador de header
//   - plain:    texto plano legible
//
// Tipo desconocido -> throw new Error(...)
//
// Restricciones que validan los tests:
//   - generarReporte recibe maximo 3 parametros
//   - PROHIBIDO usar switch (Strategy pattern via objeto)
//   - generarReporte <= 8 lineas
//   - archivo completo <= 80 lineas no vacias
//   - TODA funcion del archivo <= 15 lineas
//   - sin duplicacion entre formatters
//
// Hint pedagogico: el junior hace switch(tipo) con 4 ramas inline.
// El refactor con Strategy es:
//   const FORMATTERS = { json: fmtJson, csv: fmtCsv, ... };
//   const fmt = FORMATTERS[tipo] || throw...
//   return fmt(datos, opciones);
// =============================================================

function generarReporte(tipo, datos, opciones) {
  // TODO: implementar
  return '';
}

module.exports = { generarReporte };
