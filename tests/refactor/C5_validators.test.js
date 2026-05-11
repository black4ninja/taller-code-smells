const { Q, challengePath, loadChallenge } = require('./helpers');

const FILE = challengePath('c5_validators.js');

describe('C5 - Validador de payload (Code smell: Codigo duplicado, violacion DRY)', () => {
  let validar;
  beforeAll(() => {
    validar = loadChallenge('c5_validators.js').validar;
  });

  const schema = {
    nombre: { tipo: 'string', requerido: true, min: 2, max: 50 },
    edad: { tipo: 'number', requerido: true, min: 0, max: 120 },
    email: { tipo: 'string', requerido: true, min: 5 },
    telefono: { tipo: 'string', requerido: false },
  };

  describe('Correctitud', () => {
    test('payload completo y valido', () => {
      const r = validar(
        { nombre: 'Alfonso', edad: 30, email: 'a@b.com', telefono: '555' },
        schema
      );
      expect(r.valido).toBe(true);
      expect(r.errores).toEqual([]);
    });

    test('campo requerido faltante produce error', () => {
      const r = validar({ edad: 30, email: 'a@b.com' }, schema);
      expect(r.valido).toBe(false);
      expect(r.errores.some((e) => e.toLowerCase().includes('nombre'))).toBe(true);
    });

    test('tipo incorrecto produce error', () => {
      const r = validar({ nombre: 'A', edad: 'treinta', email: 'a@b.com' }, schema);
      expect(r.valido).toBe(false);
      expect(r.errores.some((e) => e.toLowerCase().includes('edad'))).toBe(true);
    });

    test('valor menor al minimo produce error', () => {
      const r = validar({ nombre: 'A', edad: 30, email: 'a@b' }, schema);
      expect(r.valido).toBe(false);
      expect(r.errores.some((e) => e.toLowerCase().includes('email'))).toBe(true);
    });

    test('valor mayor al maximo produce error', () => {
      const r = validar({ nombre: 'A'.repeat(60), edad: 30, email: 'a@b.com' }, schema);
      expect(r.valido).toBe(false);
      expect(r.errores.some((e) => e.toLowerCase().includes('nombre'))).toBe(true);
    });

    test('campo opcional puede faltar sin error', () => {
      const r = validar({ nombre: 'Alfonso', edad: 30, email: 'a@b.com' }, schema);
      expect(r.valido).toBe(true);
    });
  });

  describe('Quality gates', () => {
    test('archivo define maximo 3 funciones (sin copy-paste por tipo)', () => {
      Q.expectFunctionCount(FILE, { max: 3 });
    });

    test('NO hay switch en el archivo', () => {
      Q.expectNoSwitch(FILE);
    });

    test('validar tiene complejidad ciclomatica <= 6', () => {
      Q.expectMaxComplexity(FILE, 'validar', 6);
    });

    test('sin duplicacion significativa', () => {
      Q.expectNoDuplication(FILE, { minLines: 5, minTokens: 30 });
    });
  });
});
