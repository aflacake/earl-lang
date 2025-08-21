// modules/jika.js

const { resolveToken } = require('./tampilkan');

async function jika(tokens, modules, context) {
    if (tokens.length < 5) {
        console.error("Sintaks tidak lengkap. Gunakan format: jika <kiri> <operator> <kanan> maka");
        return;
    }

    if (context.kondisiTerpenuhi) {
        return;
    }

    const [ , leftToken, operator, rightToken, keyword] = tokens;

    if (keyword !== 'maka') {
        console.error("Sintaks salah. Gunakan 'maka' setelah kondisi.");
        return;
    }

    const value1 = resolveToken(leftToken, context, modules);
    const value2 = resolveToken(rightToken, context, modules);

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
        context.kondisiTerpenuhi = true;

        if (context.currentNode.body && context.currentNode.body.length > 0) {
            await modules.laksanakanAST(context.currentNode.body, modules, context);
        } else {
            console.error(`Perintah 'maka' kosong atau tidak ditemukan.`);
        }
    }
}

jika.isBlock = true;

module.exports = { jika };


