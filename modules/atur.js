// modules/atur.js

function atur(tokens, modules, context) {
    if (!context.lingkup || context.lingkup.length === 0) {
        context.lingkup = [{}];
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

    let nilai;
    if (!isNaN(nilaiToken)) {
        nilai = Number(nilaiToken);
    } else if (nilaiToken === 'benar') {
        nilai = true;
    } else if (nilaiToken === 'salah') {
        nilai = false;
    } else if (nilaiToken.startsWith('"') && nilaiToken.endsWith('"')) {
        nilai = nilaiToken.slice(1, -1);
    } else {
        nilai = nilaiToken;
    }

    context.lingkup[context.lingkup.length - 1][nama] = nilai;

    console.log(`Variabel '${nama}' diatur ke`, nilai);
}

module.exports = { atur };
