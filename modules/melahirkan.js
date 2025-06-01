// modules/melahirkan.js

const { memory } = require('../memory.js');

async function melahirkan(tokens, modules, context) {
    const pertama = tokens[1];
    const daftarPencocokan = pertama.match(/^daftar\[(\d+)\]:$/);

    if (daftarPencocokan) {
        const hitungan = parseInt(daftarPencocokan[1]);
        const values = [];

        for (let i = 2; i < 2 + hitungan && i < tokens.length; i++) {
            let val = tokens[i];
            let nilai;

            if (val.startsWith(':') && val.endsWith(':')) {
                nilai = memory[val.slice(1, -1)];
            } else if (/^".*"$/.test(val)) {
                nilai = val.slice(1, -1);
            } else if (!isNaN(val)) {
                nilai = Number(val);
            } else {
                nilai = val
            }
            values.push(nilai);
        }
        const namaOtomatis = `daftar_${Date.now()}`;
        memory[namaOtomatis] = values;
        console.log(`Daftar '${namaOtomatis}' telah dibuat:`, values);
        return;
    }


    for (let i = 1; i < tokens.length; i++) {
        const nama = tokens[i];
        let hasil;

        if (typeof memory[nama] === 'function' && modules.fungsi) {
            hasil = await memory[nama]();
        } else if (modules.kelas && typeof memory[nama]  === 'function') {
            hasil = new memory[nama]();
        } else {
            hasil = nama;
        }
        memory[nama] = hasil;
        }
    }

module.exports = { melahirkan };
