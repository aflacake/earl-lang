// modules/tampilkan.js

const fs = require('fs');
const chalk = require('chalk');
const { menguraikanJalur } = require('../utili');
const { validasiNumerik } = require('../utili');

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

    if (!isNaN(token)) {
        return Number(token);
    }

    if (token.startsWith('"') && token.endsWith('"')) {
        return token.slice(1, -1);
    }

    function cariDiLingkup(nama) {
        for (let i = lingkup.length - 1; i >= 0; i--) {
            if (Object.prototype.hasOwnProperty.call(lingkup[i], nama)) {
                return lingkup[i][nama];
            }
        }
        return undefined;
    }

    const nestedKeyMatch = token.match(/^:([a-zA-Z0-9_]+(?::[a-zA-Z0-9_]+)+):$/);
    if (nestedKeyMatch) {
        const keys = token.slice(1, -1).split(':');
        let value = memory[keys[0]] ?? cariDiLingkup(keys[0]);

        for (let i = 1; i < keys.length; i++) {
            if (value && typeof value === 'object' && keys[i] in value) {
                value = value[keys[i]];
            } else {
                return `Error: Kunci '${keys[i]}' tidak ditemukan di objek.`;
            }
        }
        return value;
    }

    const objAttrMatch = token.match(/^:([^:\[\]]+)\.([^:\[\]]+):$/);
    if (objAttrMatch) {
        const objName = objAttrMatch[1];
        const attrName = objAttrMatch[2];

        if (objName === 'ini' && ini) {
            if (attrName in ini) {
                const val = ini[attrName];
                if (typeof val === 'number' && !validasiNumerik(val)) {
                    return `Kesalahan: Atribut 'ini.${attrName}' mengandung angka tidak valid: ${val}`;
                }
                return val;
            }
            return `Kesalahan: Atribut '${attrName}' tidak ditemukan di 'ini'.`;
        }

        const obj = memory[objName] ?? cariDiLingkup(objName);
        if (obj && typeof obj === 'object') {
            if (attrName in obj) {
                const val = obj[attrName];
                if (typeof val === 'number' && !validasiNumerik(val)) {
                    return `Kesalahan: Atribut '${objName}.${attrName}' mengandung angka tidak valid: ${val}`;
                }
                return val;
            }
            return `Kesalahan: Atribut '${attrName}' tidak ditemukan di objek '${objName}'.`;
        }
        return `Kesalahan: '${objName}' bukan objek yang valid atau tidak ditemukan.`;
    }

    const daftarBersarangMatch = token.match(/^:([^:\[\]]+)((\[\d+\])+):$/);
    if (daftarBersarangMatch) {
        const varName = daftarBersarangMatch[1];
        const indexes = [...token.matchAll(/\[(\d+)\]/g)].map(m => Number(m[1]));
        const arr = memory[varName] ?? cariDiLingkup(varName);

        if (!Array.isArray(arr)) {
            return `Error: '${varName}' bukan array yang valid.`;
        }

        let current = arr;
        for (const idx of indexes) {
            if (!Array.isArray(current)) return undefined;
            if (idx < 0 || idx >= current.length || isNaN(idx)) return undefined;
            current = current[idx];
        }
        if (typeof current === 'number' && !validasiNumerik(current)) {
            return `Kesalahan: Nilai array bersarang '${varName}' mengandung angka tidak valid: ${current}`;
        }
        return current;
    }

    const daftarSatuMatch = token.match(/^:([a-zA-Z_][a-zA-Z0-9_]*)\[(\d+)\]:$/);
    if (daftarSatuMatch) {
        const varName = daftarSatuMatch[1];
        const index = Number(daftarSatuMatch[2]);
        const arr = memory[varName] ?? cariDiLingkup(varName);

        if (!Array.isArray(arr) || index < 0 || index >= arr.length) {
            return `Error: '${varName}' bukan array atau indeks tidak valid.`;
        }

        const val = arr[index];
        if (typeof val === 'number' && !validasiNumerik(val)) {
            return `Kesalahan: Nilai ${varName}[${index}] mengandung angka tidak valid: ${val}`;
        }
        return val;

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
        return memory[varName] ?? cariDiLingkup(varName) ?? `Token '${token}' tidak ditemukan.`;
    }

    const tokenMatchObjAttr = token.match(/^:([a-zA-Z_][\w]*)\.([a-zA-Z_][\w]*):$/);
    if (tokenMatchObjAttr) {
        const [, objName, attr] = tokenMatchObjAttr;
        const obj = memory[objName] ?? cariDiLingkup(objName);
        if (obj && typeof obj === 'object') {
            return attr in obj ? obj[attr] : `Error: Atribut '${attr}' tidak ditemukan di objek '${objName}'`;
        }
        return `Error: '${objName}' bukan objek yang valid atau tidak ditemukan.`;
    }

    if (token.includes('.')) {
        const [instanceName, attrName] = token.split('.');
        const instance = memory[instanceName] ?? cariDiLingkup(instanceName);
        if (instance && typeof instance === 'object') {
            return instance[attrName] ?? `Error: Atribut '${attrName}' tidak ditemukan.`;
        }
        return `Error: '${instanceName}' bukan objek.`;
    }

    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(token)) {
        for (let i = lingkup.length - 1; i >= 0; i--) {
            if (token in lingkup[i]) return lingkup[i][token];
        }
        return memory[token] ?? token;
    }

    let namaVar = token;

    if (namaVar.startsWith(':') && namaVar.endsWith(':')) {
        namaVar = namaVar.slice(1, -1);
    }

    const bagianPath = namaVar.split(/[\.\[\]]+/).filter(Boolean);

    let nilai = context.memory;
    for (const bagian of bagianPath) {
        if (nilai === undefined || nilai === null) break;

        if (!isNaN(bagian)) {
            nilai = nilai[Number(bagian)];
        } else {
            nilai = nilai[bagian];
        }
    }
    if (typeof nilai === 'number' && !validasiNumerik(nilai)) {
        return `Kesalahan: Nilai '${token}' mengandung angka tidak valid ${nilai}`;
    }

    return nilai;

    try {
        const disanitasi = token.replace(/[^0-9+\-*/%.() ]/g, '');
        if (!disanitasi.trim()) return token;
        return Function(`"use strict"; return (${disanitasi})`)();
    } catch {
        return token;
    }

    let bagianJalur = menguraikanJalur(token);
    let nilaiJalur = context.memory;

    for (const bagian of bagianJalur) {
        if (nilaiJalur === undefined || nilaiJalur === null) break;
        nilaiJalur = typeof bagian === 'number' ? nilai[bagian] : nilai[bagian];
    }
    return nilaiJalur;
}

function formatValue(val, verbose = false) {
    if (val === undefined) return chalk.gray('[undefined]');
    if (val === null) return chalk.gray('[null]');
    if (typeof val === 'number') return chalk.cyan(val);
    if (typeof val === 'string') {
        if (val.startsWith('"') && val.endsWith('"')) return chalk.green(val);
        return chalk.green(`"${val}"`);
    }
    if (typeof val === 'boolean') return chalk.yellow(val);
    if (Array.isArray(val)) {
        return verbose ? chalk.magenta(JSON.stringify(val, null, 2)) : chalk.magenta(val.join(' '));
    }
    if (typeof val === 'object') return verbose ? chalk.blue(JSON.stringify(val, null, 2)) : chalk.blue(`[objek]`);
    return String(val);
}

function tampilkan(tokens, modules, context) {
    const memory = context.memory || {};
    const lingkup = context.lingkup || [{}];

    if (tokens.length < 2) {
        console.log(chalk.red("Perintah 'tampilkan' memerlukan argumen."));
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

    function resolveNestedKey(key, context) {
        let value = memory[key]; // Cek di memory

        if (!value) {
            for (let scope of context.lingkup) {
                if (key in scope) {
                    value = scope[key];
                    break;
                }
            }
        }

        return value;
    }

    while (i < tokens.length) {
        const token = tokens[i];

        if (token === '>' && i + 1 < tokens.length) {
            fileKeluaran = tokens[i + 1].replace(/"/g, '');
            break;
        }

        if (token.startsWith(':') && token.endsWith(':')) {
            const nestedKey = token.slice(1, -1);
            let value = resolveNestedKey(nestedKey, context);
            if (value) {
                hasil.push(verbose ? JSON.stringify(value, null, 2) : formatValue(value, verbose));
            } else {
                console.error(`Variabel '${nestedKey}' tidak ditemukan.`);
            }
        } else if (token.startsWith('"') && token.endsWith('"')) {
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
