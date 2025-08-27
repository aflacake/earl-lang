// modules/atur.js

const { resolveToken, evalMathExpression } = require('./tampilkan');
const { validasiNumerik } = require('../utili');
const { setAtributContoh } = require('./kelas');

function parseArrayString(arrStr, context, modules) {
  arrStr = arrStr.trim();
  if (!arrStr.startsWith('[') || !arrStr.endsWith(']')) {
    console.error("Format array salah, harus diawali dengan '[' dan diakhiri dengan ']'");
    return null;
  }
  const isi = arrStr.slice(1, -1).trim();
  if (!isi) return [];

  const tokens = [];
  let current = '';
  let inString = false;

  for (let i = 0; i < isi.length; i++) {
    const ch = isi[i];
    if (ch === '"') {
      inString = !inString;
      current += ch;
    } else if (ch === ' ' && !inString) {
      if (current) {
        tokens.push(current);
        current = '';
      }
    } else {
      current += ch;
    }
  }
  if (current) tokens.push(current);

  return tokens.map(token => {
    if (token.startsWith('"') && token.endsWith('"')) return token.slice(1, -1);
    if (!isNaN(token)) return Number(token);
    return resolveToken(token, context, modules);
  });
}

function parseJalurToken(str) {
  const match = str.match(/^:([a-zA-Z0-9_]+)\.([a-zA-Z0-9_\[\]]+):$/);
  if (!match) return null;

  const [, kelas, ekspresi] = match;

  const tokenParts = [];
  const regex = /([a-zA-Z_][a-zA-Z0-9_]*)|\[(\d+)\]/g;
  let m;

  while ((m = regex.exec(ekspresi)) !== null) {
    if (m[1]) tokenParts.push(m[1]);
    else if (m[2]) tokenParts.push(Number(m[2]));
  }

  return { kelas, jalurToken: tokenParts };
}

async function atur(tokens, modules, context) {
  if (!context.memory) context.memory = {};
  if (!context.lingkup) context.lingkup = [];
  if (!context.safetyTypes) context.safetyTypes = {};

  if (tokens.length < 3) {
    console.error("Format salah. Gunakan: atur :nama: = nilai atau atur :nama: := nilai");
    return;
  }

  let isTyped = false;
  let namaVariabel = tokens[1];

  if (namaVariabel.startsWith('::') && namaVariabel.endsWith('::')) {
    isTyped = true;
    namaVariabel = ':' + namaVariabel.slice(2, -2) + ':';
  }

  if (typeof namaVariabel !== 'string' || !namaVariabel.startsWith(':') || !namaVariabel.endsWith(':')) {
    console.error("Variabel harus dalam format :nama:");
    return;
  }

  const operator = tokens[2];
  const nama = namaVariabel.slice(1, -1);
  const ekspresi = tokens.slice(3).join(' ').trim();

  function evalNilai(ekspresi) {
    if (ekspresi.startsWith('"') && ekspresi.endsWith('"')) {
      return ekspresi.slice(1, -1);
    }
    let hasil = evalMathExpression(ekspresi);
    if (!validasiNumerik(hasil)) {
      return ekspresi;
    }
    return hasil;
  }

  const nilai = evalNilai(ekspresi);
  const tipeNilai = typeof nilai;

  if (operator === '=') {
    if (isTyped) {
      if (context.safetyTypes[nama] && context.safetyTypes[nama] !== tipeNilai) {
        console.error(`Kesalahan: Variabel '${nama}' sudah dideklarasi bertipe '${context.safetyTypes[nama]}'. Tidak bisa diubah ke '${tipeNilai}'.`);
        return;
      }
      context.safetyTypes[nama] = tipeNilai;
    } else {
      if (context.safetyTypes[nama] && context.safetyTypes[nama] !== tipeNilai) {
        console.error(`Kesalahan: Variabel '${nama}' harus bertipe '${context.safetyTypes[nama]}', bukan '${tipeNilai}'.`);
        return;
      }
    }

    if (context.lingkup.length > 0) {
      context.lingkup[context.lingkup.length - 1][nama] = nilai;
    } else {
      context.memory[nama] = nilai;
    }

    console.log(`Variabel '${nama}' diatur ke`, nilai);
    return;

  } else if (operator === ':=') {
    if (!context.safetyTypes[nama]) {
      console.error(`Kesalahan: Variabel '${nama}' belum dideklarasikan dengan tipe safety.`);
      return;
    }

    if (context.safetyTypes[nama] !== tipeNilai) {
      console.error(`Kesalahan: Penugasan ulang tipe tidak cocok untuk '${nama}'. Sebelumnya '${context.safetyTypes[nama]}', sekarang '${tipeNilai}'.`);
      return;
    }

    if (context.lingkup.length > 0) {
      context.lingkup[context.lingkup.length - 1][nama] = nilai;
    } else {
      context.memory[nama] = nilai;
    }

    console.log(`Penugasan ulang variabel '${nama}' ke nilai`, nilai);
    return;
  }

  console.error("Operator salah. Gunakan '=' untuk deklarasi atau ':=' untuk penugasan ulang dengan safety type.");
}


module.exports = { atur };
