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
    await pollJob(jobId, id, out);
  } catch (err) {
    if (out) out.textContent = 'Error: ' + err.message;
  } finally {
    btn.disabled = false;
  }
});

async function pollJob(jobId, challengeId, outEl) {
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 600));
    const url = '/status/' + jobId + '?challenge=' + encodeURIComponent(challengeId);
    const res = await fetch(url);
    const data = await res.json();
    if (data.status === 'done') {
      renderResult(data, outEl, challengeId);
      return;
    }
    if (outEl) outEl.textContent = 'Corriendo... (' + (i + 1) + 's)';
  }
  if (outEl) outEl.textContent = 'Timeout esperando jest.';
}

function renderResult(data, outEl, challengeId) {
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
  const card = outEl.closest('[data-challenge]');
  if (card) {
    const status = card.querySelector('.card-status');
    if (status) {
      status.classList.remove('ok', 'fail', 'pending');
      if (r.success && r.failed === 0) {
        status.classList.add('ok');
        status.textContent = 'VERDE';
      } else {
        status.classList.add('fail');
        status.textContent = r.passed + '/' + r.total;
      }
    }
  }
}
