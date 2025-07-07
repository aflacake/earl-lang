// modules/tulis.js

const fs = require('fs');

async function tulis(tokens, modules, context) {
    if (!context.memory) {
        context.memory = {};
    }

    const namaVariabel = tokens[1];

    if (!namaVariabel.startsWith(':') || !namaVariabel.endsWith(':')) {
        console.error("Variabel harus dalam format :nama:");
        return;
    }

    const nama = namaVariabel.slice(1, -1);

    const isi = context.memory[nama];

    if (typeof isi === 'undefined') {
        console.error(`Variabel '${namaVariabel}' tidak ditemukan.`);
        return;
    }

    try {
        fs.writeFileSync('keluaran.txt', isi.toString(), 'utf-8');
        console.log("Isi berhasil ditulis ke file 'keluaran.txt'");
    } catch (err) {
        console.error("Gagal menulis file:", err);
    }
}

module.exports = { tulis };
