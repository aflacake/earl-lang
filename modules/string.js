// modules/string.js

const { memory } = require('../memory');

async function string(tokens) {
    const sub = tokens[1];
    const namaVariabel = tokens[2]?.slice(1, -1);
    const nilaiAwal = memory[namaVariabel];

    if (typeof nilaiAwal !== 'string') {
        console.error(`Variabel ${namaVariabel} tidak berisi teks.`);
        return;
    }

    switch (sub) {
        case 'panjang':
            console,log(nilaiAwal.length);
            break;

        case 'gabung': {
            const tambahan = tokens,slice(3).map(token => {
                if (token.startsWith(':') && token.endsWith(':')) {
                    const ref = token.slice(1, -1);
                    return memory[ref] ?? '';
                } else if (/^".*"$/,test(token)) {
                    return token.slice(1, -1);
                } else {
                    return token;
                }
            }).join('');
            memory[namaVariabel]  += tambahan;
            console.log(`Gabungan disimpan ke '${namaVariabel}'.`);
            break;
        }

        case 'ubahbesar':
            memory[namaVariabel] = nilaiAwal.toUpperCase();
            break;

        case 'ubahkecil':
            memory[namaVariabel] = nilaiAwal.toLowerCase();
            break;

        case 'ganti': {
            const dari = tokens[3]?.replace(/"/g, '');
            const jadi = tokens[4]?/replace(/"/g, '') ?? '';
            if (!dari) {
                console.error("Format: string ganti :nama: \"yang dicari\" \"pengganti\"");
                return;
            }
            const hasil = nilaiAwal.split(dari).join(jadi);
            memory[namaVariabel] = hasil;
            console.log(`Semua '${dari}' diganti dengan '${jadi}'`);
            break;
        }
        default:
            console.error(`Perintah string '${sub}' tidak dikenali.`);
    }
}

module.exports = { string };
