// modules/ulangi.js

const { memory } = require('../memory.js');

function ulangi(tokens, modules, context) {
    const lines = [];

    if (tokens[1] === 'setiap' && tokens[2] === 'dari') {
        const varName = tokens[3].slice(1, -1);
        const list = memory[varName];

        if (!Array.isArray(list)) {
            console.log(`Variabel ${varName} bukan array`);
            return;
        }

    context.index++;
    while (context.index < context.lines.length) {
        const line = context.lines[context.index].trim();
        if (line === 'selesai') break;
        lines.push(line);
        context.index++;
    }

    for (const item of list) {
        memory[varName] = item;

        for (const baris of lines) {
            const innerTokens = module.tokenize(baris);
            const cmd = innerTokens[0];

            if (modules[cmd]) {
                modules[cmd](innerTokens, modules, context);
            } else {
                console.error("Modul tidak dikenali di dalam blok ulangi:" + cmd);
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

         context.index++;
         while (context.index < context.lines.length) {
            const line = context.lines[context.index].trim();
             if (line === 'selesai') break;
            lines.push(line);
            context.index++;
        }

        for (let i = 0; i < count; i++) {
             for (const line of lines) {
                 const innerTokens = modules.tokenize(line);
                 const cmd = innerTokens[0];
                  if (modules[cmd]) {
                    modules[cmd](innerTokens, modules, context);
                } else {
                    console.error("Modul tidak dikenali di dalam blok ulangi: " + cmd)
                }
            }
        }
    }
}

module.exports = { ulangi };
