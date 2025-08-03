// modules/mengangkat.js

const { resolveToken, evalMathExpression } = require('./tampilkan');
const { setNilaiBersarang } = require('../utili');

function naikkanNilai(tokens, context) {
    if (tokens.length < 3) {
        console.error("Perintah 'mengangkat' memerlukan dua argumen: variabel dan nilai.");
        return;
    }

    const tokenVar = tokens[1];
    const ekspresiKenaikan = tokens.slice(2).join(' ');

    const nilaiSaatIni = resolveToken(tokenVar, context);

    if (typeof nilaiSaatIni === 'string' && nilaiSaatIni.startsWith('Kesalahan:')) {
        console.error(nilaiSaatIni);
        return;
    }

    const kenaikan = evalMathExpression(ekspresiKenaikan);

    if (typeof kenaikan !== 'number' || isNaN(kenaikan)) {
        console.error(`Nilai kenaikan '${ekspresiKenaikan}' tidak valid.`);
        return;
    }

    const varName = tokenVar.startsWith(':') && tokenVar.endsWith(':')
        ? tokenVar.slice(1, -1)
        : tokenVar;

    if (typeof nilaiSaatIni !== 'number' && !Array.isArray(nilaiSaatIni) && (typeof nilaiSaatIni !== 'object' || nilaiSaatIni === null)) {
        console.error(`Variabel '${varName}' bukan tipe data yang valid untuk 'mengangkat'`);
        return;
    }

    if (typeof nilaiSaatIni === 'number') {
        const berhasil = setNilaiBersarang(context.memory, varName, nilaiSaatIni + kenaikan);
        if (berhasil) {
            console.log(`Nilai '${varName}' dinaikkan menjadi ${nilaiSaatIni + kenaikan}`);
        } else {
            console.error(`Gagal mengatur nilai untuk '${varName}'`);
        }
    } else if (Array.isArray(nilaiSaatIni)) {
        if (nilaiSaatIni.length > 0 && typeof nilaiSaatIni[0] === 'object') {
            for (const obj of nilaiSaatIni) {
                for (const kunci in obj) {
                    if (typeof obj[kunci] === 'number') {
                        obj[kunci] += kenaikan;
                        console.log(`Atribut '${kunci}' pada objek dinaikkan menjadi ${obj[kunci]}`);
                    }
                }
            }
        } else {
            nilaiSaatIni.push(kenaikan);
            console.log(`Elemen baru ${kenaikan} ditambahkan ke daftar atau array '${varName}'`);
        }
    } else if (typeof nilaiSaatIni === 'object' && nilaiSaatIni !== null) {
        for (const kunci in nilaiSaatIni) {
            if (typeof nilaiSaatIni[kunci] === 'number') {
                nilaiSaatIni[kunci] += kenaikan;
                console.log(`Atribut '${kunci}' pada objek '${varName}' dinaikkan menjadi ${nilaiSaatIni[kunci]}`);
            }
        }
    } else {
        console.error(`Variabel '${varName}' bukan tipe data yang valid untuk 'mengangkat'`);
    }
}

async function penanganMengangkat(tokens, modules, context) {
    naikkanNilai(tokens, context);
}

penanganMengangkat.isBlock = false;
module.exports = { mengangkat: penanganMengangkat };
