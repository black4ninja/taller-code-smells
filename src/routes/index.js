const express = require('express');
const router = express.Router();
const dashboard = require('../controllers/dashboardController');

router.get('/', dashboard.home);
router.get('/challenge/:id', dashboard.challenge);

module.exports = router;
