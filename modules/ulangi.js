const { memory } = require('../memory.js');

async function ulangi(tokens, modules, context) {
    const lines = [];

    if (tokens[1] === 'setiap' && tokens[2] === 'dari') {
        const sumber = tokens[3];
        let list;

        if (sumber.includes('.')) {
            const [instanceName, attr] = sumber.split('.');
            const instance = memory[instanceName];

            if (!instance || !instance.__tipe || !memory[instance.__tipe] || memory[instance.__tipe].__tipe !== 'kelas') {
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
            list = memory[varName];
        } else {
            list = memory[sumber];
        }

        if (!Array.isArray(list)) {
            console.error(`Sumber ${sumber} bukan array.`);
            return;
        }

        // Ambil blok baris di dalam ulangi
        context.index++;
        while (context.index < context.lines.length) {
            const line = context.lines[context.index].trim();
            if (line === 'selesai') break;
            lines.push(line);
            context.index++;
        }

        for (const item of list) {
            memory['item'] = item;

            for (const baris of lines) {
                const innerTokens = modules.tokenize(baris);
                const cmd = innerTokens[0];

                if (modules[cmd]) {
                    await modules[cmd](innerTokens, modules, context);
                } else {
                    console.error("Modul tidak dikenali di dalam blok ulangi:", cmd);
                }
            }
        }

    } else {
        let countToken = tokens[1];
        let count = 0;

        if (countToken.startsWith(':') && countToken.endsWith(':')) {
            const varName = countToken.slice(1, -1);
            count = parseInt(memory[varName]);
        } else {
            count = parseInt(countToken);
        }

        if (isNaN(count)) {
            console.error("Jumlah perulangan tidak valid: " + countToken);
            return;
        }

        // Ambil blok baris di dalam ulangi
        context.index++;
        while (context.index < context.lines.length) {
            const line = context.lines[context.index].trim();
            if (line === 'selesai') break;
            lines.push(line);
            context.index++;
        }

        for (let i = 0; i < count; i++) {
            memory['index'] = i;
            for (const baris of lines) {
                const innerTokens = modules.tokenize(baris);
                const cmd = innerTokens[0];

                if (modules[cmd]) {
                    await modules[cmd](innerTokens, modules, context);
                } else {
                    console.error("Modul tidak dikenali di dalam blok ulangi: ", cmd);
                }
            }
        }
    }
}

module.exports = { ulangi };
