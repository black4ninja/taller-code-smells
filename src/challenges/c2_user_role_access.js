// =============================================================
// C2 - Verificar acceso de usuario a recurso
// =============================================================
//
// Implementa: puedeAcceder(user, recurso)
//
// - user:    { id: number, role: 'admin' | 'user', banned: boolean }
// - recurso: { id: number, ownerId: number, esPublico: boolean }
//
// Reglas (en orden de precedencia):
//   1. Si user.banned -> false (siempre, sin importar nada mas)
//   2. Si user.role === 'admin' -> true
//   3. Si recurso.esPublico -> true
//   4. Si user.id === recurso.ownerId -> true
//   5. En cualquier otro caso -> false
//
// Restricciones que validan los tests:
//   - puedeAcceder recibe EXACTAMENTE 2 parametros (Parameter Object)
//   - profundidad de anidamiento <= 1 (Guard Clauses / Early Return)
//   - <= 12 lineas
//   - complejidad ciclomatica <= 5
//
// Hint pedagogico: la primera version recibe 7 parametros sueltos y anida ifs.
// El refactor limpio agrupa en objetos user/recurso y usa early returns.
// =============================================================

function puedeAcceder(user, recurso) {
  // TODO: implementar
  return false;
}

module.exports = { puedeAcceder };
