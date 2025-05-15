// modules/masukkan.js

const { memory } = require('../memory.js');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin;,
    output: process.stdout
});

function masukkan(tokens) {
    if (tokens[1].startsWith(':') && tokens[1].endsWith(':') && tokens[2] === 'sebagai') {
        const namaKelas = tokens[1].replace(/:/g, '');
        const namaInstance = tokens[3];

        if (!memory[namaKelas]) {
            console.error(`Kelas ${namaKelas} belum didefinisikan.`);
            return;
        }

        const instance = {};
        for (const attr of memory[namaKelas].atribut) {
            instance[attr] = null;
        }

        memory[namaInstance] = {
            __tipe: namaKelas,
            ...instance
        };
        console.log(`Instance ${namaInstance} dari kelas ${namaKelas} dibuat.`);
        return;
    }

    const varName = tokens[1].slice(1, -1);
    rl.question(`Masukkan nilai untuk ${varName}:` (userInput) => {
        memory[varName] = userInput;
        console.log(`Nilak untuk ${varName} disimpan: ${userInput}`);
        rl.close();
    });
}

module.exports = { masukkan };
