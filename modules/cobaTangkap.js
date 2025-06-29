// modules/cobaTangkap.js

async function cobaTangkap(tokens, modules, context) {
    if (tokens.length < 2 || tokens[1] !== '(') {
        console.error("Sintaks 'cobaTangkap' harus diikuti blok kode dalam tanda kurung '(' dan ')'");
        return;
    }

    const lines = [];
    context.index++;
    let kedalaman = 1;

    while (context.index < context.lines.length) {
        const line = context.lines[context.index].trim();

        if (line === '(') {
            kedalaman++;
        } else if (line === ')') {
            kedalaman--;
            if (kedalaman === 0) break;
        }
        lines.push(line);
        context.index++;
    }

    if (kedalaman !== 0) {
        console.error("Blok kode 'cobaTangkap' tidak ditutup dengan benar ')'");
        return;
    }

    context.index++;

    const localContext = {
        index: 0,
        lines: [...lines],
        lingkup: [...context.lingkup],
        return: null,
        stopExecution: false,
    };

    try {
        while (localContext.index < localContext.lines.length) {
            const line = localContext.lines[localContext.index].trim();
            const innerTokens = modules.tokenize(line);

            if (!innerTokens || innerTokens.length === 0) {
                localContext.index++;
                continue;
            }

            const cmd = innerTokens[0];

            if (modules[cmd]) {
                await modules[cmd](innerTokens, modules, localContext);
            } else {
                console.error(`Perintah '${cmd}' tidak dikenali di dalam 'cobaTangkap'.`);
            }

            if (localContext.stopExecution) break;

            localContext.index++;
        }
    } catch (err) {
        console.error(`Error tertangkap dalam 'cobaTangkap': ${err.message}`);
    }
}

module.exports = { cobaTangkap };
