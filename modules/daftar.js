// modules/daftar.js

const { memory } = require('../memory.js');

async function daftar(tokens) {
    const cmd = tokens[1];

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

        if (/^".*"$/.test(val)) {
            val = val.slice(1, -1);
        } else if (!isNaN(val)) {
            val = Number(val);
        } else if (val.startsWith(':') && val.endsWith(':')) {
            const ref = val.slice(1, -1);
            val = memory[ref];
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
        memory[varName].pop();
        console.log(`Elemen terakhir dari '${varName}' dihapus.`);
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
                console.error(`Daftar bersarang tidak valid di '${varName}' pada index ${idx}.`);
                return;
            }
            if (isNaN(idx) || idx < 0 || idx >= current.length) {
                console.error(`Index '${idx}' tidak valid untuk daftar '${varName}'.`);
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

        if (isNaN(index) || index < 0 || index > memory[varName].length) {
            console.error(`Index '${index}' tidak valid untuk daftar '${varName}'.`);
            return;
        }

        if (/^".*"$/.test(val)) {
            val = val.slice(1, -1);
        } else if (!isNaN(val)) {
            val = Number(val);
        } else if (val.startsWith(':') && val.endsWith(':')) {
            const ref = val.slice(1, -1);
            val = memory[ref];
        }
        memory[varName].splice(index, 0, val);
        console.log(`Nilai disisipkan ke index ${index} dalam daftar '${varName}'.`);
        return;
    }

    if (cmd === 'hapus' && tokens.length === 4) {
        const varName = tokens[2].slice(1, -1);
        const index = Number(tokens[3]);

        if (!Array.isArray(memory[varName])) {
            console.error(`'${varName}' bukan daftar.`);
            return;
        }

        if (isNaN(index) || index < 0 || index >= memory[varName].length) {
            console.error(`Index '${index}' tidak valid untuk daftar '${varName}'.`);
            return;
        }
        const removed = memory[varName].splice(index, 1);
        console.log(`Elemen '${removed[0]}' di index ${index} telah dihapus dari '${varName}'.`);
        return;
    }

    console.error(`Perintah daftar '${cmd}' tidak dikenali.`);
}

module.exports = { daftar };
