const registry = require('../services/challengeRegistry');

function home(req, res) {
  const challenges = registry.getAll();
  res.render('home', { challenges });
}

function challenge(req, res) {
  const c = registry.getById(req.params.id);
  if (!c) {
    return res.status(404).render('error', { message: 'Reto no encontrado: ' + req.params.id });
  }
  res.render('challenge', { challenge: c });
}

module.exports = { home, challenge };
