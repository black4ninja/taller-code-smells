const { Q, challengePath, loadChallenge } = require('./helpers');

const FILE = challengePath('c3_format_address.js');

describe('C3 - Formatear direccion (Code smell: Obsesion primitiva)', () => {
  let formatearDireccion;
  beforeAll(() => {
    formatearDireccion = loadChallenge('c3_format_address.js').formatearDireccion;
  });

  describe('Correctitud', () => {
    test('direccion completa formatea con todos los campos', () => {
      const dir = {
        calle: 'Av. Reforma',
        numero: '123',
        colonia: 'Centro',
        ciudad: 'CDMX',
        estado: 'CDMX',
        cp: '06000',
        pais: 'Mexico',
      };
      const result = formatearDireccion(dir);
      expect(result).toContain('Av. Reforma');
      expect(result).toContain('123');
      expect(result).toContain('Centro');
      expect(result).toContain('CDMX');
      expect(result).toContain('06000');
      expect(result).toContain('Mexico');
    });

    test('campos vacios se omiten (no aparecen ",," en el output)', () => {
      const dir = {
        calle: 'Calle 1',
        numero: '',
        colonia: '',
        ciudad: 'Monterrey',
        estado: '',
        cp: '',
        pais: '',
      };
      const result = formatearDireccion(dir);
      expect(result).not.toMatch(/,\s*,/);
      expect(result).toContain('Calle 1');
      expect(result).toContain('Monterrey');
    });

    test('solo calle y ciudad', () => {
      const dir = { calle: 'X', ciudad: 'Y' };
      const result = formatearDireccion(dir);
      expect(result).toContain('X');
      expect(result).toContain('Y');
      expect(result).not.toMatch(/undefined/);
    });

    test('objeto vacio retorna string vacio o sin comas dobles', () => {
      const result = formatearDireccion({});
      expect(result).not.toMatch(/,\s*,/);
      expect(result).not.toMatch(/undefined/);
    });
  });

  describe('Quality gates', () => {
    test('formatearDireccion recibe EXACTAMENTE 1 parametro (Parameter Object)', () => {
      Q.expectParamCount(FILE, 'formatearDireccion', 1);
    });

    test('formatearDireccion no excede 8 lineas', () => {
      Q.expectMaxLines(FILE, 'formatearDireccion', 8);
    });

    test('formatearDireccion usa como maximo 2 "if"', () => {
      Q.expectMaxIfCount(FILE, 'formatearDireccion', 2);
    });

    test('PROHIBIDO usar "+=" para concatenar strings (usa filter+join)', () => {
      Q.expectNoStringConcatAssign(FILE);
    });
  });
});
