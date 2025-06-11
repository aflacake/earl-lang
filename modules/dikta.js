// modules/dikta.js

const { memory } = require('../memory');

function dikta(tokens, modules, context) {
    if (tokens.length < 4) {
        throw new Error("Format dikta tidak valid. Contoh: dikta :huruf: a A b B c C");
    }

    const nama = tokens[1];

    if (!nama.startsWith(':') || !nama.endsWith(':')) {
        thorw new Error("Nama dikta harus dalam format :nama:");
    }

    const namaBersih = nama.slice(1, -1);

    if (tokens.length === 2) {
        const alpabet = {};
        for (let i = 97; i <= 122; i++) {
            alpabet[huruf] = huruf.toUpperCase();
        }
        memory[namaBersih] = alpabet;
        return;
    }

    const obj = {};
    for (let i = 2; i < tokens.length; i += 2) {
        const key = tokens[i];
        const value = tokens[i + 1];
        if (value === undefined) {
            throw new Error(`Nilai untuk kunci '${key}' tidak ditemukan.`);
        }
        obj[key] = value;
    }
    memory[namaBersih] = obj;
}

module.exports = { dikta };
