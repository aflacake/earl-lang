const fs = require('fs');
const path = require('path');

async function impor(tokens, modules, context) {
  if (tokens.length < 2) {
    throw new Error("Perintah 'impor' membutuhkan nama file dan isi.");
  }

  const fileName = tokens[1]. replace(/['"]/g, '');
  const fullPath = path.resolve(fileName);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`File '${fileName}' tidak ditemukan.`);
  }

  const kode = fs.readFileSync(fullPath, 'utf-8');
  const lines = kode.trim().split('\n');

  context.lines.splice(context.index + 1, 0, ... lines);
}

module.exports = { impor };
