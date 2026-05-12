const { spawn } = require('child_process');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..', '..');
const JOBS = new Map();

function newJobId() {
  return crypto.randomBytes(6).toString('hex');
}

function runJest(testPattern) {
  const jobId = newJobId();
  const job = {
    id: jobId,
    status: 'running',
    startedAt: Date.now(),
    pattern: testPattern,
    output: '',
    result: null,
  };
  JOBS.set(jobId, job);

  const child = spawn(
    'npx',
    ['jest', '--testPathPattern', testPattern, '--json', '--runInBand', '--forceExit'],
    { cwd: ROOT, env: process.env }
  );

  let stdout = '';
  let stderr = '';
  child.stdout.on('data', (d) => { stdout += d.toString(); });
  child.stderr.on('data', (d) => { stderr += d.toString(); });

  child.on('close', (code) => {
    job.status = 'done';
    job.finishedAt = Date.now();
    job.exitCode = code;
    job.output = stderr;
    try {
      // jest --json: la salida JSON esta en stdout; encuentra el primer {
      const idx = stdout.indexOf('{');
      const parsed = idx >= 0 ? JSON.parse(stdout.slice(idx)) : null;
      job.result = summarize(parsed);
    } catch (e) {
      job.result = { error: 'No se pudo parsear output de jest', raw: stdout.slice(0, 500) };
    }
  });

  child.on('error', (err) => {
    job.status = 'done';
    job.exitCode = -1;
    job.result = { error: err.message };
  });

  return job;
}

function summarize(jestJson) {
  if (!jestJson) return { error: 'sin output de jest' };
  const total = jestJson.numTotalTests || 0;
  const passed = jestJson.numPassedTests || 0;
  const failed = jestJson.numFailedTests || 0;
  const fails = [];
  const byFile = [];
  for (const tr of jestJson.testResults || []) {
    const file = (tr.testFilePath || tr.name || '').split('/').pop();
    const idMatch = file.match(/^(C\d+|C_[A-Za-z]+)/);
    const id = idMatch ? idMatch[1] : file;
    const inner = tr.testResults || tr.assertionResults || [];
    let filePassed = 0;
    let fileFailed = 0;
    for (const t of inner) {
      if (t.status === 'failed') {
        fileFailed += 1;
        fails.push({
          archivo: id,
          titulo: t.fullName || t.title,
          mensaje: (t.failureMessages || []).join('\n').split('\n').slice(0, 6).join('\n'),
        });
      } else if (t.status === 'passed') {
        filePassed += 1;
      }
    }
    // Algunas versiones de jest reportan totales agregados por archivo
    if (filePassed === 0 && fileFailed === 0) {
      filePassed = tr.numPassingTests || 0;
      fileFailed = tr.numFailingTests || 0;
    }
    const verde = fileFailed === 0 && (filePassed > 0 || (tr.status === 'passed'));
    byFile.push({ id, passed: filePassed, failed: fileFailed, verde });
  }
  return {
    total,
    passed,
    failed,
    success: jestJson.success,
    fails,
    byFile,
  };
}

function getJob(jobId) {
  return JOBS.get(jobId) || null;
}

module.exports = { runJest, getJob };
