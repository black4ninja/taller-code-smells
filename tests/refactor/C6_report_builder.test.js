const { Q, challengePath, loadChallenge } = require('./helpers');

const FILE = challengePath('c6_report_builder.js');

describe('C6 - Generador de reportes (Code smell: God function + Switch + Long params)', () => {
  let generarReporte;
  beforeAll(() => {
    generarReporte = loadChallenge('c6_report_builder.js').generarReporte;
  });

  const datos = [
    { nombre: 'Producto A', precio: 100, cantidad: 5 },
    { nombre: 'Producto B', precio: 200, cantidad: 3 },
  ];

  describe('Correctitud', () => {
    test('formato json retorna JSON parseable', () => {
      const r = generarReporte('json', datos, {});
      expect(() => JSON.parse(r)).not.toThrow();
      expect(JSON.parse(r)).toHaveLength(2);
    });

    test('formato csv tiene encabezado y filas con comas', () => {
      const r = generarReporte('csv', datos, {});
      expect(r).toContain(',');
      expect(r.split('\n').length).toBeGreaterThanOrEqual(3);
    });

    test('formato markdown contiene separadores |', () => {
      const r = generarReporte('markdown', datos, {});
      expect(r).toContain('|');
      expect(r.toLowerCase()).toContain('nombre');
    });

    test('formato plain produce texto sin caracteres especiales de formato', () => {
      const r = generarReporte('plain', datos, {});
      expect(typeof r).toBe('string');
      expect(r).toContain('Producto A');
    });

    test('tipo desconocido lanza Error', () => {
      expect(() => generarReporte('xml', datos, {})).toThrow();
    });
  });

  describe('Quality gates', () => {
    test('generarReporte recibe maximo 3 parametros', () => {
      Q.expectMaxParams(FILE, 'generarReporte', 3);
    });

    test('NO hay switch en el archivo (Strategy pattern)', () => {
      Q.expectNoSwitch(FILE);
    });

    test('generarReporte no excede 8 lineas (delega)', () => {
      Q.expectMaxLines(FILE, 'generarReporte', 8);
    });

    test('archivo no excede 80 lineas no vacias', () => {
      Q.expectFileMaxLines(FILE, 80);
    });

    test('TODA funcion del archivo no excede 15 lineas', () => {
      Q.expectAllFunctionsMaxLines(FILE, 15);
    });

    test('sin duplicacion entre formatters', () => {
      Q.expectNoDuplication(FILE, { minLines: 5, minTokens: 30 });
    });
  });
});
