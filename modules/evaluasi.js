// modules/evaluasi.js

const { resolveToken } = require('./tampilkan');

const operatorSet = new Set([
  '+', '-', '*', '/', '%', '(', ')', '**', '>', '<', '>=', '<=', '==', '!=', '===', '!==', '&&', '||', '!', '^'
]);

function isOperator(token) {
  return operatorSet.has(token);
}

async function evaluasi(tokens, modules, context) {
  if (tokens.length < 2) {
    console.log("Perintah 'evaluasi' membutuhkan ekspresi sebagai argumen.");
    return;
  }

  const ekspresiParts = [];

  for (let i = 1; i < tokens.length; i++) {
    const token = tokens[i];

    if (isOperator(token)) {
      ekspresiParts.push(token);
      continue;
    }

    if (!isNaN(token)) {
      ekspresiParts.push(token);
      continue;
    }

    const nilai = resolveToken(token, context);

    if (typeof nilai === 'string' && nilai.startsWith('Error:')) {
      ekspresiParts.push(`"${nilai}"`);
    }
    else if (typeof nilai === 'string') {
      ekspresiParts.push(`"${nilai}"`);
    }
    else {
      ekspresiParts.push(nilai);
    }
  }

  const ekspresi = ekspresiParts.join(' ');

  try {
    const hasil = Function(`"use strict"; return (${ekspresi})`)();
    console.log(hasil);
  } catch (err) {
    console.error(`Gagal evaluasi ekspresi '${ekspresi}': ${err.message}`);
  }
}

module.exports = { evaluasi };
