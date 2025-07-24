// modules/tulis.js

const fs = require('fs');
const path = require('path');

async function tulis(tokens, modules, context) {
    if (!context.memory) context.memory = {};

    if (tokens.length < 2) {
        console.error("Format: tulis :nama_variabel: > \"nama_file.txt\" (opsional)");
        return;
    }

    const namaToken = tokens[1];
    if (!namaToken.startsWith(':') || !namaToken.endsWith(':')) {
        console.error("Variabel harus dalam format :nama:");
        return;
    }

    const nama = namaToken.slice(1, -1);
    const isi = context.memory[nama];

    if (typeof isi === 'undefined') {
        console.error(`Variabel '${nama}' tidak ditemukan.`);
        return;
    }

    let file = 'keluaran.txt';
    let append = false;

    for (let i = 2; i < tokens.length; i++) {
        if (tokens[i] === '>' && tokens[i + 1]) {
            file = tokens[i + 1].replace(/^"+|"+$/g, '');
            break;
        } else if (tokens[i] === '>>' && tokens[i + 1]) {
            file = tokens[i + 1].replace(/^"+|"+$/g, '');
            append = true;
            break;
        }
    }

    try {
        const mode = append ? 'a' : 'w';
        fs.writeFileSync(file, isi.toString() + '\n', { encoding: 'utf-8', flag: mode });
        console.log(`Isi '${nama}' berhasil ${append ? 'ditambahkan ke' : 'ditulis ke'} file '${file}'`);
    } catch (err) {
        console.error("Gagal menulis file:", err.message);
    }
}

module.exports = { tulis };
