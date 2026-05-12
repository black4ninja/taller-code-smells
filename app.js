const express = require('express');
const path = require('path');

function createApp() {
  const app = express();

  app.set('views', path.join(__dirname, 'src', 'views'));
  app.set('view engine', 'ejs');

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use('/static', express.static(path.join(__dirname, 'src', 'public')));

  app.use(require('./src/routes/index'));
  app.use(require('./src/routes/runner'));

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
