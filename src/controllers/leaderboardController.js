const store = require('../services/leaderboardStore');
const registry = require('../services/challengeRegistry');

function view(req, res) {
  const ranking = store.ranking();
  const challenges = registry.getAll();
  res.render('leaderboard', { ranking, challenges });
}

module.exports = { view };
