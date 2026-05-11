const CHALLENGES = [
  {
    id: 'C0',
    titulo: 'Warm-up: Total del carrito',
    smell: 'Metodo largo + Codigo duplicado',
    tecnica: 'Extract Method',
    principios: 'DRY, KISS',
    archivo: 'src/challenges/c0_warmup_total.js',
    testPattern: 'tests/refactor/C0',
    tiempoMin: 10,
    descripcion: 'Implementa totalCarrito(items). Aplica IVA 16% a productos no-envio. ' +
      'El junior repite precio*cantidad en dos ramas; el test te empuja a Extract Method.',
    restricciones: [
      'totalCarrito <= 8 lineas',
      'complejidad ciclomatica <= 3',
      'profundidad de anidamiento <= 2',
      'sin switch',
    ],
  },
  {
    id: 'C1',
    titulo: 'Descuento por tipo de cliente',
    smell: 'Switch excesivo + Rigidez',
    tecnica: 'Replace Conditional with Polymorphism (map de estrategias)',
    principios: 'OCP',
    archivo: 'src/challenges/c1_discount.js',
    testPattern: 'tests/refactor/C1',
    tiempoMin: 13,
    descripcion: 'Implementa calcularDescuento(tipo, monto). 5 tipos de cliente con tasas distintas. ' +
      'Sin switch ni cadenas de if/else if: usa un MAP.',
    restricciones: [
      'PROHIBIDO switch',
      'maximo 2 if',
      '<= 10 lineas',
      'complejidad <= 3',
    ],
  },
  {
    id: 'C2',
    titulo: 'Acceso de usuario a recurso',
    smell: 'Lista larga de parametros + Anidamiento',
    tecnica: 'Introduce Parameter Object + Guard Clauses',
    principios: 'SRP, Tell Don\'t Ask',
    archivo: 'src/challenges/c2_user_role_access.js',
    testPattern: 'tests/refactor/C2',
    tiempoMin: 13,
    descripcion: 'Implementa puedeAcceder(user, recurso). Agrupa los 7 parametros primitivos del junior ' +
      'en dos objetos y usa early returns.',
    restricciones: [
      'exactamente 2 parametros',
      'depth <= 1',
      '<= 12 lineas',
      'complejidad <= 5',
    ],
  },
  {
    id: 'C3',
    titulo: 'Formatear direccion postal',
    smell: 'Obsesion primitiva + Concat manual',
    tecnica: 'Parameter Object + filter().join()',
    principios: 'SRP, encapsulacion',
    archivo: 'src/challenges/c3_format_address.js',
    testPattern: 'tests/refactor/C3',
    tiempoMin: 13,
    descripcion: 'Implementa formatearDireccion(dir). Junta los campos no vacios con ", ". ' +
      'PROHIBIDO usar "+=" sobre strings.',
    restricciones: [
      'exactamente 1 parametro',
      '<= 8 lineas',
      'maximo 2 if',
      'sin += sobre strings',
    ],
  },
  {
    id: 'C4',
    titulo: 'Resumen de factura',
    smell: 'Metodo largo + God function + Envidia',
    tecnica: 'Extract Method (Compose Method)',
    principios: 'SRP, KISS',
    archivo: 'src/challenges/c4_invoice_summary.js',
    testPattern: 'tests/refactor/C4',
    tiempoMin: 13,
    descripcion: 'Implementa resumenFactura(factura). Orquesta calculo de subtotal, descuento (reusa C1), ' +
      'IVA, total y direccion (reusa C3).',
    restricciones: [
      'resumenFactura <= 10 lineas',
      'archivo <= 60 lineas',
      'al menos 3 funciones',
      'sin duplicacion',
    ],
  },
  {
    id: 'C5',
    titulo: 'Validador de payload',
    smell: 'Codigo duplicado + Fragilidad',
    tecnica: 'Extract Method + tabla de reglas',
    principios: 'DRY, OCP',
    archivo: 'src/challenges/c5_validators.js',
    testPattern: 'tests/refactor/C5',
    tiempoMin: 13,
    descripcion: 'Implementa validar(payload, esquema). Itera el esquema con un mapa de validadores ' +
      'por tipo en vez de funciones copy-paste.',
    restricciones: [
      'maximo 3 funciones definidas',
      'sin switch',
      'complejidad <= 6',
      'sin duplicacion',
    ],
  },
  {
    id: 'C6',
    titulo: 'Generador de reportes',
    smell: 'God function + Switch + Long params',
    tecnica: 'Strategy + Factory + DI',
    principios: 'SOLID completo',
    archivo: 'src/challenges/c6_report_builder.js',
    testPattern: 'tests/refactor/C6',
    tiempoMin: 13,
    descripcion: 'Implementa generarReporte(tipo, datos, opciones) con 4 formatos. Registry de strategies, ' +
      'cada formatter en su propia funcion <= 15 LOC.',
    restricciones: [
      'maximo 3 parametros',
      'sin switch',
      'generarReporte <= 8 lineas',
      'archivo <= 80 lineas',
      'TODA funcion <= 15 lineas',
      'sin duplicacion',
    ],
  },
];

function getAll() {
  return CHALLENGES;
}

function getById(id) {
  return CHALLENGES.find((c) => c.id === id.toUpperCase());
}

module.exports = { getAll, getById };
