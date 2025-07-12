// modules/isi.js

const { resolveToken } = require('./tampilkan');

function isi(tokens, modules, context) {
    if (!context.memory) {
        context.memory = {};
    }

    if (tokens.length < 4 || tokens[2] !== 'dengan') {
        console.error("Format salah. Gunakan: isi :nama: dengan nilai");
        return;
    }

    const namaVariabel = tokens[1];
    if (!namaVariabel.startsWith(':') || !namaVariabel.endsWith(':')) {
        console.error("Variabel harus dalam format :nama:");
        return;
    }

    const nama = namaVariabel.slice(1, -1);
    const nilaiToken = tokens.slice(3).join(' ');

    let nilai;
    if (nilaiToken.startsWith('"') && nilaiToken.endsWith('"')) {
        nilai = nilaiToken.slice(1, -1);
    } else {
        nilai = resolveToken(nilaiToken, context, modules);
    }

    context.memory[nama] = nilai;

    console.log(`Variabel '${nama}' diisi dengan`, nilai);
}

module.exports = { isi };
