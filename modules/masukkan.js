// modules/masukkan.js

const { memory } = require('../memory.js');
const readline = require('readline');

function masukkan(tokens) {
    return new Promise((resolve) => {
        if (
            tokens[1].startsWith(':') &&
            tokens[1].endsWith(':') &&
            tokens[2] === 'sebagai'
        ) {
            const namaKelas = tokens[1].replace(/:/g, '');
            const namaInstance = tokens[3];

            if (!memory[namaKelas]) {
                console.error(`Kelas ${namaKelas} belum didefinisikan.`);
                return resolve();
            }

            if (memory[namaKelas].__tipe !== 'kelas') {
                console.error(`'${namaKelas}' bukan kelas.`);
                return resolve();
            }

            const instance = {};
            for (const attr of memory[namaKelas].atribut || []) {
                instance[attr] = null;
            }

            memory[namaInstance] = {
                __tipe: namaKelas,
                ...instance,
            };
            console.log(`Instance ${namaInstance} dari kelas ${namaKelas} dibuat.`);
            return resolve();
        }

        const varName = tokens[1].replace(/:/g, '');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question(`Masukkan nilai untuk '${varName}':`, (userInput) => {
            memory[varName] = userInput;
            console.log(`Nilai untuk ${varName} disimpan: ${userInput}`);
            rl.close();
            resolve();
        });
    });
}

module.exports = { masukkan };
