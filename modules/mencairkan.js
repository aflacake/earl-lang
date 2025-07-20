// modules/mencairkan.js

const { memory } = require('../memory.js');
const { resolveToken } = require('./tampilkan.js');

function cairkanTeks(tokens, modules, context) {
    let targetVar = null;
    let offset = 1;

    if (tokens[1]?.startsWith(':') && tokens[1]?.endsWith(':')) {
        targetVar = tokens[1].slice(1, -1);
        offset = 2;
    }

    let nilai = resolveToken(tokens[offset], context);

    if (typeof nilai === 'string') {
        if (nilai.startsWith('"') && nilai.endsWith('"')) {
            nilai = nilai.slice(1, -1);
        }

        const angka = parseFloat(nilai);
        if (!isNaN(angka)) {
            if (targetVar) {
                memory[targetVar] = angka;
            } else {
                console.log(angka);
            }
        } else {
            console.error(`Tidak bisa mengonversi '${nilai}' menjadi angka.`);
        }
    } else {
        console.error(`Harap memberikan teks sebagai input untuk 'cairkanTeks'.`);
    }
}

function cairkanAngka(tokens, modules, context) {
    let targetVar = null;
    let offset = 1;

    if (tokens[1]?.startsWith(':') && tokens[1]?.endsWith(':')) {
        targetVar = tokens[1].slice(1, -1);
        offset = 2;
    }

    let nilai = resolveToken(tokens[offset], context);

    if (typeof nilai === 'number') {
        const str = nilai.toString();
        if (targetVar) {
            memory[targetVar] = str;
        } else {
            console.log(str);
        }
    } else {
        console.error(`Harap memberikan angka sebagai input untuk 'cairkanAngka'.`);
    }
}

module.exports = {
    cairkanTeks,
    cairkanAngka
};
