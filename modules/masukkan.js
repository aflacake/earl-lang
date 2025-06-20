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
            const isNumber = (input) => !isNaN(input);
            const maxLength = (input) => input.length <= 10;
            const isValidPattern = (input) => /^[a-zA-Z\s]*$/.test(input);

            if (isNumber(userInput)) {
                memory[varName] = Number(userInput);
                console.log(`${varName} disetujui sebagai angka.`);
            } else if (maxLength(userInput)) {
                memory[varName] = userInput;
                console.log(`${varName} disetujui dengan panjang maksimal.`);
            } else if (isValidPattern(userInput)) {
                memory[varName] = userInput;
                console.log(`${varName} disetujui dengan format yang benar.`)
            } else {
                console.error(`Input untuk ${varName} tidak valid. Pastikan input sesuai kriteria.`);
                return rl.close();
            }

            rl.close();
            resolve();
        });
    });
}

module.exports = { masukkan };
