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

  if (tokens.length < 3) {
    console.error("Format salah. Gunakan: atur :nama: = nilai atau atur :nama: [nilai1 nilai2 ...]");
    return;
  }

  const namaVariabel = tokens[1];
  if (!namaVariabel.startsWith(':') || !namaVariabel.endsWith(':')) {
    console.error("Variabel harus dalam format :nama:");
    return;
  }

  if (tokens[2] === '=') {
    const jalurInfo = parseJalurToken(namaVariabel); 
    if (jalurInfo) {
      const ekspresi = tokens.slice(3).join(' ').trim();
      let nilai = ekspresi;
      if (ekspresi.startsWith('"') && ekspresi.endsWith('"')) {
        nilai = ekspresi.slice(1, -1); // string literal
      } else {
        nilai = evalMathExpression(ekspresi);
        if (!validasiNumerik(nilai)) {
          console.error('Nilai numerik tidak valid.');
          return;
        }
      }
      const berhasil = await setAtributContoh(jalurInfo.kelas, jalurInfo.jalurToken, nilai);
      if (berhasil) {
        console.log(`Atribut '${jalurInfo.jalurToken.join('.')}' pada '${jalurInfo.kelas}' diatur ke`, nilai);
      }
      return;
    }
  }

  const nama = namaVariabel.slice(1, -1);
  let nilai = null;

  if (tokens[2] === '=') {
    const ekspresi = tokens.slice(3).join(' ').trim();

    if (ekspresi.startsWith('{') && ekspresi.endsWith('}')) {
      try {
        const denganKutip = ekspresi.replace(/([{,])\s*([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
        nilai = JSON.parse(denganKutip);
      } catch (e) {
        console.error("Objek tidak valid:", e.message);
        return;
      }
    } else if (ekspresi.startsWith('[') && ekspresi.endsWith(']')) {
      try {
        const denganKutip = ekspresi.replace(/([{,])\s*([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
        nilai = JSON.parse(denganKutip);
      } catch (e) {
        nilai = parseArrayString(ekspresi, context, modules);
      }
    } else {
      let expr = ekspresi.replace(/:([a-zA-Z0-9_]+):/g, (_, v) => {
        const val = context.memory[v] ?? (context.lingkup?.[context.lingkup.length - 1] ?? {})[v];
        if (typeof val === 'number') return val;
        if (typeof val === 'string' && !isNaN(Number(val))) return Number(val);
        return val ?? 0;
      });
      nilai = evalMathExpression(expr);
      if (!validasiNumerik(nilai)) {
        console.error('Nilai numerik berada di luar batas yang diizinkan.');
        return;
      }
    }
  } else if (tokens[2].startsWith('[')) {
    const arrString = tokens.slice(2).join(' ');
    nilai = parseArrayString(arrString, context, modules);
    if (nilai === null) return;
  } else {
    console.error("Format salah. Gunakan: atur :nama: = nilai atau atur :nama: [nilai1 nilai2 ...]");
    return;
  }

  context.memory[nama] = nilai;
  console.log(`Variabel '${nama}' diatur ke`, nilai);
}

module.exports = { atur };
