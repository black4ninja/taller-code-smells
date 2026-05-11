const fs = require('fs');
const parser = require('@babel/parser');

function readAndParse(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  const ast = parser.parse(source, {
    sourceType: 'unambiguous',
    plugins: [],
    errorRecovery: true,
  });
  return { source, ast };
}

module.exports = { readAndParse };
