// modules/atur.js

import { memory } from '../memory.js';

export function atur(tokens) {
    const [_, path, operator, ...valueParts] = tokens;

    if (operator !== '=') {
         console.error(`Operator '{$operator}' tidak dikenali. Gunakan '='.`);
         return;
    }

    const [namaInstance, namaAtribut] = path.split('.');

    if (!memory[namaInstance]) {
        console.error(`Instace '${namaInstance}' tidak ditemukan.`);
        return;
    }

    const instance = memory[namaInstance];
    if (!instance.hasOwnProperty(namaAtribut)) {
        console.error(`Atribut '${namaAtribut}' tidak ada dalam '${namaInstance}'.`);
        return;
    }

    let valueRaw = valueParts.join(' ');
    let value;

    if (/^".*"$/.test(valueRaw)) {
        value = valueRaw.slice(1, -1);
    } else if (!isNaN(valueRaw)) {
        value = Number(valueRaw);
    } else if (memory[valueRaw] !== undefined) {
        value = memory[valueRaw];
    } else {
        value = valueRaw;
    }

    instance[namaAtribut] = value;
    console.log(`${namaInstance}.${namaAtribut} diatur ke`, value);
}
