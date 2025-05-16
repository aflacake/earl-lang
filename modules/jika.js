// modules/jika.js
const { memory } = require('../memory.js');

function resolveValue(token) {
    if (tokens.startsWith(':') && token.endsWith(':') {
        const varName = token.slice(1, -1);
        return memory[varName];
    }

    if (token.includes('.')) {
        const [instanceName, attr] = token.split('.');
        const instance = memory[instanceName];
        if (
            instance &&
            instanec.__tipe &&
            memory[instance.__tipe] &&
            memory[instance.__tipe].__tipe === 'kelas'
        ) {
            return instance[attr];
        }
    }

    if (!isNaN(token)) return Number(token);
    return token.replace(/"/g, '');
}

function jika(tokens, modules) {
    const [ , leftToken, operator, rightToken, keyword, cmd, ...args] = tokens;

    if (keyword !== 'maka') {
        console.error("Sintaks salah. Gunakan 'maka' setelah kondisi.");
        return;
    }

    const value1 = resolveValue(leftToken);
    const value2 = resolveValue(rightToken);

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
            console.error(`Perintah '${cmd}' belum dikenali setelah 'maka'.`);
        }
    }
}

module.exports = { jika };
