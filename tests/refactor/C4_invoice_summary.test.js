const { Q, challengePath, loadChallenge } = require('./helpers');

const FILE = challengePath('c4_invoice_summary.js');

describe('C4 - Resumen de factura (Code smell: Metodo largo + God function)', () => {
  let resumenFactura;
  beforeAll(() => {
    resumenFactura = loadChallenge('c4_invoice_summary.js').resumenFactura;
  });

  const facturaBase = () => ({
    cliente: { tipo: 'regular', nombre: 'Test' },
    items: [
      { precio: 100, cantidad: 2 },
      { precio: 50, cantidad: 1 },
    ],
    direccion: { calle: 'Av. X', numero: '1', ciudad: 'CDMX' },
  });

  describe('Correctitud', () => {
    test('factura tipica calcula subtotal correctamente', () => {
      const r = resumenFactura(facturaBase());
      expect(r.subtotal).toBeCloseTo(250, 2);
    });

    test('cliente regular tiene descuento 0', () => {
      const r = resumenFactura(facturaBase());
      expect(r.descuento).toBeCloseTo(0, 2);
    });

    test('cliente oro recibe 10% de descuento sobre subtotal', () => {
      const f = facturaBase();
      f.cliente.tipo = 'oro';
      const r = resumenFactura(f);
      expect(r.descuento).toBeCloseTo(25, 2);
    });

    test('total incluye IVA 16% sobre (subtotal - descuento)', () => {
      const r = resumenFactura(facturaBase());
      expect(r.iva).toBeCloseTo(40, 2);
      expect(r.total).toBeCloseTo(290, 2);
    });

    test('lineaDireccion incluye los campos formateados', () => {
      const r = resumenFactura(facturaBase());
      expect(r.lineaDireccion).toContain('Av. X');
      expect(r.lineaDireccion).toContain('CDMX');
    });

    test('factura vacia retorna ceros', () => {
      const f = { cliente: { tipo: 'regular' }, items: [], direccion: {} };
      const r = resumenFactura(f);
      expect(r.subtotal).toBe(0);
      expect(r.total).toBe(0);
    });
  });

  describe('Quality gates', () => {
    test('resumenFactura no excede 10 lineas (Compose Method)', () => {
      Q.expectMaxLines(FILE, 'resumenFactura', 10);
    });

    test('archivo no excede 60 lineas no vacias', () => {
      Q.expectFileMaxLines(FILE, 60);
    });

    test('archivo define al menos 3 funciones (SRP)', () => {
      Q.expectFunctionCount(FILE, { min: 3 });
    });

    test('sin duplicacion significativa entre funciones', () => {
      Q.expectNoDuplication(FILE, { minLines: 5, minTokens: 30 });
    });
  });
});
