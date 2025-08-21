// modules/jikaLainnya.js

const { memory } = require('../memory.js');

async function jikaLainnya(tokens, modules, context) {
    const lines = context.lines;
    let i = context.index;

    if (context.kondisiTerpenuhi) {
        while (i < lines.length && lines[i].trim() !== 'selesai-jika') {
            i++;
        }
        context.index = i + 1;
        return;
    }

    while (i < lines.length) {
        const baris = lines[i].trim();
        const tokenBaris = baris.match(/"[^"]*"|\S+/g) || [];
        const kataKunci = tokenBaris[0];

        if (kataKunci === 'jika-lainnya' || kataKunci === 'lain') {
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
                        console.error(`Modul tidak dikenali di dalam blok '${kataKunci}':`, cmd);
                    }
                }
                i++;
            }
            break;
        } else if (kataKunci === 'selesai-jika') {
            break;
        }

        i++;
    }

    context.index = i + 1;
}

module.exports = { jikaLainnya };
