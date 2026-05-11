const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const STORE_PATH = path.join(__dirname, '..', '..', 'data', 'leaderboard.json');

function readAll() {
  if (!fs.existsSync(STORE_PATH)) {
    return { submissions: [] };
  }
  try {
    const raw = fs.readFileSync(STORE_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return { submissions: [] };
  }
}

function writeAll(data) {
  const tmp = STORE_PATH + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, STORE_PATH);
}

function findOrCreate(submitterId, info) {
  const data = readAll();
  let entry = data.submissions.find((s) => s.id === submitterId);
  if (!entry) {
    entry = {
      id: submitterId,
      nombre: info.nombre || 'Anonimo',
      matricula: info.matricula || '',
      iniciadoEn: new Date().toISOString(),
      ultimaActualizacion: new Date().toISOString(),
      tiempoMinutos: null,
      retos: {},
    };
    data.submissions.push(entry);
    writeAll(data);
  } else if (info && (info.nombre || info.matricula)) {
    entry.nombre = info.nombre || entry.nombre;
    entry.matricula = info.matricula || entry.matricula;
    writeAll(data);
  }
  return entry;
}

function updateChallenge(submitterId, challengeId, result) {
  const data = readAll();
  const entry = data.submissions.find((s) => s.id === submitterId);
  if (!entry) return null;
  entry.retos[challengeId] = result;
  entry.ultimaActualizacion = new Date().toISOString();
  writeAll(data);
  return entry;
}

function finalize(submitterId) {
  const data = readAll();
  const entry = data.submissions.find((s) => s.id === submitterId);
  if (!entry) return null;
  const inicio = new Date(entry.iniciadoEn).getTime();
  entry.tiempoMinutos = (Date.now() - inicio) / 60000;
  writeAll(data);
  return entry;
}

function ranking() {
  const data = readAll();
  return data.submissions
    .map((s) => ({
      ...s,
      retosVerdes: Object.values(s.retos || {}).filter((r) => r.verde).length,
    }))
    .sort((a, b) => {
      if (b.retosVerdes !== a.retosVerdes) return b.retosVerdes - a.retosVerdes;
      const ta = a.tiempoMinutos == null ? Infinity : a.tiempoMinutos;
      const tb = b.tiempoMinutos == null ? Infinity : b.tiempoMinutos;
      return ta - tb;
    });
}

function newId() {
  return crypto.randomBytes(8).toString('hex');
}

module.exports = { findOrCreate, updateChallenge, finalize, ranking, newId, readAll };
