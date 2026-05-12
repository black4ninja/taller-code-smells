const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..', '..');

// LOCKED_HASHES_BEGIN
const EXPECTED = {
  "tests/refactor/C0_warmup.test.js": "905f5e732214a98029af9e10d9c397c8e0d05f949067055cd0078b5031d127f2",
  "tests/refactor/C1_discount.test.js": "211ad3b3f60abb3128742e671c89cbec03add05207346533393ee1a89b2e2058",
  "tests/refactor/C2_user_role_access.test.js": "3ecbed94bd23e1287ea24cb7be46168e10a20ad0ba1f4eb0140bf4ea826c7697",
  "tests/refactor/C3_format_address.test.js": "207e6617e87e9a2b9d85cd1e53c4837d7f118a11a5d99945d4f547cde2c62c50",
  "tests/refactor/C4_invoice_summary.test.js": "6a074ad57d0a5d63abbb080ffb00aadecc8ca0ff28cd0132b1ef61eaed9ecf9c",
  "tests/refactor/C5_validators.test.js": "ff104ff93274f59b64ebf7626323293d39320e3c0c8ce8a9f2546912013209dc",
  "tests/refactor/C6_report_builder.test.js": "c224d0dcee84bf9bf625b9dd6985966904b57ed76ef57f765c0dd03db5b05572",
  "tests/refactor/helpers.js": "1f3d57eb9f2b112494e674804cae832e39cda927b712049c1c57a3b11ac4fa6b",
  "src/lib/quality/analyzeFile.js": "7b211cc4d18b5bf2e817f875271436177fd2fb7ec71a59b56f90b8cc3b15346c",
  "src/lib/quality/metrics.js": "997048fdb2288aa54091b15b45ae1f3221c64279d60148a46a4fb067936d7f5b",
  "src/lib/quality/assertions.js": "66092b851549cfb577b52d55c4b84c951b71934e16063ccf7d0d591111b06f65",
  "src/lib/quality/duplicateScan.js": "98acdbb3f2c68397010085b948fe1ceb7b2f86aa721a24e6da730cb2690ab160"
};
// LOCKED_HASHES_END

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

const CRITICAL_FILES = [
  'src/challenges/c0_warmup_total.js',
  'src/challenges/c1_discount.js',
  'src/challenges/c2_user_role_access.js',
  'src/challenges/c3_format_address.js',
  'src/challenges/c4_invoice_summary.js',
  'src/challenges/c5_validators.js',
  'src/challenges/c6_report_builder.js',
  'app.js',
  'package.json',
];

function sha256(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buf).digest('hex');
}

describe('Integridad del taller (anti-trampa)', () => {
  test('todos los archivos criticos existen', () => {
    for (const rel of CRITICAL_FILES) {
      const abs = path.join(ROOT, rel);
      expect(fs.existsSync(abs)).toBe(true);
    }
  });

  test('archivos protegidos no han sido modificados (hashes coinciden)', () => {
    if (Object.keys(EXPECTED).length === 0) {
      // Aun no se ha corrido `npm run lock-tests`. En main esto deberia
      // estar lleno antes de entregar a alumnos.
      return;
    }
    for (const rel of PROTECTED_FILES) {
      const abs = path.join(ROOT, rel);
      expect(fs.existsSync(abs)).toBe(true);
      const actual = sha256(abs);
      if (EXPECTED[rel] !== actual) {
        throw new Error(
          `Integridad rota: ${rel} fue modificado. ` +
            `Hash esperado: ${EXPECTED[rel].slice(0, 12)}..., actual: ${actual.slice(0, 12)}... ` +
            `Restaura el archivo a su version original o tu submission no contara.`
        );
      }
    }
  });

  test('ningun test contiene .skip o .only', () => {
    const TESTS_DIR = path.join(ROOT, 'tests', 'refactor');
    const files = fs.readdirSync(TESTS_DIR).filter((f) => f.endsWith('.test.js'));
    const skipMarker = '.' + 'skip(';
    const onlyMarker = '.' + 'only(';
    for (const f of files) {
      if (f === path.basename(__filename)) continue;
      const content = fs.readFileSync(path.join(TESTS_DIR, f), 'utf8');
      if (content.includes(skipMarker) || content.includes(onlyMarker)) {
        throw new Error(`El archivo ${f} contiene .skip o .only. Eliminalos antes de submit.`);
      }
    }
  });
});
