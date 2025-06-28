// modules/langkah.js

async function langkah (tokens, modules, context) {
    const lines = context.lines.slice(context.index + 1);
    let index = 0;

    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    console.log('Masuk ke mode langkah demi langkah. Ketik ENTER untuk lanjut, "selesai" untuk keluar.');

    while (index < lines.length) {
        const line = lines[index].trim();

        if (line === '' || line.startsWith('--')) {
            index++;
            continue;
        }
        const tokens = modules.tokenize(line);
        const cmd = tokens[0];

        if (modules[cmd]) {
            console.log(`\n Baris ${context.index + index + 1}: ${line}`);
            await new Promise(resolve => rl.question('> ', input => {
                if (input.trim() === 'selesai') {
                    rl.close();
                    index = lines.length;
                    resolve();
                } else {
                    resolve();
                }
            }));
            await modules[cmd](tokens, modules, context);
        }
        index++;
    }
    rl.close();
    context.index += index;
}

module.exports = { langkah };
