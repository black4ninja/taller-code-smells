const { Q, challengePath, loadChallenge } = require('./helpers');

const FILE = challengePath('c1_discount.js');

describe('C1 - Descuento por tipo de cliente (Code smell: Switch excesivo)', () => {
  let calcularDescuento;
  beforeAll(() => {
    calcularDescuento = loadChallenge('c1_discount.js').calcularDescuento;
  });

  describe('Correctitud', () => {
    test('cliente regular: 0% de descuento', () => {
      expect(calcularDescuento('regular', 100)).toBeCloseTo(0, 2);
    });

    test('cliente plata: 5% de descuento', () => {
      expect(calcularDescuento('plata', 100)).toBeCloseTo(5, 2);
    });

    test('cliente oro: 10% de descuento', () => {
      expect(calcularDescuento('oro', 200)).toBeCloseTo(20, 2);
    });

    test('cliente diamante: 15% de descuento', () => {
      expect(calcularDescuento('diamante', 400)).toBeCloseTo(60, 2);
    });

    test('cliente empleado: 25% de descuento', () => {
      expect(calcularDescuento('empleado', 1000)).toBeCloseTo(250, 2);
    });

    test('tipo desconocido lanza Error', () => {
      expect(() => calcularDescuento('vip', 100)).toThrow();
    });

    test('monto negativo lanza Error', () => {
      expect(() => calcularDescuento('oro', -10)).toThrow();
    });
  });

  describe('Quality gates', () => {
    test('NO hay switch en el archivo (Replace Conditional with Polymorphism)', () => {
      Q.expectNoSwitch(FILE);
    });

    test('calcularDescuento usa como maximo 2 "if"', () => {
      Q.expectMaxIfCount(FILE, 'calcularDescuento', 2);
    });

    test('calcularDescuento no excede 10 lineas', () => {
      Q.expectMaxLines(FILE, 'calcularDescuento', 10);
    });

    test('calcularDescuento tiene complejidad <= 3', () => {
      Q.expectMaxComplexity(FILE, 'calcularDescuento', 3);
    });
  });
});
