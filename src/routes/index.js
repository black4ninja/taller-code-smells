const express = require('express');
const path = require('path');
const router = express.Router();
const dashboard = require('../controllers/dashboardController');

router.get('/', dashboard.home);
router.get('/challenge/:id', dashboard.challenge);

// Presentación de introducción (HTML standalone en docs/)
router.get('/presentacion', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'docs', 'PRESENTACION.html'));
});

module.exports = router;
