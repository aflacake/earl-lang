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
        if (!varName) {
            console.error("Variabel tujuan harus ditulis dalam format :nama:");
            retrun.resolve();
        }

        let prompt = 'Masukkan nilai untuk ' + varName + ': ';
        const sisa = token.slice(2).join(' ').trim();
        const quoted = sisa.match(/^"(.*)"$/);
        if (quoted) {
            prompt = quoted[1] + ' ';
        }

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question(prompt, (userInput) => {
            const isNumber = !isNaN(userInput);
            const maxLength = userInput.length <= 10;
            const isValidPattern = /^[a-zA-Z\s]+$/.test(userInput);

            if (isNumber) {
                memory[varName] = Number(userInput);
                console.log(`${varName} disimpan sebagai angka.`);
            } else if (isShortEnough && matchesPattern) {
                memory[varName] = userInput;
                console.log(`${varName} disimpan sebagai teks valid.`);
            } else {
                console.error(`Input untuk ${varName} tidak valid.`);
            }

            rl.close();
            resolve();
        });
    });
}

module.exports = { masukkan };
