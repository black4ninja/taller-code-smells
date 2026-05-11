const store = require('../services/leaderboardStore');

function form(req, res) {
  const data = store.readAll();
  const current = req.session.submitterId
    ? data.submissions.find((s) => s.id === req.session.submitterId)
    : null;
  res.render('submit', { current });
}

function save(req, res) {
  const { nombre, matricula } = req.body;
  if (!nombre || nombre.trim().length < 2) {
    return res.status(400).render('error', { message: 'Nombre requerido (minimo 2 caracteres).' });
  }
  if (!req.session.submitterId) {
    req.session.submitterId = store.newId();
  }
  store.findOrCreate(req.session.submitterId, { nombre: nombre.trim(), matricula: (matricula || '').trim() });
  res.redirect('/');
}

function finalize(req, res) {
  if (!req.session.submitterId) {
    return res.status(400).render('error', { message: 'No hay sesion activa. Primero registrate en /submit.' });
  }
  store.finalize(req.session.submitterId);
  res.redirect('/leaderboard');
}

module.exports = { form, save, finalize };
