// modules/evaluasi.js

const { resolveToken } = require('./tampilkan');

const operatorSet = new Set(['+', '-', '*', '/', '%', '==', '!=', '>=', '<=', '>', '<', '&&', '||', '!', '(', ')']);

async function evaluasi(tokens, modules, context) {
    if (tokens.length < 2) {
        console.log("Perintah 'evaluasi' membutuhkan ekspresi sebagai argumen.");
        return;
    }

    const ekspresiToken = tokens.slice(1);
    const nilaiTokens = [];

    for (const token of ekspresiToken) {
        if (operatorSet.has(token)) {
            nilaiTokens.push(token);
        } else {
            const nilai = resolveToken(token, context, modules);
            if (typeof nilai === 'string') {
                nilaiTokens.push(`"${nilai}"`);
            } else {
                nilaiTokens.push(nilai);
            }
        }
    }

    const ekspresi = nilaiTokens.join(' ');

    try {
        const hasil = Function(`"use strict"; return (${ekspresi})`)();
        console.log(hasil);
    } catch (err) {
        console.error(`Gagal evaluasi ekspresi '${ekspresi}': ${err.message}`);
    }
}

evaluasi.isBlock = false;

module.exports = { evaluasi };
