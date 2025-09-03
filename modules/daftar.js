// modules/daftar.js

const { memory } = require('../memory.js');
const { resolveToken } = require('./tampilkan');
const { validasiIndeks, validasiNumerik } = require('../utili')

function adaItem(daftar, item) {
    return daftar.includes(item);
}

async function daftar(tokens, modules, context) {
    const cmd = tokens[1];

    const resolveValue = (val) => {
        if (/^".*"$/.test(val)) {
            return val.slice(1, -1);
        } else if (!isNaN(val)) {
            return Number(val);
        } else if (val.startsWith(':') && val.endsWith(':')) {
            const resolved = resolveToken(val);
            if (typeof resolved === 'string' && resolved.startsWith('Kesalahan:')) {
                console.error(resolved);
                return null;
            }
            return resolved;
        }
        return val;
    };


    if (cmd === 'buat') {
        const varName = tokens[2].slice(1, -1);
        memory[varName] = [];
        return;
    }

    if (cmd === 'panjang') {
        const varName = tokens[2].slice(1, -1);
        if (!Array.isArray(memory[varName])) {
            console.error(`'${varName}' bukan daftar.`);
            return;
        }
        console.log(memory[varName].length);
        return;
    }

    if (cmd === 'tambah') {
        const varName = tokens[2].slice(1, -1);
        if (!Array.isArray(memory[varName])) {
            console.error(`'${varName}' bukan daftar.`);
            return;
        }
        let val = tokens.slice(3).join(' ').trim();
        val = resolveValue(val);
        if (val === null) {
            return;
        }
        memory[varName].push(val);
        return;
    }

    if (cmd === 'hapuspop') {
       const varName = tokens[2].slice(1, -1);
       if (!Array.isArray(memory[varName])) {
            console.error(`'${varName}' bukan daftar.`);
            return;
        }
        if (memory[varName].length === 0) {
            console.error(`Underflow: '${varName}' kosong, tidak bisa pop.`);
            return;
        }
        const removed = memory[varName].pop();
        console.log(`Elemen '${removed}' terakhir dari '${varName}' dihapus.`);
        return; 
    }

    if (cmd === 'gabung') {
        const namaA = tokens[2].slice(1, -1);
        const namaB = tokens[3].slice(1, -1);
        const namaHasil = tokens[4].slice(1, -1);

        if (!Array.isArray(memory[namaA]) || !Array.isArray(memory[namaB])) {
            console.error("Semua operand gabung harus berupa daftar.");
            return;
        }
        memory[namaHasil] = [...memory[namaA], ...memory[namaB]];
        console.log(`Daftar '${namaHasil}' diatur ke hasil gabungan.`);
        return;
    }

    if (cmd === 'ambil') {
        const varName = tokens[2].slice(1, -1);
        const indexes = tokens.slice(3).map(Number);

        let current = memory[varName];

        for (const idx of indexes) {
            if (!Array.isArray(current)) {
                console.error(`Daftar bersarang tidak valid di '${varName}' pada indeks ${idx}.`);
                return;
            }
            if (!validasiIndeks(current, idx)) {
                console.error(`Indeks '${idx}' underflow atau overflow untuk daftar '${varName}'.`);
                return;
            }
            current = current[idx];
        }

        console.log(current);
        return;
    }

    if (cmd === 'sisip') {
        const varName = tokens[2].slice(1, -1);
        const index = Number(tokens[3]);
        let val = tokens.slice(4).join(' ').trim();

        if (!Array.isArray(memory[varName])) {
            console.error(`'${varName}' bukan daftar.`);
            return;
        }

        const panjang = memory[varName].length;
        if (isNaN(index) || index < 0 || index > panjang) {
            console.error(`Indeks '${index}' underflow atau overflow untuk daftar '${varName}'.`);
            return;
        }

        val = resolveValue(val);
        memory[varName].splice(index, 0, val);
        console.log(`Nilai disisipkan ke indeks ${index} dalam daftar '${varName}'.`);
        return;
    }

    if (cmd === 'hapus' && tokens.length === 4) {
        const varName = tokens[2].slice(1, -1);
        const index = Number(tokens[3]);

        if (!Array.isArray(memory[varName])) {
            console.error(`'${varName}' bukan daftar.`);
            return;
        }

        if (!validasiIndeks(memory[varName], index)) {
            console.error(`Indeks '${index}' underflow atau overflow untuk daftar '${varName}'.`);
            return;
        }
        const removed = memory[varName].splice(index, 1);
        console.log(`Elemen '${removed[0]}' di indeks ${index} telah dihapus dari '${varName}'.`);
        return;
    }

    if (cmd === 'ada') {
        const varName = tokens[2].slice(1, -1);
        let val = tokens[3];
        val = resolveValue(val);

        if (!Array.isArray(memory[varName])) {
            console.error(`'${varName}' bukan daftar.`);
            return;
        }

        console.log(adaItem(memory[varName], val) ? 'benar' : 'salah');
        return;
    }

    console.error(`Perintah daftar '${cmd}' tidak dikenali.`);
}

module.exports = { daftar };
