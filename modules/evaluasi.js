// modules/evaluasi.js

const { memory } = require('../memory');

function gantiVariabel(expr, lingkup) {
    return expr.replace(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g, (nama) => {
        if (nama in lingkup) return lingkup[nama];
        if (nama in memory) return memory[nama];
        return nama;
    });
}

async function evaluasi(tokens, modules, context) {
    if (tokens.length < 2) {
        console.log("Perintah 'evaluasi' membutuhkan ekspresi sebagai argumen.");
        return;
    }
    const ekspresiMentah = tokens.slice(1).join('');
    const lingkupGabungan = Object.assign({}, ...context.lingkup);

    const ekspresi = gantiVariabel(ekspresiMentah, lingkunganGabungan);

    try {
        const hasil = Function(`"use-strict"; return (${ekspresi})`)();
        console.log(hasil);
    } catch (err) {
        console.error(`Gagal evaluasi ekspresi 'ekspresi': ${err.message}`);
    }
}

module.exports = { evaluasi };
