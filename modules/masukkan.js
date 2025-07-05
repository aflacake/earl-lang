// modules/masukkan.js

const { memory } = require('../memory.js');
const readline = require('readline');
const { resolveToken } = require('./tampilkan');

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
            return resolve();
        }

        if (memory[varName]) {
            console.error(`Variabel ${varName} sudah didefinisikan.`);
            return resolve();
        }

        let prompt = 'Masukkan nilai untuk ' + varName + ': ';
        const sisa = tokens.slice(2).join(' ').trim();
        const quoted = sisa.match(/^"(.*)"$/);
        if (quoted) {
            prompt = quoted[1] + ' ';
        }

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question(prompt, (penggunaMasukkan) => {
            let nilai = penggunaMasukkan;

            if (penggunaMasukkan.startsWith(':') && penggunaMasukkan.endsWith(':')) {
                nilai = resolveToken(penggunaMasukkan, {}, {});
            }

            if (!isNaN(nilai)) {
                nilai = Number(nilai);
                memory[varName] = nilai;
                console.log(`${varName} disimpan sebagai angka.`);
            } else if (typeof nilai === 'string') {
                const cukupSingkat = nilai.length <= 10;
                const cocokDenganPola = /^[a-zA-Z\s]+$/.test(nilai);

                if (cukupSingkat && cocokDenganPola) { 
                    memory[varName] = nilai;
                    console.log(`${varName} disimpan sebagai teks valid.`);
                } else {
                    console.error(`Input untuk ${varName} tidak valid.`);
                }
            } else {
                memory[varName] = nilai;
                console.log(`${varName} disimpan.`);
            }

            rl.close();
            resolve();
        });
    });
}

module.exports = { masukkan };
