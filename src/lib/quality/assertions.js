const { analyze, getFunction } = require('./metrics');
const { scanDuplicationSync } = require('./duplicateScan');

const SMELL_REFS = {
  longMethod: {
    smell: 'Metodo largo',
    technique: 'Extract Method',
    ref: 'docs/REFACTOR_CHEATSHEET.md#extract-method',
  },
  switchExcess: {
    smell: 'Switch statement excesivo',
    technique: 'Replace Conditional with Polymorphism (usa un map de estrategias)',
    ref: 'docs/REFACTOR_CHEATSHEET.md#replace-conditional-with-polymorphism',
  },
  longParams: {
    smell: 'Lista larga de parametros',
    technique: 'Introduce Parameter Object',
    ref: 'docs/REFACTOR_CHEATSHEET.md#introduce-parameter-object',
  },
  highComplexity: {
    smell: 'Codigo complejo / Rigidez',
    technique: 'Extract Method + Guard Clauses (early return)',
    ref: 'docs/REFACTOR_CHEATSHEET.md#extract-method',
  },
  deepNesting: {
    smell: 'Anidamiento profundo (Rigidez)',
    technique: 'Guard Clauses / Early Return + Extract Method',
    ref: 'docs/REFACTOR_CHEATSHEET.md#guard-clauses',
  },
  duplication: {
    smell: 'Codigo duplicado',
    technique: 'Extract Method + DRY (tabla de reglas o helper compartido)',
    ref: 'docs/REFACTOR_CHEATSHEET.md#extract-method',
  },
  primitiveObsession: {
    smell: 'Obsesion primitiva',
    technique: 'Introduce Parameter Object o Extract Class',
    ref: 'docs/REFACTOR_CHEATSHEET.md#introduce-parameter-object',
  },
  stringConcat: {
    smell: 'Obsesion primitiva / Codigo procedural (concat manual de strings)',
    technique: 'Array.filter(Boolean).join() o template literals',
    ref: 'docs/REFACTOR_CHEATSHEET.md#introduce-parameter-object',
  },
  godFunction: {
    smell: 'Clase/funcion grande (God function)',
    technique: 'Extract Method (Compose Method) + SRP',
    ref: 'docs/REFACTOR_CHEATSHEET.md#extract-method',
  },
};

function fail(category, detail) {
  const info = SMELL_REFS[category] || {};
  const message = [
    detail,
    info.smell ? `Smell: ${info.smell}.` : '',
    info.technique ? `Tecnica sugerida: ${info.technique}.` : '',
    info.ref ? `Referencia: ${info.ref}` : '',
  ]
    .filter(Boolean)
    .join(' ');
  throw new Error(message);
}

function requireFunction(filePath, name) {
  const report = analyze(filePath);
  const fn = getFunction(report, name);
  if (!fn) {
    throw new Error(
      `No se encontro la funcion "${name}" en ${filePath}. ` +
        `Asegurate de exportarla con el nombre exacto.`
    );
  }
  return { report, fn };
}

function expectMaxLines(filePath, fnName, max) {
  const { fn } = requireFunction(filePath, fnName);
  if (fn.loc > max) {
    fail('longMethod', `La funcion "${fnName}" tiene ${fn.loc} lineas (limite: ${max}).`);
  }
}

function expectFileMaxLines(filePath, max) {
  const report = analyze(filePath);
  if (report.nonEmptyLoc > max) {
    fail(
      'godFunction',
      `El archivo tiene ${report.nonEmptyLoc} lineas no vacias (limite: ${max}).`
    );
  }
}

function expectMaxComplexity(filePath, fnName, max) {
  const { fn } = requireFunction(filePath, fnName);
  if (fn.complexity > max) {
    fail(
      'highComplexity',
      `La funcion "${fnName}" tiene complejidad ciclomatica ${fn.complexity} (limite: ${max}).`
    );
  }
}

function expectMaxDepth(filePath, fnName, max) {
  const { fn } = requireFunction(filePath, fnName);
  if (fn.maxDepth > max) {
    fail(
      'deepNesting',
      `La funcion "${fnName}" tiene profundidad de anidamiento ${fn.maxDepth} (limite: ${max}).`
    );
  }
}

function expectMaxParams(filePath, fnName, max) {
  const { fn } = requireFunction(filePath, fnName);
  if (fn.params > max) {
    fail(
      'longParams',
      `La funcion "${fnName}" recibe ${fn.params} parametros (limite: ${max}).`
    );
  }
}

function expectParamCount(filePath, fnName, exact) {
  const { fn } = requireFunction(filePath, fnName);
  if (fn.params !== exact) {
    fail(
      'longParams',
      `La funcion "${fnName}" recibe ${fn.params} parametros (se esperaba exactamente ${exact}).`
    );
  }
}

function expectNoSwitch(filePath) {
  const report = analyze(filePath);
  if (report.hasSwitch) {
    const withSwitch = report.functions.filter((f) => f.hasSwitch).map((f) => f.name).join(', ');
    fail(
      'switchExcess',
      `El archivo contiene "switch" en: ${withSwitch}.`
    );
  }
}

function expectMaxIfCount(filePath, fnName, max) {
  const { fn } = requireFunction(filePath, fnName);
  if (fn.ifCount > max) {
    fail(
      'highComplexity',
      `La funcion "${fnName}" usa ${fn.ifCount} "if" (limite: ${max}).`
    );
  }
}

function expectFunctionCount(filePath, opts = {}) {
  const report = analyze(filePath);
  const { min, max } = opts;
  // Por default, las arrow functions usadas como valor en un object literal
  // (ej. `{ string: (v) => v.length }`) NO cuentan: son estrategias dentro de
  // una tabla de reglas, no unidades de logica reutilizables. Pasar
  // includeObjectValues: true para contar tambien esas.
  const includeObjectValues = opts.includeObjectValues === true;
  const counted = includeObjectValues
    ? report.functions
    : report.functions.filter((f) => !f.isObjectValue);
  const count = counted.length;
  if (typeof min === 'number' && count < min) {
    fail(
      'godFunction',
      `El archivo define ${count} funciones (minimo esperado: ${min}). ` +
        `Divide la responsabilidad en mas funciones.`
    );
  }
  if (typeof max === 'number' && count > max) {
    fail(
      'duplication',
      `El archivo define ${count} funciones (maximo esperado: ${max}). ` +
        `Probablemente hay duplicacion: factoriza en una funcion generica.`
    );
  }
}

function expectAllFunctionsMaxLines(filePath, max, exclude = []) {
  const report = analyze(filePath);
  for (const fn of report.functions) {
    if (exclude.includes(fn.name)) continue;
    if (fn.loc > max) {
      fail(
        'longMethod',
        `La funcion "${fn.name}" tiene ${fn.loc} lineas (limite por funcion: ${max}).`
      );
    }
  }
}

function expectNoStringConcatAssign(filePath) {
  const report = analyze(filePath);
  for (const fn of report.functions) {
    if (fn.stringConcatAssign > 0) {
      fail(
        'stringConcat',
        `La funcion "${fn.name}" usa "+=" para concatenar strings (${fn.stringConcatAssign} veces).`
      );
    }
  }
}

function expectNoDuplication(filePath, opts = {}) {
  const result = scanDuplicationSync(filePath, opts);
  if (result.cloneCount > 0) {
    const sample = result.clones[0];
    fail(
      'duplication',
      `Detectada duplicacion en ${filePath}: bloques similares en lineas ${sample.a} y ${sample.b}.`
    );
  }
}

module.exports = {
  expectMaxLines,
  expectFileMaxLines,
  expectMaxComplexity,
  expectMaxDepth,
  expectMaxParams,
  expectParamCount,
  expectNoSwitch,
  expectMaxIfCount,
  expectFunctionCount,
  expectAllFunctionsMaxLines,
  expectNoStringConcatAssign,
  expectNoDuplication,
};
