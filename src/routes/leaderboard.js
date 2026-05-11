const express = require('express');
const router = express.Router();
const leaderboard = require('../controllers/leaderboardController');

router.get('/leaderboard', leaderboard.view);

module.exports = router;
