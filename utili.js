// utili.js
const { memory } = require('./memory');

function tokenizekedua(input) {
  const tokens = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];

    if (ch === '"') {
      inQuotes = !inQuotes;
      current += ch;
    } else if (/\s/.test(ch)) {
      if (inQuotes) {
        current += ch;
      } else {
        if (current.length > 0) {
          tokens.push(current);
          current = '';
        }
      }
    } else {
      current += ch;
    }
  }
  if (current.length > 0) tokens.push(current);

  return tokens;
}

function ambilDaftarJikaPerlu(token) {
  if (token.startsWith(':') && token.endsWith(':')) {
    const nama = token.slice(1, -1);
    const nilai = memory[nama];
    if (Array.isArray(nilai)) return nilai;
  }
  return null;
}

function setTokenNilai(token, context, nilaiBaru) {
    if (token.startsWith(':') && token.endsWith(':')) {
        token = token.slice(1, -1);
    }

    const jalur = token.split(/[\.\[\]]+/).filter(Boolean);
    let target = context.memory;

    for (let i = 0; i < jalur.length - 1; i++) {
        const bagian = isNaN(jalur[i]) ? jalur[i] : Number(jalur[i]);
        if (!(bagian in target)) return false;
        target = target[bagian];
    }

    const bagianAkhir = isNaN(jalur.at(-1)) ? jalur.at(-1) : Number(jalur.at(-1));
    target[bagianAkhir] = nilaiBaru;
    return true;
}

function menguraikanJalur(token) {
    if (token.startsWith(':') && token.endsWith(':')) {
        token = token.slice(1, -1);
    }

    return token.split(/[\.\[\]]+/).filter(Boolean).map(p =>
        /^\d+$/.test(p) ? Number(p) : p
    );
}


module.exports = { 
    tokenizekedua,
    ambilDaftarJikaPerlu,
    setTokenNilai
};
