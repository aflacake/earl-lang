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
    let isi = context.memory[namaVariabel];

    console.log('DEBUG namaVariabel:', namaVariabel);
    console.log('DEBUG isi sebelum operasi:', isi, typeof isi);

    if (
        aksi !== 'isi' &&
        aksi !== 'pecah' &&
        aksi !== 'gabung' &&
        typeof isi !== 'string'
    ) {
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
                console.log(`DEBUG resolveToken('${token}') =>`, nilai);
                if (nilai === undefined) {
                    console.error(`Token '${token}' tidak dapat diselesaikan.`);
                    return;
                }
                tambahan.push(String(nilai));
            }
            if (context.memory[namaVariabel] === undefined) {
                context.memory[namaVariabel] = '';
            }

            context.memory[namaVariabel] += tambahan.join('');
            console.log(`DEBUG isi setelah gabung:`, context.memory[namaVariabel]);
            break;
        }

        case 'besarkan':
            context.memory[namaVariabel] = isi.toUpperCase();
            console.log(memory[namaVariabel]);
            break;

        case 'kecilkan':
            context.memory[namaVariabel] = isi.toLowerCase();
            console.log(memory[namaVariabel]);
            break;

        case 'ganti': {
            if (tokens.length < 4) {
                console.error("Format: teks ganti :nama: \"yang dicari\" \"pengganti\"");
                return;
            }
            let dari = resolveToken(tokens[3], context);
            let menjadi = resolveToken(tokens[4] ?? '""', context);

            if (typeof dari === 'string' && dari.startsWith('"') && dari.endsWith('"')) {
                dari = dari.slice(1, -1);
            }
            if (typeof menjadi === 'string' && menjadi.startsWith('"') && menjadi.endsWith('"')) {
                menjadi = menjadi.slice(1, -1);
            }

            if (!dari) {
                console.error("Argumen 'yang dicari' tidak valid atau kosong.");
                return;
            }
            context.memory[namaVariabel] = isi.split(dari).join(String(menjadi));
            console.log(`Semua '${dari}' telah diganti dengan '${menjadi}' dalam variabel '${namaVariabel}'.`);
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
            context.memory[namaVariabel] = isi.slice(0, mulai) + isi.slice(mulai + panjang);
            console.log(`Bagian dari '${namaVariabel}' dihapus`);
            break;
        }

        case 'pangkas':
            context.memory[namaVariabel] = isi.trim();
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
            context.memory[namaVariabel] = teksBaru.join('');
            console.log(`Isi variabel '${namaVariabel}' diubah.`);
            break;
        }

        case 'pecah': {
            const pembatas = resolveToken(tokens[3] ?? '""', context);
            context.memory[namaVariabel] = isi.split(pembatas);
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
