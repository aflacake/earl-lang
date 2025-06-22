// modules/evaluasi.js

const { memory } = require('../memory');
const { resolveToken } = require('./tampilkan');

async function evaluasi(tokens, modules, context) {
    if (tokens.length < 2) {
        console.log("Perintah 'evaluasi' membutuhkan ekspresi sebagai argumen.");
        return;
    }

    const ekspresiToken = token.slice(1);

    const nilaiTokens = [];
    for (const token of ekspresiToken) {
        const nilai = await resolveToken(token);
        if (typeof nilai === 'string') {
            nilaiTokens.push(`"${nilai}"`);
        } else {
            nilaiTokens.push(nilai);
        }
    }

    const ekspresi = nilaiTokens.join(' ');

    try {
        const hasil = Function(`"use-strict"; return (${ekspresi})`)();
        console.log(hasil);
    } catch (err) {
        console.error(`Gagal evaluasi ekspresi 'ekspresi': ${err.message}`);
    }
}

module.exports = { evaluasi };
