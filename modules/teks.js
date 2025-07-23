// modules/teks.js

const { memory } = require('../memory');
const { resolveToken } = require('./tampilkan');

async function teks(tokens, modules, context) {
    if (tokens.length < 3) {
        console.error("Format perintah teks salah. Contoh: teks ambil :nama: 0 5");
        return;
    }

    const aksi = tokens[1];
    const namaVariabelToken = tokens[2];

    if (!namaVariabelToken || !namaVariabelToken.startsWith(':') || !namaVariabelToken.endsWith(':')) {
        console.error("Nama variabel harus dalam format :nama:");
        return;
    }

    const namaVariabel = namaVariabelToken.slice(1, -1);
    let isi = memory[namaVariabel];

    if (aksi !== 'isi' && aksi !== 'pecah' && typeof isi !== 'string') {
        console.error(`Variabel '${namaVariabel}' tidak berisi teks.`);
        return;
    }

    switch (aksi) {
        case 'panjang':
            console.log(isi.length);
            break;

        case 'gabung': {
            const tambahan = [];
            for (const token of tokens.slice(3)) {
                const nilai = resolveToken(token, context);
                if (nilai === undefined) {
                    console.error(`Token '${token}' tidak dapat diselesaikan.`);
                    return;
                }
                tambahan.push(String(nilai));
            }
            memory[namaVariabel] += tambahan.join('');
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
            if (tokens.length < 4) {
                console.error("Format: teks ganti :nama: \"yang dicari\" \"pengganti\"");
                return;
            }
            const dari = resolveToken(tokens[3], context);
            const menjadi = resolveToken(tokens[4] ?? '""', context);
            if (!dari) {
                console.error("Argumen 'yang dicari' tidak valid atau kosong.");
                return;
            }
            memory[namaVariabel] = isi.split(dari).join(String(menjadi));
            console.log(`Semua '${dari}' diganti dengan '${menjadi}':`);
            break;
        }

        case 'ambil': {
            if (tokens.length < 5) {
                console.error("Format: teks ambil :nama: indeks panjang");
                return;
            }
            const mulai = parseInt(resolveToken(tokens[3], context));
            const panjang = parseInt(resolveToken(tokens[4], context));

            if (isNaN(mulai) || isNaN(panjang) || mulai < 0 || panjang < 0 || mulai >= isi.length) {
                console.error("Indeks atau panjang tidak valid.");
                return;
            }
            console.log(isi.substr(mulai, panjang));
            break;
        }

        case 'hapus': {
            if (tokens.length < 5) {
                console.error("Format: teks hapus :nama: indeks panjang");
                return;
            }
            const mulai = parseInt(resolveToken(tokens[3], context));
            const panjang = parseInt(resolveToken(tokens[4], context));
            if (isNaN(mulai) || isNaN(panjang) || mulai < 0 || panjang < 0 || mulai >= isi.length) {
                console.error("Indeks atau panjang tidak valid.");
                return;
            }
            memory[namaVariabel] = isi.slice(0, mulai) + isi.slice(mulai + panjang);
            console.log(`Bagian dari '${namaVariabel}' dihapus`);
            break;
        }

        case 'pangkas':
            memory[namaVariabel] = isi.trim();
            console.log(`Hasil pangkas: '${memory[namaVariabel]}'`);
            break;

        case 'isi': {
            if (tokens.length < 4) {
                console.error("Format: teks isi :nama: \"teks baru\"");
                return;
            }
            const teksBaru = [];
            for (const token of tokens.slice(3)) {
                const nilai = resolveToken(token, context);
                if (nilai === undefined) {
                    console.error(`Token '${token}' tidak dapat diselesaikan.`);
                    return;
                }
                teksBaru.push(String(nilai));
            }
            memory[namaVariabel] = teksBaru.join('');
            console.log(`Isi variabel '${namaVariabel}' diubah.`);
            break;
        }

        case 'pecah': {
            const pembatas = resolveToken(tokens[3] ?? '""', context);
            memory[namaVariabel] = isi.split(pembatas);
            console.log(`Variabel '${namaVariabel}' dipecah menjadi daftar.`);
            break;
        }

        case 'cocok': {
            if (tokens.length < 4) {
                console.error("Format: teks cocok :nama: \"teks yang dicari\"");
                return;
            }
            const teksDicari = resolveToken(tokens[3], context);
            if (typeof teksDicari !== 'string') {
                console.error("Teks yang dicocokkan harus berupa string");
                return;
            }
            console.log(isi.includes(teksDicari));
            break;
        }

        default:
            console.error(`Perintah string '${aksi}' tidak dikenali.`);
    }
}

module.exports = { teks };
