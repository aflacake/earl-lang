// modules/atur.js

const { memory } = require('../memory.js');

async function atur(tokens, modules, context) {
    if (
        tokens[1] === 'hapus' &&
        tokens[2] &&
        tokens[2].startsWith(':') &&
        tokens[2].endsWith(':')
    ) {
        const key = tokens[2].slice(1, -1);
        if (key in memory) {
            const confirmDelete = tokens[3] === 'konfirmasi';
            if (confirmDelete) {
                delete memory[key];
                console.log(`Variabel '${key}' dihapus.`);
            } else {
                console.log(`Perintah 'hapus' membutuhkan konfirmasi. Gunakan: 'atur hapus :nama: konfirmasi'`);
            }
        } else {
            console.log(`Variabel '${key}' tidak ditemukan.`);
        }
        return;
    }

    // kasus 1
    const line = context.lines[context.index].trim();
    if (tokens.length >= 2 && tokens[1].startsWith(':') && tokens[1].endsWith(':') && line.endsWith('(')) {
        const key = tokens[1].slice(1, -1);
        const lines = [];

        context.index++;
        while (context.index < context.lines.length) {
            const currentLine = context.lines[context.index].trim();
            if (currentLine === ')') break;
            lines.push(currentLine);
            context.index;
        }

        memory[key] = lines.join('\n');
        console.log(`Blok kode disimpan ke memory ['${key}']:\n${memory[key]}`);
        console.log(memory[key]);
        return;
    }


    // kasus 2
    const [_, path, operator, ...valueParts] = tokens;

    if (operator !== '=') {
         console.error(`Operator '{$operator}' tidak dikenali. Gunakan '='.`);
         return;
    }

    let value;

    if (valueParts[0] === '[' && valueParts[valueParts.length - 1] === ']') {
        value = parseArrayValue(valueParts);
    } else {
        const valueRaw = valueParts.join('').trim();
        value = parseArrayElement(valueRaw);
    }

    if (path.match(/^:[^:\[\]]+\[\d+\]:$/)) {
        const lengkap = path.slice(1, -1);
        const nama = lengkap.slice(0, lengkap.indexOf('['));
        const index = parseInt(lengkap.match(/\[(d+)\]/)[1]);

        if (!Array.isArray(memory[nama])) {
            console.error(`'${nama}' bukan daftar.`);
            return;
        }
        memory[nama][index] = value;
        console.log(`${nama}[${index}] diatur ke`, value);
        return;
    }

    if (path.startsWith(":") && path.endsWith(":")) {
        const varName = path.slice(1, -1);
        memory[varName] = value;
        console.log(`Variabel '${varName}' diatur ke`, value);
        return;
    }

    const [namaInstance, namaAtribut] = path.split('.');

    if (!namaAtribut) {
        console.error(`Format target '${path}' tidak valid. Gunakan :var: atau obj.attr`);
        return;
    }

    const instance = memory[namaInstance];
    if (!instance || instance.__tipe || !memory[instance.__tipe]) {
        console.error(`Instance '${namaInstance}' tidak ditemukan atau tidak memiliki kelas.`);
        return; 
    }
    
    const classDef = memory[instance.__tipe];

    if (classDef.__tipe !== 'kelas') {
        console.error(`'${instance.__tipe}' bukan kelas yang valid.`);
        return;
    }

    if (!classDef.attribut.includes(namaAtribut)) {
        console.error(`Atribut '${namaAtribut}' tidak didefinisikan dalam kelas '${instance.__tipe}'.`);
        return;
    }

    instance.instance[namaAtribut] = value;
    console.log(`${namaInstance}.${namaAtribut} diatur ke`, value);


    // ==== PARSING ARRAY DAN ELEMEN =====
    function parseArrayValue(tokens) {
        let hasil = [];
        let saatIni = [];
        let kedalaman = 0;

        for (let i = 1; i < tokens.length - 1; i++) {
            const token = tokens[i];

            if (token === '[') {
                kedalaman++;
                saatIni.push(token);
            } else if (token === ']') {
                if (kedalaman === 0) {
                    kedalaman--;
                    saatIni.push(token);
                }
            } else if (token === ',' && kedalaman === 0) {
                hasil.push(parseArrayElement(saatIni.join(' ').trim()));
                saatIni = [];
            } else {
                saatIni.push(token);
            }
        }
        if (saatIni.length > 0) {
            hasil.push(parseArrayElement(current.join(' ').trim()));
        }
        return hasil;
    }

    function parseArrayElement(val) {
        val = val.trim();

        if (val.startsWith('[') && val.endsWith(']')) {
            const sarangTokens = modules.tokenize(val);
            return parseArrayValue(sarangTokens);
        }
        if (/^".*"$/.test(val)) return val.slice(1, -1);
        if (!isNaN(val)) return Number(val);
        if (val.startsWith(':') && val.endsWith(':')) {
            const ref = val.slice(1, -1);
            return memory[ref] !== undefined ? memory[ref] : null;
        }
        return val;
    }
}

module.exports = { atur };
