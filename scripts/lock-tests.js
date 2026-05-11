#!/usr/bin/env node
// Genera hashes SHA-256 de los archivos protegidos y los inyecta
// en tests/refactor/C_integrity.test.js entre los marcadores
// LOCKED_HASHES_BEGIN / LOCKED_HASHES_END.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const INTEGRITY_FILE = path.join(ROOT, 'tests', 'refactor', 'C_integrity.test.js');

const PROTECTED_FILES = [
  'tests/refactor/C0_warmup.test.js',
  'tests/refactor/C1_discount.test.js',
  'tests/refactor/C2_user_role_access.test.js',
  'tests/refactor/C3_format_address.test.js',
  'tests/refactor/C4_invoice_summary.test.js',
  'tests/refactor/C5_validators.test.js',
  'tests/refactor/C6_report_builder.test.js',
  'tests/refactor/helpers.js',
  'src/lib/quality/analyzeFile.js',
  'src/lib/quality/metrics.js',
  'src/lib/quality/assertions.js',
  'src/lib/quality/duplicateScan.js',
];

function sha256(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function main() {
  const hashes = {};
  for (const rel of PROTECTED_FILES) {
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) {
      console.error(`[lock-tests] Archivo no encontrado: ${rel}`);
      process.exit(1);
    }
    hashes[rel] = sha256(abs);
  }

  const integrityContent = fs.readFileSync(INTEGRITY_FILE, 'utf8');
  const BEGIN = '// LOCKED_HASHES_BEGIN';
  const END = '// LOCKED_HASHES_END';
  const beginIdx = integrityContent.indexOf(BEGIN);
  const endIdx = integrityContent.indexOf(END);

  if (beginIdx === -1 || endIdx === -1) {
    console.error('[lock-tests] No se encontraron los marcadores en C_integrity.test.js');
    process.exit(1);
  }

  const before = integrityContent.slice(0, beginIdx + BEGIN.length);
  const after = integrityContent.slice(endIdx);

  const block = '\nconst EXPECTED = ' + JSON.stringify(hashes, null, 2) + ';\n';
  const updated = before + block + after;

  fs.writeFileSync(INTEGRITY_FILE, updated, 'utf8');

  console.log('[lock-tests] OK. Hashes generados:');
  for (const rel of PROTECTED_FILES) {
    console.log(`  ${hashes[rel].slice(0, 12)}...  ${rel}`);
  }
}

main();
