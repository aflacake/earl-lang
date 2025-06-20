// modules/tampilkan.js

const fs = require('fs');
const chalk = require('chalk');
const { memory } = require('../memory.js');

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

function resolveToken(token) {
    const daftarBersarangMatch = token.match(/^:([^:\[\]]+)((\[\d+\])+):$/);
    if (daftarBersarangMatch) {
        const varName = daftarBersarangMatch[1];
        const indexes = [...token.matchAll(/\[(\d+)\]/g)].map(m => Number(m[1]));
        const arr = memory[varName];
        return aksesBersarang(arr, indexes);
    }

    const daftarSatuMatch = token.match(/^:([^:\[\]]+)\[(\d+)\]:$/);
    if (daftarSatuMatch) {
        const varName = daftarSatuMatch[1];
        const index = Number(daftarSatuMatch[2]);
        const arr = memory[varName];
        return Array.isArray(arr) ? arr[index] : `Error: '${varName}' buka daftar`;
    }

    const diktaMatch = token.match(/^:([^:\[\]]+):([^:\[\]]+)$/);
    if (diktaMatch) {
        const [_, varName, key] = diktaMatch;
        const obj = memory[varName];
        if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
            return key in obj ? obj[key] : `Kunci '${key}' tidak ditemukan`;
        }
        return `Error: '${varName}' bukan dikta`;
    }

    if (token.startsWith(':') && token.endsWith(':')) {
        const varName = token.slice(1, -1);
        return memory[varName];
    }

    if (token.includes('.')) {
        const [className, attrName] = token.split('.');
        const kelas = memory[className];
        if (kelas && kelas.__tipe === 'kelas') {
            return kelas.instance?.[attrName] ?? `Atribut '${attrName}' tidak ditemukan`;
        }
        return `Kelas '${className}' tidak ditemukan`;
    }

    if (!isNaN(token)) return Number(token);

    try {
        const dievaluasi = evalMathExpression(token);
        return dievaluasi;
    } catch {
        return token.replace(/"/g, '');
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
            const nilai = resolveToken(token);
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

module.exports = { tampilkan };
