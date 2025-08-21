// modules/jikaLainnya.js

const { memory } = require('../memory.js');

async function jikaLainnya(tokens, modules, context) {
    const lines = context.lines;
    let i = context.index;

    while (i < lines.length) {
        const baris = lines[i].trim();
        const tokenBaris = baris.match(/"[^"]*"|\S+/g) || [];

        if (tokenBaris.length === 0) {
            i++;
            continue;
        }

        const kataKunci = tokenBaris[0];

        if ((kataKunci === 'jika' || kataKunci === 'jika-lainnya' || kataKunci === 'lain') && context.kondisiTerpenuhi) {
            while (i < lines.length && lines[i].trim() !== 'selesai-jika') {
                i++;
            }
            if (i < lines.length) i++;
            break;
        }

        if (kataKunci === 'jika') {
            context.kondisiTerpenuhi = false;
            i++;
            while (i < lines.length) {
                const ln = lines[i].trim();
                if (ln.startsWith('jika-lainnya') || ln === 'lain' || ln === 'selesai-jika') break;

                const innerTokens = modules.tokenize(ln);
                if (innerTokens && innerTokens.length > 0) {
                    const cmd = innerTokens[0];
                    if (modules[cmd]) {
                        await modules[cmd](innerTokens, modules, context);
                    } else {
                        console.error("Modul tidak dikenali di dalam blok jika-lainnya:", cmd);
                    }
                }
                i++;
            }
        } else if (kataKunci === 'jika-lainnya') {
            i++;
            while (i < lines.length) {
                const ln = lines[i].trim();
                if (ln === 'lain' || ln === 'selesai-jika') break;

                const innerTokens = modules.tokenize(ln);
                if (innerTokens && innerTokens.length > 0) {
                    const cmd = innerTokens[0];
                    if (modules[cmd]) {
                        await modules[cmd](innerTokens, modules, context);
                    } else {
                        console.error("Modul tidak dikenali di dalam blok jika-lainnya:", cmd);
                    }
                }
                i++;
            }
        } else if (kataKunci === 'lain') {
            i++;
            while (i < lines.length) {
                const ln = lines[i].trim();
                if (ln === 'selesai-jika') break;

                const innerTokens = modules.tokenize(ln);
                if (innerTokens && innerTokens.length > 0) {
                    const cmd = innerTokens[0];
                    if (modules[cmd]) {
                        await modules[cmd](innerTokens, modules, context);
                    } else {
                        console.error("Modul tidak dikenali di dalam blok jika-lainnya:", cmd);
                    }
                }
                i++;
            }
        } else if (kataKunci === 'selesai-jika') {
            context.index = i + 1;
            return;
        } else {
            i++;
        }
    }
    context.index = i;
}

module.exports = { jikaLainnya };
