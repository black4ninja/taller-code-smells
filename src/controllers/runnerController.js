const registry = require('../services/challengeRegistry');
const runner = require('../services/testRunner');

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
  res.json({
    jobId: job.id,
    status: job.status,
    durationMs: job.finishedAt ? job.finishedAt - job.startedAt : null,
    result: job.result,
  });
}

module.exports = { runOne, runAll, status };
