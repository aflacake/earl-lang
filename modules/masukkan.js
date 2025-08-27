// modules/masukkan.js

const { memory } = require('../memory.js');
const readline = require('readline');
const { resolveToken } = require('./tampilkan');
const { validasiNumerik } = require('../utili');

async function masukkan(tokens, modules) {
    const varName = tokens[1].replace(/:/g, '');

    if (
        tokens[1].startsWith(':') &&
        tokens[1].endsWith(':') &&
        tokens[2] === 'sebagai'
    ) {
        const namaKelas = varName;
        const namaInstance = tokens[3];

        if (!memory[namaKelas]) {
            console.error(`Kelas ${namaKelas} belum didefinisikan.`);
            return;
        }

        if (memory[namaKelas].__tipe !== 'kelas') {
            console.error(`'${namaKelas}' bukan kelas.`);
            return;
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
        return;
    }

    if (tokens[1].startsWith(':') && tokens[1].endsWith(':')) {
        if (memory[varName]) {
            console.error(`Variabel ${varName} sudah didefinisikan.`);
            return;
        }

        let prompt = 'Masukkan nilai untuk ' + tokens[1] + ': ';
        const sisa = tokens.slice(2).join(' ').trim();
        const quoted = sisa.match(/^"(.*)"$/);
        if (quoted) {
            prompt = quoted[1] + ' ';
        }

        const penggunaMasukkan = await modules.bacaBaris(prompt);

        let nilai = penggunaMasukkan;

        if (/^:[a-zA-Z0-9_]+:$/.test(penggunaMasukkan)) {
            nilai = resolveToken(penggunaMasukkan, {}, {});
        }

        if (!isNaN(nilai)) {
            nilai = Number(nilai);

            if (!validasiNumerik(nilai)) {
                console.error('Nilai numerik berada di luar batas yang diizinkan.');
                return;
            }

            memory[varName] = nilai;
            console.log(`${varName} disimpan sebagai angka.`);
        } else if (typeof nilai === 'string') {
            const cukupSingkat = nilai.length <= 10;
            const cocokDenganPola = /^[a-zA-Z\s]+$/.test(nilai);

            if (cukupSingkat && cocokDenganPola) {
                memory[varName] = nilai;
                console.log(`${varName} disimpan sebagai teks valid.`);
            } else {
                console.error(`Masukkan untuk ${varName} tidak valid.`);
            }
        } else {
            memory[varName] = nilai;
            console.log(`${varName} disimpan.`);
        }
    }
}

module.exports = { masukkan };

