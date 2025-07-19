// modules/langkah.js

async function langkah(tokens, modules, context) {
    const lines = context.lines.slice(context.index + 1);
    let index = 0;

    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    console.log('Masuk ke mode langkah demi langkah. Ketik ENTER untuk lanjut, "berakhir" untuk keluar.');

    while (index < lines.length) {
        const line = lines[index].trim();

        if (line === '' || line.startsWith('--')) {
            index++;
            continue;
        }

        const tokens = modules.tokenize(line);
        const cmd = tokens[0];

        if (modules[cmd]) {
            console.log(`\nBaris ${context.index + index + 1}: ${line}`);
            await new Promise(resolve => rl.question('> ', input => {
                if (input.trim() === 'berakhir') {
                    rl.close();
                    index = lines.length;
                    resolve();
                } else {
                    resolve();
                }
            }));

            for (let i = 1; i < tokens.length; i++) {
                tokens[i] = await modules.resolveToken(tokens[i], context);
            }

            await modules[cmd](tokens, modules, context);
        }
        index++;
    }

    rl.close();
    context.index += index;
}

module.exports = { langkah };
