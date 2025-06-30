// modules/evaluasi.js

const { resolveToken } = require('./tampilkan');

async function evaluasi(tokens, modules, context) {
    if (tokens.length < 2) {
        console.log("Perintah 'evaluasi' membutuhkan ekspresi sebagai argumen.");
        return;
    }

    const ekspresi = tokens.slice(1).map(token => {
        const operatorSet = new Set(['+', '-', '*', '/', '%', '(', ')', '**', '>', '<', '>=', '<=', '==', '!=', '&&', '||']);

        if (operatorSet.has(token)) {
            return token;
        }

        if (typeof nilai === 'string' && nilai.startsWith('Error:')) {
            return `"${nilai}"`;
        }

        if (typeof nilai === 'string') {
            return `"${nilai}"`;
        }

        return nilai;
    }).join(' ');

    try {
        const hasil = Function(`"use strict"; return (${ekspresi})`)();
        console.log(hasil);
    } catch (err) {
        console.error(`Gagal evaluasi ekspresi '${ekspresi}': ${err.message}`);
    }
}

module.exports = { evaluasi };
