const path = require('path');
const Q = require('../../src/lib/quality/assertions');

function challengePath(name) {
  return path.join(__dirname, '..', '..', 'src', 'challenges', name);
}

function loadChallenge(name) {
  const file = challengePath(name);
  delete require.cache[require.resolve(file)];
  return require(file);
}

module.exports = { Q, challengePath, loadChallenge };
