const express = require('express');
const router = express.Router();
const submit = require('../controllers/submitController');

router.get('/submit', submit.form);
router.post('/submit', submit.save);
router.post('/finalize', submit.finalize);

module.exports = router;
