// modules/ulangi.js

const { resolveToken } = require('./tampilkan');
const { laksanakanAST } = require('../pelaksana-ast');
const { validasiNumerik } = require('../utili');

async function ulangi(tokens, modules, context) {
    if (tokens[1] === 'setiap' && tokens[2] === 'dari') {
        let sumber = tokens[3];
        if (sumber.startsWith(':') && sumber.endsWith(':')) {
            sumber = sumber.slice(1, -1);
        }
        const list = resolveToken(sumber, context, modules);

        if (!Array.isArray(list)) {
            console.error(`Sumber '${sumber}' bukan daftar atau array.`);
            return;
        }

        for (const item of list) {
            if (typeof item === 'number') {
                try {
                    if (!validasiNumerik(item)) {
                        console.error(`Item perulangan mengandung angka tidak valid (underflow/overflow): ${item}`);
                        return;
                    }
                } catch (err) {
                    console.error(`Item perulangan bukan angka yang valid: ${item}`);
                    return;
                }
            }
        }

        for (const item of list) {
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
        let count;
        try {
            count = parseInt(resolveToken(tokens[1], context, modules));
            if (isNaN(count)) throw new Error();
        } catch {
            console.error(`Nilai perulangan tidak valid: ${tokens[1]}`);
            return;
        }

        try {
            if (!validasiNumerik(count)) {
                console.error(`Nilai perulangan berada di luar batas yang diizinkan (underflow atau overflow): ${count}`);
                return;
            }
        } catch (err) {
            console.error(`Nilai perulangan bukan angka yang valid: ${count}`);
            return;
        }

        for (let i = 0; i < count; i++) {
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
