// modules/atur.js

const { memory } = require('../memory.js');
const { resolveToken } = require('./tampilkan');

function parseArrayFromTokens(tokens, startIndex, context, modules) {
    if (tokens[startIndex] !== '[') return null;

    let arr = [];
    let i = startIndex + 1;
    while (i < tokens.length && tokens[i] !== ']') {
        let token = tokens[i];

        if (token.startsWith('"') && token.endsWith('"')) {
            arr.push(token.slice(1, -1));
        } else {
            arr.push(resolveToken(token, context, modules));
        }
        i++;
    }

    if (i === tokens.length || tokens[i] !== ']') {
        console.error("Format array salah, harus diakhiri dengan ']'");
        return null;
    }

    return { array: arr, nextIndex: i };
}

function atur(tokens, modules, context) {
    if (!context.memory) {
        context.memory = {};
    }

    if (tokens.length < 3) {
        console.error("Format salah. Gunakan: atur :nama: = nilai atau atur :nama: [nilai1 nilai2 ...]");
        return;
    }

    const namaVariabel = tokens[1];
    if (!namaVariabel.startsWith(':') || !namaVariabel.endsWith(':')) {
        console.error("Variabel harus dalam format :nama:");
        return;
    }
    const nama = namaVariabel.slice(1, -1);

    if (tokens[2] === '[') {
        const parsed = parseArrayFromTokens(tokens, 2, context, modules);
        if (!parsed) return;
        context.memory[nama] = parsed.array;
        memory[nama] = parsed.array;
        console.log(`Variabel '${nama}' diatur ke array`, parsed.array);
        return;
    }

    if (tokens[2] !== '=') {
        console.error("Format salah. Gunakan: atur :nama: = nilai");
        return;
    }

    let nilai;
    if (tokens[3] === '[') {
        const parsed = parseArrayFromTokens(tokens, 3, context, modules);
        if (!parsed) return;
        nilai = parsed.array;
    } else if (tokens.length === 4) {
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
    memory[nama] = nilai;

    console.log(`Variabel '${nama}' diatur ke`, nilai);
}

module.exports = { atur };
