// modules/daftar.js

const { memory } = require('../memory.js');

async function daftar(tokens) {
    const cmd = tokens[1];

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

    if (cmd === 'hapus') {
       const varName = tokens[2].slice(1, -1);
       if (!Array.isArray(memory[varName])) {
            console.error(`'${varName}' bukan daftar.`);
            return;
        }
        memory[varName].pop();
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
    console.error(`Perintah daftar '${cmd}' tidak dikenali.`);
}

module.exports = { daftar };
