// modules/panggilMetode.js

const { memory } = require('../memory');
const { runEarl } = require('../pemroses');
const { validasiIndeks, validasiNumerik } = require('../utili');

async function panggilMetode(tokens, modules, context) {
    const namaInstance = tokens[1].replace(/:/g, '');
    const namaMethod = tokens[2];

    const instance = memory[namaInstance];
    if (!instance || !instance.__tipe) {
        console.error(`Instance '${namaInstance}' tidak ditemukan.`);
        return;
    }

    const kelas = memory[instance.__tipe];
    const metodeBody = kelas.metode[namaMethod];

    if (!metodeBody) {
        console.error(`Metode '${namaMethod}' tidak ditemukan di kelas '${instance.__tipe}'.`);
        return;
    }

    for (const [key, val] of Object.entries(instance)) {
        if (typeof val === 'number' && !validasiNumerik(val)) {
            console.warn(`Nilai atribut '${key}' = ${val} tidak valid, metode '${namaMethod}' tidak akan dijalankan.`);
            return;
        }
        if (Array.isArray(val)) {
            val.forEach((v, idx) => {
                if (typeof v === 'number' && !validasiNumerik(v)) {
                    console.warn(`Indeks ${idx} dari atribut array '${key}' bernilai ${v} tidak valid, metode '${namaMethod}' tidak akan dijalankan.`);
                    return;
                }
            });
        }
    }

    const subContext = {
        index: 0,
        lines: [ metodeBody ],
        lingkup: [{ ini: instance }],
        dariMetode: true
    };

    await runEarl(metodeBody, modules, subContext);
}

module.exports = { panggilMetode };
