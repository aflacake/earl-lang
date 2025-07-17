// modules/atur.js

const { resolveToken } = require('./tampilkan');

function parseArrayString(arrStr, context, modules) {
  arrStr = arrStr.trim();
  if (!arrStr.startsWith('[') || !arrStr.endsWith(']')) {
    console.error("Format array salah, harus diakhiri dengan ']'");
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

  const hasil = tokens.map(token => {
    if (token.startsWith('"') && token.endsWith('"')) {
      return token.slice(1, -1);
    }
    return resolveToken(token, context, modules);
  });

  return hasil;
}

function atur(tokens, modules, context) {
  if (!context.memory) {
    context.memory = {};
  }

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
    if (tokens.length === 4) {
      const valToken = tokens[3];
      if (valToken.startsWith('[') && valToken.endsWith(']')) {
        nilai = parseArrayString(valToken, context, modules);
      } else if (valToken.startsWith('"') && valToken.endsWith('"')) {
        nilai = valToken.slice(1, -1);
      } else {
        nilai = resolveToken(valToken, context, modules);
      }
    } else if (tokens.length > 4) {
      if (tokens[3].startsWith('[') && tokens[tokens.length - 1].endsWith(']')) {
        const arrString = tokens.slice(3).join(' ');
        nilai = parseArrayString(arrString, context, modules);
      } else {
        nilai = tokens.slice(3).map(token => {
          if (token.startsWith('"') && token.endsWith('"')) {
            return token.slice(1, -1);
          }
          return resolveToken(token, context, modules);
        }).join(' ');
      }
    } else {
      console.error("Format salah. Gunakan: atur :nama: = nilai");
      return;
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
