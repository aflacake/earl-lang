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

    let nilai;
    if (tokens.length === 4) {
        const valToken = tokens[3];
        if (valToken.startsWith('"') && valToken.endsWith('"')) {
            nilai = valToken.slice(1, -1);
        } else {
            nilai = resolveToken(valToken, context, modules);
        }
    } else {
        nilai = tokens.slice(3).map(token => {
            if (token.startsWith('"') && token.endsWith('"')) {
                return token.slice(1, -1);
            }
            return resolveToken(token, context, modules);
        }).join(' ');
    }

    context.memory[nama] = nilai;

    console.log(`Variabel '${nama}' diatur ke`, nilai);
}

module.exports = { atur };
