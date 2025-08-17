// modules/ulangi.js

const { resolveToken } = require('./tampilkan');
const { validasiNumerik } = require('../utili');
const { laksanakanAST } = require('../pelaksana-ast');

async function ulangi(tokens, modules, context) {
    if (tokens[1] === 'setiap' && tokens[2] === 'dari') {
        const sumberToken = tokens[3];
        const list = resolveToken(sumberToken, context, modules);

        if (!Array.isArray(list)) {
            console.error(`Sumber '${sumberToken}' bukan daftar atau array.`);
            return;
        }

        const bodySalinan = JSON.parse(JSON.stringify(context.currentNode?.body));

        for (const barang of list) {
            if (typeof barang === 'number' && !validasiNumerik(barang)) {
                console.error(`Item perulangan mengandung angka tidak valid (underflow atau overflow): ${barang}`);
                return;
            }

            context.lingkup.push({ barang });
            context.berhenti = false;
            context.lanjutkan = false;

            if (bodySalinan) {
                await laksanakanAST(bodySalinan, modules, context);
            }

            context.lingkup.pop();

            if (context.berhenti) break;
            if (context.lanjutkan) continue;
        }
    } else {
        const jumlahRaw = resolveToken(tokens[1], context, modules);
        const jumlah = Number(jumlahRaw);

        if (!Number.isInteger(jumlah)) {
            console.error(`Nilai perulangan tidak valid: '${jumlahRaw}'`);
            return;
        }

        if (!validasiNumerik(jumlah, 0)) {
            console.error(`Nilai perulangan berada di luar batas (underflow atau overflow): ${jumlah}`);
            return;
        }

        const bodySalinan = JSON.parse(JSON.stringify(context.currentNode?.body));

        for (let i = 0; i < jumlah; i++) {
            context.lingkup.push({ index: i });

            context.berhenti = false;
            context.lanjutkan = false;

            if (bodySalinan) {
                await laksanakanAST(bodySalinan, modules, context);
            }

            context.lingkup.pop();

            if (context.berhenti) break;
            if (context.lanjutkan) continue;
        }
    }
}

ulangi.isBlock = true;
module.exports = { ulangi };
