const registry = require('../services/challengeRegistry');
const store = require('../services/leaderboardStore');

function getSubmitter(req) {
  if (!req.session.submitterId) return null;
  const data = store.readAll();
  return data.submissions.find((s) => s.id === req.session.submitterId) || null;
}

function home(req, res) {
  const challenges = registry.getAll();
  const submitter = getSubmitter(req);
  const status = {};
  if (submitter) {
    for (const c of challenges) {
      status[c.id] = submitter.retos[c.id] || null;
    }
  }
  res.render('home', { challenges, submitter, status });
}

function challenge(req, res) {
  const c = registry.getById(req.params.id);
  if (!c) {
    return res.status(404).render('error', { message: 'Reto no encontrado: ' + req.params.id });
  }
  const submitter = getSubmitter(req);
  const lastResult = submitter ? submitter.retos[c.id] : null;
  res.render('challenge', { challenge: c, lastResult, submitter });
}

module.exports = { home, challenge };
