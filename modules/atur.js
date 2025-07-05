// modules/atur.js

const { resolveToken } = require('./tampilkan');

function atur(tokens, modules, context) {
    if (!context.memory) {
        context.memory = {};
    }

    if (tokens.length < 4 || tokens[2] !== '=') {
        console.error("Format salah. Gunakan: atur :nama: = nilai");
        return;
    }

    const namaVariabel = tokens[1];
    if (!namaVariabel.startsWith(':') || !namaVariabel.endsWith(':')) {
        console.error("Variabel harus dalam format :nama:");
        return;
    }

    const nama = namaVariabel.slice(1, -1);
    const nilaiToken = tokens.slice(3).join(' ');

    let nilai = resolveToken(nilaiToken, context, modules);

    context.memory[nama] = nilai;

    console.log(`Variabel '${nama}' diatur ke`, nilai);
}

module.exports = { atur };
