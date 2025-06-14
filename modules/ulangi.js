// modules/ulangi.js

function ambilBlok(context) {
    const lines = [];
    context.index++;
    while (context.index < context.lines.length) {
        const line = context.lines[context.index].trim();
        if (line === 'selesai') {
            context.index++;
            break;
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
        let list;

        if (sumber.includes('.')) {
            const [instanceName, attr] = sumber.split('.');
            const instance = context.lingkup[0][instanceName];

            if (
                !instance ||
                !instance.__tipe ||
                !context.lingkup[0][instance.__tipe] ||
                context.lingkup[0][instance.__tipe].__tipe !== 'kelas'
            ) {
                console.error(`'${instanceName}' bukan instance yang valid.`);
                return;
            }

            if (!(attr in instance)) {
                console.error(`Atribut '${attr}' tidak ditemukan di '${instanceName}'.`);
                return;
            }

            list = instance[attr];
        } else if (sumber.startsWith(':') && sumber.endsWith(':')) {
            const varName = sumber.slice(1, -1);
            if (!(varName in context.lingkup[0])) {
                console.error(`Variabel '${varName}' tidak ditemukan.`);
                return;
            }
            list = context.lingkup[0][varName];
        } else {
            if (!(sumber in context.lingkup[0])) {
                console.error(`Variabel '${sumber}' tidak ditemukan.`)
                return;
            }
            list = context.lingkup[0][sumber];
        }

        if (!Array.isArray(list)) {
            console.error(`Sumber ${sumber} bukan array.`);
            return;
        }

        for (const item of list) {
            context.lingkup.push({item});

            context.berhenti = false;
            context.lanjutkan = false;

            for (const baris of lines) {
                const innerTokens = modules.tokenize(baris);
                if (innerTokens && innerTokens.length > 0) {
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
                        console.error("Modul tidak dikenali di dalam blok ulangi:", cmd);
                    }
                }
            }
            context.lingkup.pop();

            if (context.berhenti) break;
            if (context.lanjutkan) continue;
        }

    } else {
        let countToken = tokens[1];
        let count = 0;

        if (countToken.startsWith(':') && countToken.endsWith(':')) {
            const varName = countToken.slice(1, -1);
            if (!(varName in context.lingkup[0])) {
                console.error(`Variabel '${varName}' tidak ditemukan.`);
                return;
            }
            count = parseInt(context.lingkup[0][varName]);
        } else {
            count = parseInt(countToken);
        }

        if (isNaN(count)) {
            console.error("Jumlah perulangan tidak valid: " + countToken);
            return;
        }

        for (let i = 0; i < count; i++) {
            context.lingkup.push({ index: i });

            context.berhenti = false;
            context.lanjutkan = false;

            for (const baris of lines) {
                const innerTokens = modules.tokenize(baris);
                if (innerTokens && innerTokens.length > 0) {
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
                        console.error("Modul tidak dikenali di dalam blok ulangi:", cmd);
                    }
                }
            }
            context.lingkup.pop();

            if (context.berhenti) break;
            if (context.lanjutkan) continue;
        }
    }
}

module.exports = { ulangi };
