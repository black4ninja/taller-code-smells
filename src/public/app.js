// Boton individual por reto
document.addEventListener('click', async (e) => {
  const btn = e.target.closest('.btn-run');
  if (!btn) return;
  const id = btn.dataset.id;
  const out = document.getElementById('out-' + id);
  if (out) {
    out.classList.add('visible');
    out.textContent = 'Corriendo jest...';
  }
  btn.disabled = true;
  try {
    const startRes = await fetch('/run/' + id, { method: 'POST' });
    const { jobId } = await startRes.json();
    await pollJob(jobId, (data) => renderSingleResult(data, out, id));
  } catch (err) {
    if (out) out.textContent = 'Error: ' + err.message;
  } finally {
    btn.disabled = false;
  }
});

// Boton global: correr toda la suite
const btnAll = document.getElementById('btn-run-all');
const globalOut = document.getElementById('global-output');
if (btnAll) {
  btnAll.addEventListener('click', async () => {
    if (globalOut) {
      globalOut.classList.add('visible');
      globalOut.textContent = 'Corriendo toda la suite...';
    }
    btnAll.disabled = true;
    btnAll.textContent = 'Corriendo...';
    try {
      const startRes = await fetch('/run', { method: 'POST' });
      const { jobId } = await startRes.json();
      await pollJob(jobId, (data) => renderGlobalResult(data));
    } catch (err) {
      if (globalOut) globalOut.textContent = 'Error: ' + err.message;
    } finally {
      btnAll.disabled = false;
      btnAll.textContent = 'Correr toda la suite';
    }
  });
}

async function pollJob(jobId, onDone) {
  for (let i = 0; i < 80; i++) {
    await new Promise((r) => setTimeout(r, 700));
    const res = await fetch('/status/' + jobId);
    const data = await res.json();
    if (data.status === 'done') {
      onDone(data);
      return;
    }
    if (globalOut && document.activeElement !== document.body) {
      // no-op: solo para forzar lint en algunos navegadores
    }
  }
  onDone({ status: 'timeout', result: { error: 'Timeout esperando jest.' } });
}

function renderSingleResult(data, outEl, challengeId) {
  if (!outEl) return;
  const r = data.result || {};
  if (r.error) {
    outEl.textContent = 'Error: ' + r.error;
    return;
  }
  let txt = 'Tests: ' + r.passed + '/' + r.total + ' passed';
  if (r.failed) txt += ' (' + r.failed + ' failed)';
  txt += '\n';
  if (r.fails && r.fails.length) {
    for (const f of r.fails) {
      txt += '\nFAIL: ' + f.titulo + '\n';
      if (f.mensaje) txt += f.mensaje + '\n';
    }
  }
  if (r.success && r.failed === 0) {
    txt += '\nVERDE - reto completado!';
  }
  outEl.textContent = txt;
  setBadge(challengeId, r);
}

function renderGlobalResult(data) {
  if (!globalOut) return;
  const r = data.result || {};
  if (r.error) {
    globalOut.textContent = 'Error: ' + r.error;
    return;
  }
  let txt = 'Suite completa: ' + r.passed + '/' + r.total + ' tests passed';
  if (r.failed) txt += '  (' + r.failed + ' failed)';
  if (data.durationMs) txt += '  [' + (data.durationMs / 1000).toFixed(1) + 's]';
  txt += '\n';

  if (r.byFile && r.byFile.length) {
    txt += '\nPor reto:\n';
    for (const f of r.byFile) {
      const mark = f.verde ? 'VERDE' : (f.passed + '/' + (f.passed + f.failed));
      txt += '  ' + (f.id + '         ').slice(0, 14) + mark + '\n';
      // tambien actualiza el badge de cada card
      setBadgeFromFile(f);
    }
  }

  if (r.failed) {
    txt += '\nPrimeros fails:\n';
    for (const f of (r.fails || []).slice(0, 5)) {
      txt += '\n[' + (f.archivo || '?') + '] ' + f.titulo + '\n';
      if (f.mensaje) txt += f.mensaje.split('\n').slice(0, 3).join('\n') + '\n';
    }
  } else if (r.success) {
    txt += '\n*** TODO VERDE - taller completado ***';
  }

  globalOut.textContent = txt;
}

function setBadge(challengeId, r) {
  const card = document.querySelector('[data-challenge="' + challengeId + '"]');
  if (!card) return;
  const status = card.querySelector('.card-status');
  if (!status) return;
  status.classList.remove('ok', 'fail', 'pending');
  if (r.success && r.failed === 0) {
    status.classList.add('ok');
    status.textContent = 'VERDE';
  } else {
    status.classList.add('fail');
    status.textContent = r.passed + '/' + r.total;
  }
}

function setBadgeFromFile(f) {
  // f.id viene como "C0", "C1", etc.
  const card = document.querySelector('[data-challenge="' + f.id + '"]');
  if (!card) return;
  const status = card.querySelector('.card-status');
  if (!status) return;
  status.classList.remove('ok', 'fail', 'pending');
  if (f.verde) {
    status.classList.add('ok');
    status.textContent = 'VERDE';
  } else {
    status.classList.add('fail');
    status.textContent = f.passed + '/' + (f.passed + f.failed);
  }
}
