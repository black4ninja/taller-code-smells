const { Q, challengePath, loadChallenge } = require('./helpers');

const FILE = challengePath('c2_user_role_access.js');

describe('C2 - Acceso de usuario a recurso (Code smell: Lista larga de parametros + Anidamiento)', () => {
  let puedeAcceder;
  beforeAll(() => {
    puedeAcceder = loadChallenge('c2_user_role_access.js').puedeAcceder;
  });

  describe('Correctitud', () => {
    test('admin no-banned accede a cualquier recurso', () => {
      const user = { id: 1, role: 'admin', banned: false };
      const recurso = { id: 99, ownerId: 50, esPublico: false };
      expect(puedeAcceder(user, recurso)).toBe(true);
    });

    test('user dueno accede a su propio recurso', () => {
      const user = { id: 7, role: 'user', banned: false };
      const recurso = { id: 1, ownerId: 7, esPublico: false };
      expect(puedeAcceder(user, recurso)).toBe(true);
    });

    test('user no-dueno NO accede a recurso privado', () => {
      const user = { id: 7, role: 'user', banned: false };
      const recurso = { id: 1, ownerId: 99, esPublico: false };
      expect(puedeAcceder(user, recurso)).toBe(false);
    });

    test('usuario banneado nunca accede, ni siendo admin', () => {
      const user = { id: 1, role: 'admin', banned: true };
      const recurso = { id: 1, ownerId: 1, esPublico: true };
      expect(puedeAcceder(user, recurso)).toBe(false);
    });

    test('recurso publico accesible a no-banneados', () => {
      const user = { id: 7, role: 'user', banned: false };
      const recurso = { id: 1, ownerId: 99, esPublico: true };
      expect(puedeAcceder(user, recurso)).toBe(true);
    });

    test('user banneado no accede a recurso publico', () => {
      const user = { id: 7, role: 'user', banned: true };
      const recurso = { id: 1, ownerId: 99, esPublico: true };
      expect(puedeAcceder(user, recurso)).toBe(false);
    });
  });

  describe('Quality gates', () => {
    test('puedeAcceder recibe exactamente 2 parametros (Parameter Object)', () => {
      Q.expectParamCount(FILE, 'puedeAcceder', 2);
    });

    test('puedeAcceder no anida mas de 1 nivel (Guard Clauses)', () => {
      Q.expectMaxDepth(FILE, 'puedeAcceder', 1);
    });

    test('puedeAcceder no excede 12 lineas', () => {
      Q.expectMaxLines(FILE, 'puedeAcceder', 12);
    });

    test('puedeAcceder tiene complejidad <= 5', () => {
      Q.expectMaxComplexity(FILE, 'puedeAcceder', 5);
    });
  });
});
