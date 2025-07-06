// modules/ulangi.js

const { resolveToken } = require('./tampilkan');
const { laksanakanAST } = require('../pelaksana-ast');

async function ulangi(tokens, modules, context) {
    if (tokens[1] === 'setiap' && tokens[2] === 'dari') {
        const sumber = tokens[3];
        const list = resolveToken(sumber, context, modules);
        console.log(context.lingkup);
        console.log(list);
        console.log(list, Array.isArray(list));

        if (sumber.includes('.')) {
            const [instanceName, attr] = sumber.split('.');
            const instance = context.lingkup[0][instanceName];

            if (instance && instance.__tipe) {
                const kelas = context.lingkup[0][instance.__tipe];
                if (!kelas || kelas.__tipe !== 'kelas') {
                    console.error(`Tipe '${instance.__tipe}' bukan kelas yang valid.`);
                    return;
                }
            }
        }
            
        if (!Array.isArray(list)) {
            console.error(`Sumber '${sumber}' bukan daftar atau array.`);
            return;
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
        const count = parseInt(resolveToken(tokens[1], context, modules));

        if (isNaN(count)) {
            console.error(`Nilai perulangan tidak valid: ${tokens[1]}`);
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
