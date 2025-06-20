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

    let valueTokens = [...valueParts];

    if (
        (valueTokens[0] === '(' && valueTokens[valueTokens.length - 1] !== ')') ||
        (valueTokens[0] === '[' && valueTokens[valueTokens.length - 1] !== ']')
    ) {
        const pembuka = valueTokens[0];
        const penutup = pembuka === '(' ? ')': ']';

        context.index++;

        while (context.index < context.lines.length) {
            const line = content.lines[content.index].trim();
            valueTokens.push(...modules.tokenize(line));
            if (line === penutup) break;
            context.index;
        }
    }

    if (operator !== '=') {
         console.error(`Operator '{$operator}' tidak dikenali. Gunakan '='.`);
         return;
    }

    let value;

    if (valueTokens[0] === '[' && valueTokens[valueTokens.length - 1] === ']') {
        value = parseArrayValue(valueTokens);
    } else if (valueToken[0] === '(' && valueTokens[valueTokens.length - 1] === ')') {
       value = parseObjekValue(valueTokens);
    } else {
        const valueRaw = valueTokens.join('').trim();
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
        
        let disimpan = false;

        if (context.lingkup && context.lingkup.length > 0) {
            for (let i = context.lingkup.length - 1; i >= 0; i--) {
                if (varName in context.lingkup[i]) {
                    context.lingkup[i][varName] = value;
                    disimpan = true;
                    break;
                }
            }

            if (!disimpan) {
                context.lingkup[context.lingkup.length - 1][varName] = value;
                disimpan = true;
            }
        }
            
        if (!disimpan) {
            memory[varName] = value;
        }
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
        let terakhirKoma = false;

        for (let i = 1; i < tokens.length - 1; i++) {
            const token = tokens[i];

            if (token === '[') {
                kedalaman++;
                saatIni.push(token);
                terakhirKoma = false;
            } else if (token === ']') {
                if (kedalaman > 0) {
                    kedalaman--;
                    saatIni.push(token);
                } else {
                    console.error("Kurung tutup tidak seimbang di array.");
                    return null;
                }
                terakhirKoma = false;
            } else if (token === ',' && kedalaman === 0) {
                if (terakhirKoma) {
                    console.error("Koma ganda tidak diizinkan dalam array.");
                    return null;
                }
                hasil.push(parseArrayElement(saatIni.join(' ').trim()));
                saatIni = [];
            } else {
                saatIni.push(token);
                terakhirKoma = false;
            }
        }
        if (saatIni.length > 0) {
            hasil.push(parseArrayElement(current.join(' ').trim()));
        }
        return hasil;
    }

    function parseArrayElement(val) {
        val = val.trim();

        if ((val.startsWith('"') && !val.endsWith('"')) || (!val.startsWith('"') && val.endsWith('"'))) {
            console.error(`String tidak ditutup dengan benar: ${val}`);
            return null;
        }

        if (val.startsWith('(') && val.endsWith(')')) {
            const objTokens = modules.tokenize(val);
            return parseObjekValue(objTokens);
        }

        if (val.startsWith('[') && val.endsWith(']')) {
            const sarangTokens = modules.tokenize(val);
            return parseArrayValue(sarangTokens);
        }

        if (/^".*"$/.test(val)) return val.slice(1, -1);
        if (!isNaN(val)) return Number(val);
        if (val.startsWith(':') && val.endsWith(':')) {
            const ref = val.slice(1, -1);
            if (!(ref in memory)) {
                console.error(`Referensi variabel ':${ref}:' tidak ditemukan.`);
                return null;
            }
            return memory[ref];
        }
        return val;
    }

    function parseObjekValue(tokens) {
        let hasil = {};
        let i = 1;
        let kunci = '';
        let valueTokens = [];
        let sedangKumpul = false;
        let kedalaman = 0;

        while (i < tokens.length - 1) {
            const token = tokens[i];

            if (!sedangKumpul) {
                const parts = token.split(':');
                if (parts.length === 2) {
                    kunci = parts[0].trim();
                    valueTokens = [parts[1].trim()];
                    sedangKumpul = true;
                } else if (parts.length === 1) {
                    kunci = parts[0].trim();
                    if (tokens[i + 1] === ':') {
                        i++;
                        sedangKumpul = true;
                        valueTokens = [];
                    } else {
                        console.error('Format objek salah, kunci tanpa ":"');
                        return null;
                    }
                }
            } else {
                if (token === ',' && kedalaman === 0) {
                    hasil[key] = parseArrayElement(valueTokens.join(' ').trim());
                    sedangKumpul = false;
                    kunci = '';
                    valueTokens = [];
                } else {
                    if (token === '[' || token === '(') kedalaman++;
                    if (token === ']' || token === ')') kedalaman--;
                    valueTokens.push(token);
                }
            }
            i++;
        }
        if (kunci && valueTokens.length) {
            hasil[kunci] = parseArrayElement(valueTokens.join(' ').trim());
        }
        return hasil;
    }
}

module.exports = { atur };
