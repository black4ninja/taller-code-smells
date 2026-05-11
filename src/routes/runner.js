const express = require('express');
const router = express.Router();
const runner = require('../controllers/runnerController');

router.post('/run/:id', runner.runOne);
router.post('/run', runner.runAll);
router.get('/status/:jobId', runner.status);

module.exports = router;
