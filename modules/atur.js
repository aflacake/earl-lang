// modules/atur.js

const { memory } = require('../memory.js');

async function atur(tokens, modules, context) {

    // kasus 1
    const line = context.lines[context.index].trim();
    if (tokens.length >= 2 && tokens[1].startsWith(':') && tokens[1].endsWith(':') && line.endsWith('(')) {
        const key = tokens[1].slice(1, -1);
        const lines = [];

        context.index++;
        while (context.index < context.line.length) {
            const currentLine = context.lines[context.index].trim();
            if (currentLine === ')') break;
            lines.push(currentLine);
            context.index;
        }

        memory[key] = lines.join('\n');
        console.log(`Blok kode disimpan ke memory ['${key}']:`);
        console.log(memory[key]);
        return;
    }


    // kasus 2
    const [_, path, operator, ...valueParts] = tokens;

    if (operator !== '=') {
         console.error(`Operator '{$operator}' tidak dikenali. Gunakan '='.`);
         return;
    }

    let valueRaw = valueParts.join('').trim();
    let value;

    if (/^".*"$/.test(valueRaw)) {
        value = valueRaw.slice(1, -1);
    } else if (isNaN(valueRaw)) {
        value = Number(valueRaw);
    } else if (valueRaw.startsWith(":") && valueRaw.endsWith(":")) {
        const varName = valueRaw.slice(1, -1);
        value = memory[varName];
    } else if (memory[valueRaw] !== undefined) {
        value = memory[valueRaw];
    } else {
        value = valueRaw;
    }

    if (path.startsWith(":") && path.endsWith(":")) {
        const varName = path.slice(1, -1);
        memory[varName] = value;
        console.log(`Variabel '${varName}' diatur ke`, value);
        return;
    }

    const [namaInstance, namaAtribut] = path.split('.');

    if (!namaAtribut) {
        console.error(`Format target '${path}' tidak valid. Gunakan :var: atau instance.atribut`);
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
        console.error(`Atribut '${namaAtribut}' tidak didefinisikan dalam kelas '${instance.__tipe}'.`)
    }

    instance.instance[namaAtribut] = value;
    console.log(`${namaInstance}.${namaAtribut} diatur ke`, value);
}

module.exports = { atur };
