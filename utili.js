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

module.exports = { tokenizekedua, ambilDaftarJikaPerlu };
