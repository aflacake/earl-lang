// modules/teks.js

const { memory } = require('../memory');

async function teks(tokens) {
    const aksi = tokens[1];
    const namaVariabel = tokens[2]?.slice(1, -1);
    const isi = memory[namaVariabel];

    if (typeof isi !== 'string') {
        console.error(`Variabel ${namaVariabel} tidak berisi teks.`);
        return;
    }

    switch (aksi) {
        case 'panjang':
            console.log(isi.length);
            break;

        case 'gabung': {
            const tambahan = tokens.slice(3).map(token => {
                if (token.startsWith(':') && token.endsWith(':')) {
                    const ref = token.slice(1, -1);
                    return memory[ref] ?? '';
                } else if (/^".*"$/.test(token)) {
                    return token.slice(1, -1);
                } else {
                    return token;
                }
            }).join('');
            memory[namaVariabel]  += tambahan;
            console.log(`Teks ditambahkan ke '${namaVariabel}'.`);
            break;
        }

        case 'besarkan':
            memory[namaVariabel] = isi.toUpperCase();
            console.log(memory[namaVariabel]);
            break;

        case 'kecilkan':
            memory[namaVariabel] = isi.toLowerCase();
            console.log(memory[namaVariabel]);
            break;

        case 'ganti': {
            const dari = tokens[3]?.replace(/"/g, '');
            const menjadi = tokens[4]?.replace(/"/g, '') ?? '';
            if (!dari) {
                console.error("Format: string ganti :nama: \"yang dicari\" \"pengganti\"");
                return;
            }
            const hasil = isi.split(dari).join(menjadi);
            memory[namaVariabel] = hasil;
            console.log(`Semua '${dari}' diganti dengan '${menjadi}':`, hasil);
            break;
        }
        default:
            console.error(`Perintah string '${aksi}' tidak dikenali.`);
    }
}

module.exports = { teks };
