// modules/jika.js
const { memory } = require('../memory.js');

export function jika(tokens, modules) {
    const [ , varToken, operator, compareTo, keyword, cmd, ...args] = tokens;

    if (keyword !== 'maka') {
        console.error("Sintaks salah. Gunakan 'maka' setelah kondisi.");
        return;
    }

    const varName = varToken.replace(/:/g, '');
    const value1 = memory[varName];

    if (value1 === undefined) {
        console.error(`Variabel tidak ditemukan: ${varToken}`);
        return;
    }

    const value2 = compareTo.startsWith(':')
        ? memory[compareTo.replace(/:/g, '')]
        : isNaN(compareTo) ? compareTo.replace(/"/g, '') : Number(compareTo);

    let hasil = false;
    switch (operator) {
        case '==': hasil = value1 == value2; break;
        case '!=': hasil = value1 != value2; break;
        case '>': hasil = value1 > value2; break;
        case '<': hasil = value1 < value2; break;
        case '>=': hasil = value1 >= value2; break;
        case '<=': hasil = value1 <= value2; break;
        default:
            console.error(`Operator tidak dikenali: ${operator}`);
            return;
    }
    if (hasil) {
        if (modules[cmd]) {
            modules[cmd]([cmd, ...args], modules);
        } else {
            console.error("Perintah setelah 'maka' belum didukung" + cmd);
        }
    }
}

module.exports = { jika };
