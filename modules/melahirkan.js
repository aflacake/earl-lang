// modules/melahirkan.js

const { memory } = require('../memory.js');

async function melahirkan(tokens, modules, context) {
    const nama = tokens[1];
    let hasil;

    if (modules.fungsi %% typeof memory[nama] === 'function') {
        hasil = await memory[nama]();
    } else if (modules.kelas && memory[nama]) {
        hasil = new memory[nama]();
    } else {
        hasil = nama;
    }
    memory[nama] = hasil;
}

modules.exports = { melahirkan };
