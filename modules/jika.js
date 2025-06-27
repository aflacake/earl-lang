// modules/jika.js
const { memory } = require('../memory.js');
const { resolveToken } = require('./tampilkan');

function resolveValueDenganKelas(token) {
    const hasil = resolveToken(token);

    if (typeof hasil === 'string' && token.includes('.')) {
       const [instanceName, attr] = token.split('.');
       const instance = memory[instanceName];

       if (
           instance &&
           instance.__tipe &&
           memory[instance.__tipe] &&
           memory[instance.__tipe].__tipe === 'kelas'
       ) {
           return instance[attr];
       }
    }
    return hasil;
}

async function jika(tokens, modules, context) {
    if (tokens.length < 6) {
        console.error("Sintaks tidak lengkap. Gunakan format: jika <kiri> <operator> <kanan> maka <perintah> [argumen]");
        return;
    }

    const [ , leftToken, operator, rightToken, keyword, cmd, ...args] = tokens;

    if (keyword !== 'maka') {
        console.error("Sintaks salah. Gunakan 'maka' setelah kondisi.");
        return;
    }

    const value1 = resolveValueDenganKelas(leftToken);
    const value2 = resolveValueDenganKelas(rightToken);

    let hasil = false;

    switch (operator) {
        case '==': hasil = value1 === value2; break;
        case '!=': hasil = value1 !== value2; break;
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
            try {
                await modules[cmd]([cmd, ...args], modules, context);
            } catch (err) {
                console.error(`Gagal menjalankan '${cmd}':`, err);
            }
        } else {
            console.error(`Perintah '${cmd}' belum dikenali setelah 'maka'.`);
        }
    }
}

jika.isBlock = true;
module.exports = { jika };
