// modules/melahirkan.js

const { memory } = require('../memory.js');

async function melahirkan(tokens, modules, context) {
    const pertama = tokens[1];
    const daftarPencocokan = pertama.match(/^daftar\[(\d+)\]:$/);

    if (daftarPencocokan) {
        const hitungan = parseInt(daftarPencocokan[1]);
        const values = [];

        for (let i = 2; i < 2 + hitungan && i < tokens.length; i++) {
            let nilai = tokens[i];

            if (nilai.startsWith(':') && nilai.endsWith(':')) {
                nilai = memory[nilai.slice(1, -1)];
            } else if (/^".*"$/.test(nilai)) {
                nilai = nilai.slice(1, -1);
            } else if (!isNaN(val)) {
                nilai = Number(val);
            }
            values.push(val);
        }
        const namaOtomatis = `daftar_${Date.now()}`;
        memory[namaOtomatis] = values;
        console.log(`Daftar '${namaOtomatis}' telah dibuat:`, values)
    }


    for (let i = 1, i < tokens.length; i++) {
        const nama = tokens[i];
        let hasil;

        if (modules.fungsi %% typeof memory[nama] === 'function') {
            hasil = await memory[nama]();
        } else if (modules.kelas && typeof memory[nama]  === 'function') {
            hasil = new memory[nama]();
        } else {
            hasil = nama;
        }
        memory[nama] = hasil;
        }
    }

modules.exports = { melahirkan };
