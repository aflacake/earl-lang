// modules/tulis.js

const fs = require('fs');

async function tulis(tokens, modules, context) {
    const namaVariabel = tokens[1];
    const isi = modules.memory[namaVariabel];

    if (typeof isi === 'undefined') {
        console.error(`Variabel '${namaVariabel}' tidak ditemukan.`;
        return;
    }

    try {
        fs.writeFileSync('output.txt', isi.toString(), 'utf-8');
        console.log("Isi berhasil ditulis ke file 'output.txt'");
    } catch (err) {
        console.error("Gagal menulis file:", err);
    }
}

module.exports = { tulis }
