// modules/dikta.js

const { memory } = require('../memory');

function parseDikta(tokens, start = 0) {
    const obj = {};
    let i = start;
    while (i < tokens.length) {
        if (tokens[i] === '}') {
            return { obj, nextIndex: i + 1 };
        }
        const key = tokens[i];
        if (tokens[i + 1] === '{') {
            const { obj: nestedObj, nextIndex } = parseDikta(tokens, i + 2);
            obj[key] = nestedObj;
            i = nextIndex; 
        } else {
            const value = tokens[i + 1];
            if (value === undefined) {
                throw new Error(`Nilai untuk kunci '${key}' tidak ditemukan.`);
            }
            obj[key] = value;
            i += 2;
        }
    }
    return { obj, nextIndex: i };
}

function dikta(tokens, modules, context) {
    if (tokens.length < 2) {
        throw new Error("Format dikta tidak valid. Contoh: dikta :huruf: a A b B c C");
    }

    const nama = tokens[1];

    if (!nama.startsWith(':') || !nama.endsWith(':')) {
        throw new Error("Nama dikta harus dalam format :nama:");
    }

    const namaBersih = nama.slice(1, -1);

    if (tokens.length === 2) {
        const alfabet = {};
        for (let i = 97; i <= 122; i++) {
            const huruf = String.fromCharCode(i);
            alfabet[huruf] = huruf.toUpperCase();
        }
        memory[namaBersih] = alfabet;
        return;
    }

    const { obj } = parseDikta(tokens, 2);
    memory[namaBersih] = obj;
}

module.exports = { dikta };
