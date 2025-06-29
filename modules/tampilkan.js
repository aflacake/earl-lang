// modules/tampilkan.js

const fs = require('fs');
const chalk = require('chalk');

function evalMathExpression(expr) {
    try {
        const disanitasi = expr.replace(/[^0-9+\-*/%.() ]/g, '');
        if (!disanitasi.trim()) return expr;

        return Function(`"use strict"; return (${disanitasi})`)();
    } catch {
        return expr;
    }
}

function aksesBersarang(arr, indexes) {
    let current = arr;
    for (const idx of indexes) {
        if (!Array.isArray(current)) return undefined;
        if (idx < 0 || idx >= current.length || isNaN(idx)) return undefined;
        current = current[idx];
    }
    return current;
}


function resolveToken(token, context = {}, modules = {}) {
    const { memory = {}, lingkup = [{}], ini = null } = context;

    function cariDiLingkup(nama) {
        for (let i = lingkup.length - 1; i >= 0; i--) {
            if (nama in lingkup[i]) return lingkup[i][nama];
        }
        return undefined;
    }

    const objAttrMatch = token.match(/^:([^:\[\]]+)\.([^:\[\]]+):$/);
    if (objAttrMatch) {
        const objName = objAttrMatch[1];
        const attrName = objAttrMatch[2];

        if (objName === 'ini' && context.ini) {
            if (attrName in context.ini) return context.ini[attrName];
            return `Error: Atribut '${attrName}' tidak ditemukan di 'ini'.`;
        }

        const obj = memory[objName] ?? cariDiLingkup(objName);
        if (obj && typeof obj === 'object') {
            if (attrName in obj) return obj[attrName];
            return `Error: Atribut '${attrName}' tidak ditemukan di objek '${objName}'.`;
        }
        return `Error: '${objName}' bukan objek yang valid atau tidak ditemukan.`;
    }

    const daftarBersarangMatch = token.match(/^:([^:\[\]]+)((\[\d+\])+):$/);
    if (daftarBersarangMatch) {
        const varName = daftarBersarangMatch[1];
        const indexes = [...token.matchAll(/\[(\d+)\]/g)].map(m => Number(m[1]));
        const arr = memory[varName] ?? cariDiLingkup(varName);

        if (!Array.isArray(arr)) {
            return `Error: '${varName}' bukan array yang valid.`;
        }

        return aksesBersarang(arr, indexes);
    }

    return `Token '${token}' tidak dikenali atau tidak dapat ditemukan.`;

    const daftarSatuMatch = token.match(/^:([a-zA-Z_][a-zA-Z0-9_]*)\[(\d+)\]:$/);
    if (daftarSatuMatch) {
        const varName = daftarSatuMatch[1];
        const index = Number(daftarSatuMatch[2]);
        const arr = memory[varName] ?? cariDiLingkup(varName);

        if (!Array.isArray(arr) || index < 0 || index >= arr.length) {
            return `Error: '${varName}' bukan array atau indeks tidak valid.`;
        }

        return arr[index];
    }

    const diktaMatch = token.match(/^:([^:\[\]]+):([^:\[\]]+)$/);
    if (diktaMatch) {
        const [_, varName, key] = diktaMatch;
        const obj = memory[varName];

        if (typeof obj !== 'object' || obj === null) {
            return `Error: '${varName}' bukan objek yang valid`;
        }
        return key in obj ? obj[key] : `Kunci '${key}' tidak ditemukan`;
    }

    if (token.startsWith(':') && token.endsWith(':')) {
        const varName = token.slice(1, -1);
        return memory[varName] ?? `Token '${token}' tidak dikenali atau tidak dapat ditemukan.`;
    }

    if (token.includes('.')) {
        const [instanceName, attrName] = token.split('.');
        const instance = memory[instanceName];

        if (
            instance &&
            instance.__tipe &&
            memory[instance.__tipe] &&
            memory[instance.__tipe].__tipe === 'kelas'
        ) {
            if (attrName in instance) {
                return instance[attrName];
            }
            return `Error: Atribut '${attrName}' tidak ditemukan di instance '${instanceName}'.`;
        }
        if (typeof instance === 'object' && instance !== null) {
            return instance[attrName] ?? `Error: Atribut '${attrName}' tidak ditemukan.`;
        }
        return `Error: '${instanceName}' bukan instance yang valid.`;
    }

    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(token)) {
        return memory[token] ?? token;
    }
    return `Token '${token}' tidak dikenali atau tidak dapat ditemukan.`;

    if (!isNaN(token)) return Number(token);

    try {
        return evalMathExpression(token);
    } catch {
        return token;
    }
}

function formatValue(val, verbose = false) {
    if (val === undefined) return chalk.gray('[undefined]');
    if (typeof val === 'number') return chalk.cyan(val);
    if (typeof val === 'string') return chalk.green(`"${val}"`);
    if (typeof val === 'boolean') return chalk.yellow(val);
    if (Array.isArray(val)) return verbose ? chalk.magenta(JSON.stringify(val, null, 2)) : chalk.magenta(`[daftar(${val.length})]`);
    if (typeof val === 'object') return verbose ? chalk.blue(JSON.stringify(val, null, 2)) : chalk.blue(`[objek]`);
    return String(val);
}

function tampilkan(tokens, modules, context) {
    const memory = context.memory || {};
    const lingkup = context.lingkup || [{}];

    if (tokens.length < 2) {
        console.log(chalk.red("Perintah 'tampilkan' memelukan argumen."));
        return;
    }

    let verbose = false;
    let hasil = [];
    let fileKeluaran = null;

    let i = 1;
    if (tokens[i] === '-v') {
        verbose = true;
        i++;
    }

    if (tokens[i] === 'memory') {
        console.log('Isi memory saat ini:');
        console.dir(memory, { depth: null, colors: true });
        return;
    }

    while (i < tokens.length) {
        const token = tokens[i];

        if (token === '>' && i + 1 < tokens.length) {
            fileKeluaran = tokens[i + 1].replace(/"/g, '');
            break;
        }

        if (token.startsWith('"') && token.endsWith('"')) {
            hasil.push(token.slice(1, -1));
        } else {
            const nilai = resolveToken(token, context, modules);
            hasil.push(verbose ? JSON.stringify(nilai, null, 2) : formatValue(nilai, verbose));
        }
        i++;
    }

    const keluaran = hasil.join(' ');

    if (fileKeluaran) {
        fs.writeFileSync(fileKeluaran, keluaran + '\n');
        console.log(chalk.gray(`Output disimpan ke file: ${fileKeluaran}`));
    } else {
        console.log(keluaran);
    }
}

async function tampilkanHandler(tokens, modules, context) {
  tampilkan(tokens, modules, context);
}

tampilkanHandler.isBlock = false;
module.exports = { tampilkan: tampilkanHandler, resolveToken, evalMathExpression };
