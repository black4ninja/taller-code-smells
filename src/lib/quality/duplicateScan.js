const path = require('path');
const fs = require('fs');

async function scanDuplication(filePath, options = {}) {
  const minTokens = options.minTokens || 30;
  const { detectClones } = require('jscpd');
  const absPath = path.resolve(filePath);

  const result = await detectClones({
    path: [absPath],
    minTokens,
    silent: true,
    reporters: [],
    formatsExts: { javascript: ['js'] },
    ignore: [],
  });

  const clones = (result || []).filter((c) => {
    const a = c.duplicationA && c.duplicationA.sourceId;
    const b = c.duplicationB && c.duplicationB.sourceId;
    return a === absPath || b === absPath;
  });

  return {
    cloneCount: clones.length,
    clones: clones.map((c) => ({
      tokens: c.duplicationA ? c.duplicationA.tokens : 0,
      a: c.duplicationA ? `${c.duplicationA.start.line}-${c.duplicationA.end.line}` : '',
      b: c.duplicationB ? `${c.duplicationB.start.line}-${c.duplicationB.end.line}` : '',
    })),
  };
}

function scanDuplicationSync(filePath, options = {}) {
  const minTokens = options.minTokens || 30;
  const source = fs.readFileSync(filePath, 'utf8');
  const lines = source
    .split('\n')
    .map((l) => l.replace(/\/\/.*$/, '').trim())
    .filter((l) => l && !l.startsWith('/*') && !l.startsWith('*'));

  const window = options.minLines || 5;
  const clones = [];
  for (let i = 0; i + window <= lines.length; i++) {
    const blockA = lines.slice(i, i + window).join('\n');
    if (blockA.length < minTokens) continue;
    for (let j = i + window; j + window <= lines.length; j++) {
      const blockB = lines.slice(j, j + window).join('\n');
      if (blockA === blockB) {
        clones.push({ tokens: blockA.length, a: `${i + 1}-${i + window}`, b: `${j + 1}-${j + window}` });
      }
    }
  }
  return { cloneCount: clones.length, clones };
}

module.exports = { scanDuplication, scanDuplicationSync };
