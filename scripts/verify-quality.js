#!/usr/bin/env node
// CLI: corre el analisis de calidad sobre todos los retos sin Jest.
// Util para que el alumno vea sus metricas en cualquier momento.

const path = require('path');
const fs = require('fs');
const { analyze } = require('../src/lib/quality/metrics');

const ROOT = path.join(__dirname, '..');
const CHALLENGES = [
  'c0_warmup_total.js',
  'c1_discount.js',
  'c2_user_role_access.js',
  'c3_format_address.js',
  'c4_invoice_summary.js',
  'c5_validators.js',
  'c6_report_builder.js',
];

function pad(s, n) {
  s = String(s);
  return s.length >= n ? s : s + ' '.repeat(n - s.length);
}

function main() {
  console.log('=== Reporte de calidad por reto ===\n');
  for (const file of CHALLENGES) {
    const abs = path.join(ROOT, 'src', 'challenges', file);
    if (!fs.existsSync(abs)) {
      console.log(`[skip] ${file} no existe`);
      continue;
    }
    const r = analyze(abs);
    console.log(`-- ${file}`);
    console.log(`   archivo: ${r.nonEmptyLoc} lineas no vacias, ${r.functionCount} funciones, switch=${r.hasSwitch}`);
    for (const fn of r.functions) {
      console.log(
        '   ' +
          pad(fn.name, 22) +
          'loc=' + pad(fn.loc, 3) +
          'cx=' + pad(fn.complexity, 2) +
          'depth=' + pad(fn.maxDepth, 2) +
          'params=' + pad(fn.params, 2) +
          'if=' + pad(fn.ifCount, 2) +
          (fn.hasSwitch ? '[SWITCH] ' : '') +
          (fn.stringConcatAssign ? '[+=str] ' : '')
      );
    }
    console.log();
  }
}

main();
