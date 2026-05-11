const express = require('express');
const session = require('express-session');
const path = require('path');

function createApp() {
  const app = express();

  app.set('views', path.join(__dirname, 'src', 'views'));
  app.set('view engine', 'ejs');

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use('/static', express.static(path.join(__dirname, 'src', 'public')));

  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'refactor-race-secret',
      resave: false,
      saveUninitialized: false,
      cookie: { httpOnly: true, sameSite: 'lax' },
    })
  );

  app.use(require('./src/routes/index'));
  app.use(require('./src/routes/runner'));
  app.use(require('./src/routes/submit'));
  app.use(require('./src/routes/leaderboard'));

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).render('error', { message: 'Error interno: ' + err.message });
  });

  return app;
}

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  createApp().listen(PORT, () => {
    console.log(`[refactor-race] dashboard en http://localhost:${PORT}`);
  });
}

module.exports = { createApp };
