// modules/mencairkan.js

const { memory } = require('../memory.js');
const { resolveToken } = require('./tampilkan.js');

function cairkanTeks(tokens, modules, context) {
    let targetVar = null;
    let masukkanTokenIndex = 1;

    if (tokens[1]?.startsWith(':') && tokens[1]?.endsWith(':')) {
        targetVar = tokens[1].slice(1, -1);
        masukkanTokenIndex = 2;
    }

    if (tokens.length <= masukkanTokenIndex) {
        console.error("Argumen tidak lengkap untuk 'cairkanTeks'");
        return;
    }

    let nilai = resolveToken(tokens[masukkanTokenIndex], context, modules);

    if (typeof nilai !== 'string') {
        console.error(`Masukkan untuk 'cairkanTeks' harus berupa teks, ditemukan tipe: ${typeof nilai}`);
        return;
    }

    if (nilai.startsWith('"') && nilai.endsWith('"')) {
        nilai = nilai.slice(1, -1);
    }

    const angka = parseFloat(nilai);

    if (isNaN(angka)) {
        console.error(`Tidak dapat mengonversi '${nilai}' menjadi angka.`);
        return;
    }

    if (targetVar) {
        memory[targetVar] = angka;
    } else {
        console.log(angka);
    }
}

function cairkanAngka(tokens, modules, context) {
    let targetVar = null;
    let masukkanTokenIndex = 1;

    if (tokens[1]?.startsWith(':') && tokens[1]?.endsWith(':')) {
        targetVar = tokens[1].slice(1, -1);
        masukkanTokenIndex = 2;
    }

    if (tokens.length <= masukkanTokenIndex) {
        console.error("Argumen tidak lengkap untuk 'cairkanAngka'");
        return;
    }

    let nilai = resolveToken(tokens[masukkanTokenIndex], context, modules);

    if (typeof nilai !== 'number') {
        console.error(`Masukkan untuk 'cairkanAngka' harus berupa angka, ditemukan tipe: ${typeof nilai}`);
        return;
    }

    const str = nilai.toString();

    if (targetVar) {
        memory[targetVar] = str;
    } else {
        console.log(str);
    }
}

module.exports = {
    cairkanTeks,
    cairkanAngka
};
