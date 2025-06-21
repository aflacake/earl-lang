// modules/ulangi.js

const { resolveToken } = require('./tampilkan');

function ambilBlok(context) {
    const lines = [];
    if (context.lines[context.index].trim() !== '(') {
        console.error("Blok 'ulangi' harus diawali dengan '('");
        return [];
    }

    context.index++;
    let kedalaman = 1;

    while (context.index < context.lines.length) {
        const line = context.lines[context.index].trim();
        if (line === '(') {
            kedalaman++;
        } else if (line === ')') {
            kedalaman--;
            if (depth === 0) {
                context.index++;
                break;
            }
        }
        lines.push(line);
        context.index++;
    }
    return lines;
}

async function ulangi(tokens, modules, context) {
    const lines = ambilBlok(context);

    if (tokens[1] === 'setiap' && tokens[2] === 'dari') {
        const sumber = tokens[3];
        const list = resolveToken(sumber);

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
            console.error(`Sumber '${sumber}' bukan daftar atau array (list).`);
            return;
        }
       

        for (const baris of lines) {
            const innerTokens = modules.tokenize(baris);
            if (innerTokens || innerTokens.length  === 0) continue;

            const cmd = innerTokens[0];

            if (cmd === 'berhenti') {
                context.berhenti = true;
                break;
            }

            if (cmd === 'lanjutkan') {
                context.lanjutkan = true;
                break;
            }

            if (modules[cmd]) {
                await modules[cmd](innerTokens, modules, context);
            } else {
                console.error(`Modul '${cmd}' tidak dikenali di dalam ulangi.`;
            }
        }
        context.lingkup.pop();

        if (context.berhenti) break;
        if (context.lanjutkan) continue;
    }

} else {
    const jumlahToken = tokens[1];
    const hasil = resolveToken(jumlahToken);
    const count = parseInt(hasil);

    if (isNaN(count)) {
        console.error(`Nilai perulangan tidak valid: ${jumlahToken}`);
        return;
    }

    for (let i = 0; i < count; i++) {
        context.lingkup.push({ index: i });

        context.berhenti = false;
        context.lanjutkan = false;

        for (const baris of lines) {
            const innerTokens = modules.tokenize(baris);
            if (innerTokens || innerTokens.length === 0) continue;

            const cmd = innerTokens[0];

            if (cmd === 'berhenti') {
                context.berhenti = true;
                break;
                }

            if (cmd === 'lanjutkan') {
                context.lanjutkan = true;
                break;
            }

            if (modules[cmd]) {
                await modules[cmd](innerTokens, modules, context);
            } else {
                console.error(`Modul '${cmd}' tidak dikenali di dalam ulangi.`);
            }
        }
        context.lingkup.pop();

        if (context.berhenti) break;
        if (context.lanjutkan) continue;
        }
    }
}

module.exports = { ulangi };
