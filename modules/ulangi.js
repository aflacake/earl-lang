// modules/ulangi.js

const { resolveToken } = require('./tampilkan');
const { validasiNumerik } = require('../utili');
const { laksanakanAST } = require('../pelaksana-ast');

async function ulangi(tokens, modules, context) {
    if (tokens[1] === 'setiap' && tokens[2] === 'dari') {
        let sumberToken = tokens[3];
        if (sumberToken.startsWith(':') && sumberToken.endsWith(':')) {
            sumberToken = sumberToken.slice(1, -1);
        }

        const list = resolveToken(tokens[3], context, modules);

        if (!Array.isArray(list)) {
            console.error(`Sumber '${sumberToken}' bukan daftar atau array.`);
            return;
        }

        for (const item of list) {
            if (typeof item === 'number' && !validasiNumerik(item)) {
                console.error(`Item perulangan mengandung angka tidak valid (underflow atau overflow): ${item}`);
                return;
            }

            context.lingkup.push({ item });
            context.berhenti = false;
            context.lanjutkan = false;

            if (context.currentNode?.body) {
                await laksanakanAST(context.currentNode.body, modules, context);
            }

            context.lingkup.pop();

            if (context.berhenti) break;
            if (context.lanjutkan) continue;
        }
    } else {
        const jumlahRaw = resolveToken(tokens[1], context, modules);
        const jumlah = parseInt(jumlahRaw);

        if (isNaN(jumlah)) {
            console.error(`Nilai perulangan tidak valid: ${tokens[1]}`);
            return;
        }

        if (!validasiNumerik(jumlah, 0)) {
            console.error(`Nilai perulangan berada di luar batas yang diizinkan (underflow atau overflow): ${jumlah}`);
            return;
        }

        for (let i = 0; i < jumlah; i++) {
            context.lingkup.push({ index: i });
            context.berhenti = false;
            context.lanjutkan = false;

            if (context.currentNode?.body) {
                await laksanakanAST(context.currentNode.body, modules, context);
            }

            context.lingkup.pop();

            if (context.berhenti) break;
            if (context.lanjutkan) continue;
        }
    }
}

ulangi.isBlock = true;
module.exports = { ulangi };
