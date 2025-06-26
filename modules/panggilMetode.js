// modules/panggilMetode.js

const { memory } = require('../memory');
const { runEarl } = require('../pemroses');

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
        console.error(`Metode '${namaMethod}' tidak ditemukan di kelas '${instance.__tipe}'.`)
        return;
    }

    const kode = metodeBody;

    const subContext = {
        index: 0,
        lines: [kode],
        lingkup: [{ ini: instance }],
        dariMetode: true
    };

    await runEarl(kode, modules, subContext);
}

module.exports = { panggilMetode };
