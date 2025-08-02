// modules/mengangkat.js

const { resolveToken, evalMathExpression } = require('./tampilkan');

function naikkanNilai(tokens, context) {
    if (tokens.length < 3) {
        console.error("Perintah 'mengangkat' memerlukan dua argumen: variabel dan nilai.");
        return;
    }

    const namaVarToken = tokens[1];
    if (!namaVarToken.startsWith(':') || !namaVarToken.endsWith(':')) {
        console.error("Nama variabel harus dalam format :nama:");
        return;
    }

    const namaVar = namaVarToken.slice(1, -1);
    const meningkatSebesarEksp = tokens.slice(2).join(' ');

    const nilaiSaatIni = resolveToken(`:${namaVar}:`, context);
    const meningkatSebesar = evalMathExpression(meningkatSebesarEksp);

    if (isNaN(meningkatSebesar)) {
        console.error(`Nilai yang akan ditambahkan (${meningkatSebesarEksp}) tidak valid.`);
        return;
    }

    if (typeof nilaiSaatIni === 'number') {
        context.memory[namaVar] = nilaiSaatIni + meningkatSebesar;
        console.log(`Variabel '${namaVar}' dinaikkan menjadi ${context.memory[namaVar]}`);
    } else if (Array.isArray(nilaiSaatIni)) {
        nilaiSaatIni.push(meningkatSebesar);
        context.memory[namaVar] = nilaiSaatIni;
        console.log(`Elemen baru ${meningkatSebesar} ditambahkan ke daftar atau array '${namaVar}'`);
    } else if (typeof nilaiSaatIni === 'object' && nilaiSaatIni !== null) {
        for (const kunci in nilaiSaatIni) {
            if (typeof nilaiSaatIni[kunci] === 'number') {
                nilaiSaatIni[kunci] += meningkatSebesar;
                console.log(`Atribut '${kunci}' pada objek '${namaVar}' dinaikkan menjadi ${nilaiSaatIni[kunci]}`);
            }
        }
        context.memory[namaVar] = nilaiSaatIni;
    } else {
        console.error(`Variabel '${namaVar}' bukan tipe data yang valid untuk 'mengangkat'`);
    }
}

async function penanganMengangkat(tokens, modules, context) {
    naikkanNilai(tokens, context);
}

penanganMengangkat.isBlock = false;
module.exports = { mengangkat: penanganMengangkat };
