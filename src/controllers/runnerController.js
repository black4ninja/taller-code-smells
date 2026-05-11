const registry = require('../services/challengeRegistry');
const runner = require('../services/testRunner');
const store = require('../services/leaderboardStore');

function runOne(req, res) {
  const c = registry.getById(req.params.id);
  if (!c) return res.status(404).json({ error: 'reto no encontrado' });
  const job = runner.runJest(c.testPattern);
  res.json({ jobId: job.id, status: job.status });
}

function runAll(req, res) {
  const job = runner.runJest('tests/refactor');
  res.json({ jobId: job.id, status: job.status });
}

function status(req, res) {
  const job = runner.getJob(req.params.jobId);
  if (!job) return res.status(404).json({ error: 'job no encontrado' });
  if (job.status === 'done' && job.result && req.query.challenge) {
    persistResult(req, req.query.challenge, job.result);
  }
  res.json({
    jobId: job.id,
    status: job.status,
    durationMs: job.finishedAt ? job.finishedAt - job.startedAt : null,
    result: job.result,
  });
}

function persistResult(req, challengeId, result) {
  if (!req.session.submitterId) return;
  if (!result || result.error) return;
  store.updateChallenge(req.session.submitterId, challengeId.toUpperCase(), {
    verde: result.success && result.failed === 0,
    passed: result.passed,
    failed: result.failed,
    total: result.total,
    fails: (result.fails || []).slice(0, 5).map((f) => f.titulo),
    timestamp: new Date().toISOString(),
  });
}

module.exports = { runOne, runAll, status };
