const { Q, challengePath, loadChallenge } = require('./helpers');

const FILE = challengePath('c0_warmup_total.js');

describe('C0 - Warm-up: totalCarrito (Code smells: Metodo largo, Codigo duplicado)', () => {
  let totalCarrito;
  beforeAll(() => {
    totalCarrito = loadChallenge('c0_warmup_total.js').totalCarrito;
  });

  describe('Correctitud', () => {
    test('carrito vacio retorna 0', () => {
      expect(totalCarrito([])).toBe(0);
    });

    test('un producto sin envio aplica IVA 16%', () => {
      const result = totalCarrito([{ precio: 100, cantidad: 1, esEnvio: false }]);
      expect(result).toBeCloseTo(116, 2);
    });

    test('producto con cantidad multiple aplica IVA correctamente', () => {
      const result = totalCarrito([{ precio: 50, cantidad: 3, esEnvio: false }]);
      expect(result).toBeCloseTo(174, 2);
    });

    test('item de envio NO lleva IVA', () => {
      const result = totalCarrito([{ precio: 80, cantidad: 1, esEnvio: true }]);
      expect(result).toBeCloseTo(80, 2);
    });

    test('mezcla de productos y envio suma correctamente', () => {
      const items = [
        { precio: 100, cantidad: 2, esEnvio: false },
        { precio: 50, cantidad: 1, esEnvio: true },
      ];
      expect(totalCarrito(items)).toBeCloseTo(282, 2);
    });

    test('precios decimales se manejan correctamente', () => {
      const result = totalCarrito([{ precio: 19.99, cantidad: 2, esEnvio: false }]);
      expect(result).toBeCloseTo(46.3768, 2);
    });
  });

  describe('Quality gates', () => {
    test('totalCarrito no excede 8 lineas (Metodo largo)', () => {
      Q.expectMaxLines(FILE, 'totalCarrito', 8);
    });

    test('totalCarrito tiene complejidad ciclomatica <= 3', () => {
      Q.expectMaxComplexity(FILE, 'totalCarrito', 3);
    });

    test('totalCarrito no anida mas de 2 niveles', () => {
      Q.expectMaxDepth(FILE, 'totalCarrito', 2);
    });

    test('no se usa switch en este reto', () => {
      Q.expectNoSwitch(FILE);
    });
  });
});
