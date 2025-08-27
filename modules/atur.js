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

  const pathRegex = /^:([a-zA-Z0-9_]+)((?:\.[a-zA-Z_][a-zA-Z0-9_]*|\[\d+\])+):$/;
  const pathMatch = namaVariabel.match(pathRegex);
  if (pathMatch) {
    const [, rootName, pathString] = pathMatch;

    const rootObj = context.memory[rootName];
    if (!rootObj) {
      console.error(`Objek '${rootName}' tidak ditemukan.`);
      return;
  }

    const pathParts = [];
    const regex = /\.([a-zA-Z_][a-zA-Z0-9_]*)|\[(\d+)\]/g;
    let match;
    while ((match = regex.exec(pathString)) !== null) {
      if (match[1]) pathParts.push(match[1]);
      else if (match[2]) pathParts.push(Number(match[2]));
    }

    let target = rootObj;
    for (let i = 0; i < pathParts.length - 1; i++) {
      const part = pathParts[i];
      if (target[part] === undefined) {
        target[part] = typeof pathParts[i + 1] === 'number' ? [] : {};
      }
      target = target[part];
    }

    const key = pathParts[pathParts.length - 1];
    const ekspresi = tokens.slice(3).join(' ').trim();
    let nilai;

    if (ekspresi.startsWith('"') && ekspresi.endsWith('"')) {
      nilai = ekspresi.slice(1, -1);
    } else {
      nilai = evalMathExpression(ekspresi);
      if (!validasiNumerik(nilai)) {
        console.error('Nilai numerik tidak valid.');
        return;
      }
    }

    target[key] = nilai;
    console.log(`Atribut '${pathParts.join('.')}' pada '${rootName}' diatur ke`, nilai);
    return;
  }

  if (typeof namaVariabel !== 'string' || !namaVariabel.startsWith(':') || !namaVariabel.endsWith(':')) {
      console.error("Variabel harus dalam format :nama:");
      return;
  }

  const operator = tokens[2];

  if (operator === '=') {
    const jalurInfo = parseJalurToken(namaVariabel);
    if (jalurInfo) {
      const ekspresi = tokens.slice(3).join(' ').trim();
      let nilai = ekspresi;
      if (ekspresi.startsWith('"') && ekspresi.endsWith('"')) {
        nilai = ekspresi.slice(1, -1);
      } else {
        nilai = evalMathExpression(ekspresi);
        if (Array.isArray(nilai)) {
            for (const v of nilai) {
                if (!validasiNumerik(v)) {
                    console.error('Nilai array tidak valid:', v);
                    return;
                }
            }
        } else if (!validasiNumerik(nilai)) {
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
  } else if (operator === ':=') {
    const nama = namaVariabel.slice(1, -1);
    const ekspresi = tokens.slice(3).join(' ').trim();

    let nilai;

    if (ekspresi.startsWith('"') && ekspresi.endsWith('"')) {
      nilai = ekspresi.slice(1, -1);
    } else if (ekspresi.startsWith('{') && ekspresi.endsWith('}')) {
      try {
        const denganKutip = ekspresi.replace(/([{,])\s*([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
        nilai = JSON.parse(denganKutip);
      } catch (e) {
        console.error("Objek tidak valid pada penugasan ulang:", e.message);
        return;
      }
    } else if (ekspresi.startsWith('[') && ekspresi.endsWith(']')) {
      try {
        const denganKutip = ekspresi.replace(/([{,])\s*([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
        nilai = JSON.parse(denganKutip);
      } catch {
        nilai = parseArrayString(ekspresi, context, modules);
        if (nilai === null) return;
      }
    } else {
      let expr = ekspresi.replace(/:([a-zA-Z0-9_]+):/g, (_, v) => {
        const val = context.memory[v] ?? (context.lingkup?.[context.lingkup.length - 1] ?? {})[v];
        if (typeof val === 'number') return val;
        if (typeof val === 'string' && !isNaN(Number(val))) return Number(val);
        return val ?? 0;
      });

      if (!isNaN(expr) || /^[0-9+\-*/%.() ]+$/.test(expr)) {
        nilai = evalMathExpression(expr);
        if (!validasiNumerik(nilai)) {
          console.error('Nilai numerik tidak valid pada penugasan ulang.');
          return;
        }
      } else {
        nilai = expr;
      }
    }

    if (context.lingkup && context.lingkup.length > 0) {
      context.lingkup[context.lingkup.length - 1][nama] = nilai;
    } else {
      context.memory[nama] = nilai;
    }
    console.log(`Penugasan variabel variabel '${nama}' ke nilai`, nilai);
    return;
  }

  const nama = namaVariabel.slice(1, -1);

  if (tokens[2] === '=') {
    const ekspresi = tokens.slice(3).join(' ').trim();
    let nilai;

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
      } catch {
        nilai = parseArrayString(ekspresi, context, modules);
      }
    } else if (ekspresi.startsWith('"') && ekspresi.endsWith('"')) {
      nilai = ekspresi.slice(1, -1);
    } else {
      let expr = ekspresi.replace(/:([a-zA-Z0-9_]+):/g, (_, v) => {
        const val = context.memory[v] ?? (context.lingkup?.[context.lingkup.length - 1] ?? {})[v];
        if (typeof val === 'number') return val;
        if (typeof val === 'string' && !isNaN(Number(val))) return Number(val);
        return val ?? 0;
      });

      if (!isNaN(expr) || /^[0-9+\-*/%.() ]+$/.test(expr)) {
        nilai = evalMathExpression(expr);
        if (!validasiNumerik(nilai)) {
          console.error('Nilai numerik berada di luar batas yang diizinkan.');
          return;
        }
      } else {
        nilai = expr;
      }
    }

    if (context.lingkup && context.lingkup.length > 0) {
      context.lingkup[context.lingkup.length - 1][nama] = nilai;
    } else {
      context.memory[nama] = nilai;
    }

    context.memory[nama] = nilai;
    console.log(`Variabel '${nama}' diatur ke`, nilai);
    return;
  }

  if (tokens[2].startsWith('[')) {
    const arrString = tokens.slice(2).join(' ');
    const nilai = parseArrayString(arrString, context, modules);
    if (nilai === null) return;
    context.memory[nama] = nilai;
    console.log(`Variabel '${nama}' diatur ke`, nilai);
    return;
  }

  console.error("Format salah. Gunakan: atur :nama: = nilai atau atur :nama: [nilai1 nilai2 ...]");
}

module.exports = { atur };
