// modules/mengangkat.js

const { resolveToken, evalMathExpression } = require('./tampilkan');

function naikkanNilai(tokens, context) {
    if (tokens.length < 3) {
        console.error("Perintah 'mengangkat' memerlukan dua argumen: variabel dan nilai.");
        return;
    }

    const namaVar = tokens[1];
    const meningkatSebesarEksp = tokens.slice(2).join(' ');

    const nilaiSaatIni = resolveToken(namaVar, context);
    let meningkatSebesar = evalMathExpression(meningkatSebesarEksp);

    if (isNaN(meningkatSebesar)) {
        console.error(`Nilai yang akan ditambahkan (${meningkatSebesarEksp}) tidak valid.`);
        return;
    }

    if (typeof nilaiSaatIni === 'number') {
        context.memory[namaVar] = nilaiSaatIni + meningkatSebesar;
        console.log(`Variabel '${namaVar}' dinaikkan menjadi ${nilaiSaatIni + meningkatSebesar}`);
    } else if (Array.isArray(nilaiSaatIni)) {
        // Cek apakah array elemen objek
        if (nilaiSaatIni.length > 0 && typeof nilaiSaatIni[0] === 'object' && nilaiSaatIni[0] !== null) {
            for (const obj of nilaiSaatIni) {
                for (const kunci in obj) {
                    if (typeof obj[kunci] === 'number') {
                        obj[kunci] += meningkatSebesar;
                        console.log(`Atribut '${kunci}' pada objek dinaikkan menjadi ${obj[kunci]}`);
                    }
                }
            }
            context.memory[namaVar] = nilaiSaatIni;
        } else {
            nilaiSaatIni.push(meningkatSebesar);
            context.memory[namaVar] = nilaiSaatIni;
            console.log(`Elemen baru ${meningkatSebesar} ditambahkan ke daftar atau array '${namaVar}'`);
        }
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
