// modules/atur.js

const { resolveToken, evalMathExpression } = require('./tampilkan');

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
    if (token.startsWith('"') && token.endsWith('"')) {
      return token.slice(1, -1);
    }
    return resolveToken(token, context, modules);
  });
}

function atur(tokens, modules, context) {
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
  const nama = namaVariabel.slice(1, -1);

  let nilai = null;

  if (tokens[2] === '=') {
    const ekspresi = tokens.slice(3).join(' ');

    if (ekspresi.trim().startsWith('[') && ekspresi.trim().endsWith(']')) {
      nilai = parseArrayString(ekspresi, context, modules);
    } else {
      let expr = ekspresi.replace(/:([a-zA-Z0-9_]+):/g, (_, v) => {
        const val = context.memory[v] ?? (context.lingkup?.[context.lingkup.length - 1] ?? {})[v];
        if (typeof val === 'number') return val;
        if (typeof val === 'string' && !isNaN(Number(val))) return Number(val);
        return val ?? 0;
      });

      nilai = evalMathExpression(expr);
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
