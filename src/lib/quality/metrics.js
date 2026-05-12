const traverseModule = require('@babel/traverse');
const traverse = traverseModule.default || traverseModule;
const { readAndParse } = require('./analyzeFile');

function countSloc(node) {
  if (!node.body || !node.body.loc) return 0;
  const body = node.body;
  if (body.type === 'BlockStatement') {
    return Math.max(0, body.loc.end.line - body.loc.start.line - 1);
  }
  return 1;
}

function isStringLike(node) {
  if (!node) return false;
  if (node.type === 'StringLiteral') return true;
  if (node.type === 'TemplateLiteral') return true;
  if (node.type === 'BinaryExpression' && node.operator === '+') {
    return isStringLike(node.left) || isStringLike(node.right);
  }
  return false;
}

function analyzeFunctionBody(path) {
  let complexity = 1;
  let maxDepth = 0;
  let switchCount = 0;
  let ifCount = 0;
  let stringConcatAssign = 0;

  function visit(node, depth, isRoot) {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) {
      for (const child of node) visit(child, depth);
      return;
    }
    if (!node.type) return;

    // No descender a sub-funciones: se analizan por separado
    if (!isRoot && (
      node.type === 'FunctionDeclaration' ||
      node.type === 'FunctionExpression' ||
      node.type === 'ArrowFunctionExpression'
    )) {
      return;
    }

    let nextDepth = depth;

    switch (node.type) {
      case 'IfStatement':
        complexity += 1;
        ifCount += 1;
        nextDepth = depth + 1;
        break;
      case 'SwitchCase':
        if (node.test) complexity += 1;
        break;
      case 'SwitchStatement':
        switchCount += 1;
        nextDepth = depth + 1;
        break;
      case 'ForStatement':
      case 'ForInStatement':
      case 'ForOfStatement':
      case 'WhileStatement':
      case 'DoWhileStatement':
        complexity += 1;
        nextDepth = depth + 1;
        break;
      case 'CatchClause':
        complexity += 1;
        nextDepth = depth + 1;
        break;
      case 'ConditionalExpression':
        complexity += 1;
        break;
      case 'LogicalExpression':
        if (node.operator === '&&' || node.operator === '||' || node.operator === '??') {
          complexity += 1;
        }
        break;
      case 'AssignmentExpression':
        if (node.operator === '+=' && isStringLike(node.right)) {
          stringConcatAssign += 1;
        }
        break;
    }

    if (nextDepth > maxDepth) maxDepth = nextDepth;

    for (const key of Object.keys(node)) {
      if (key === 'loc' || key === 'start' || key === 'end' || key === 'range') continue;
      const child = node[key];
      if (child && typeof child === 'object') visit(child, nextDepth);
    }
  }

  const fnNode = path.node;
  // El body raiz no cuenta como nivel; visitamos cada statement con depth 0
  if (fnNode.body && fnNode.body.type === 'BlockStatement' && Array.isArray(fnNode.body.body)) {
    for (const stmt of fnNode.body.body) visit(stmt, 0);
  } else if (fnNode.body) {
    visit(fnNode.body, 0);
  }

  return { complexity, maxDepth, switchCount, ifCount, stringConcatAssign };
}

function isObjectLiteralValue(path) {
  const parent = path.parent;
  if (!parent) return false;
  if (parent.type !== 'Property' && parent.type !== 'ObjectProperty') return false;
  if (parent.shorthand || parent.method) return false;
  return parent.value === path.node;
}

function functionName(path) {
  const node = path.node;
  if (node.id && node.id.name) return node.id.name;
  if (path.parent && path.parent.type === 'VariableDeclarator' && path.parent.id) {
    return path.parent.id.name;
  }
  if (path.parent && path.parent.type === 'AssignmentExpression' && path.parent.left.type === 'Identifier') {
    return path.parent.left.name;
  }
  if (path.parent && path.parent.type === 'Property' && path.parent.key) {
    return path.parent.key.name || path.parent.key.value;
  }
  if (path.parent && path.parent.type === 'ObjectProperty' && path.parent.key) {
    return path.parent.key.name || path.parent.key.value;
  }
  return '<anonymous>';
}

function analyze(filePath) {
  const { source, ast } = readAndParse(filePath);
  const lines = source.split('\n');
  const nonEmptyLines = lines.filter((l) => l.trim() !== '' && !l.trim().startsWith('//')).length;

  const functions = [];
  let hasSwitchFile = false;

  traverse(ast, {
    'FunctionDeclaration|FunctionExpression|ArrowFunctionExpression': (path) => {
      const name = functionName(path);
      const params = path.node.params.length;
      const loc = countSloc(path.node);
      const metrics = analyzeFunctionBody(path);
      if (metrics.switchCount > 0) hasSwitchFile = true;
      functions.push({
        name,
        loc,
        params,
        complexity: metrics.complexity,
        maxDepth: metrics.maxDepth,
        hasSwitch: metrics.switchCount > 0,
        switchCount: metrics.switchCount,
        ifCount: metrics.ifCount,
        stringConcatAssign: metrics.stringConcatAssign,
        isObjectValue: isObjectLiteralValue(path),
        startLine: path.node.loc ? path.node.loc.start.line : 0,
        endLine: path.node.loc ? path.node.loc.end.line : 0,
      });
    },
  });

  return {
    filePath,
    totalLoc: lines.length,
    nonEmptyLoc: nonEmptyLines,
    functionCount: functions.length,
    hasSwitch: hasSwitchFile,
    functions,
  };
}

function getFunction(report, name) {
  return report.functions.find((f) => f.name === name);
}

module.exports = { analyze, getFunction };
