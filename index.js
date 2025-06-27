// index.js

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { memory } = require('./memory');

const { tokenize } = require('./tokenize');

const modules = { memory, tokenize };

const modulesPath = path.join(__dirname, 'modules');
fs.readdirSync(modulesPath).forEach(file => {
    if (file.endsWith('.js')) {
        const mod = require(`./modules/${file}`);
        for (const [key, value] of Object.entries(mod)) {
            if (modules[key]) {
                console.warn(`Peringatan: Modul '${file}' mencoba menimpa '${key}' yang sudah ada di modul lain.`);
            } else {
                modules[key] = value;
            }
        }
        console.log(`Modul dimuat: ${file}`);
    }
});

function bantuan() {
    console.log('Daftar perintah yang tersedia:');
    const cmds = Object.keys(modules)
        .filter(k => k !== 'memory' && k !== 'tokenize')
        .sort();
    cmds.forEach(cmd => console.log(`- ${$cmd}`));
    console.log("Ketik 'keluar' untuk keluar dari mode REPL.");
}

async function runEarl(code, customModules = modules, parentContext) {
    const lines = code.trim().split('\n');
    const context = parentContext ?? { index: 0, lines, lingkup: [{}] };

    if (!parentContext) context.lines = lines;

    while (context.index < context.lines.length) {
        const line = context.lines[context.index].trim();

        const tokens = customModules.tokenize(line);
        if (!tokens || tokens.length === 0) {
            context.index++;
            continue;
        }

        const cmd = tokens[0];

        if (customModules[cmd]) {
            const handler = customModules[cmd];

            if (handler.isBlock) {
                let blockLines = [];
                context.index++;

                while (context.index < context.lines.length) {
                    const nextLine = context.lines[context.index].trim();
                    if (nextLine === 'selesai') break;
                    blockLines.push(context.lines[context.index]);
                    context.index++;
                }
                context.index++;
                await handler(tokens, customModules, { ...context, lines: blockLines, index: 0 });
            } else {
                try {
                    await handler[cmd](tokens, modules, context);
                } catch (err) {
                    console.error(`Kesalahan saat menjalankan perintah '${cmd}' di baris ${context.index + 1}:`, err.message);
                }
                context.index++;
            }
        } else {
            console.error(`Modul tidak dikenali: '${cmd}' di baris ${context.index + 1}`);
            context.index++;
        }
    }
}

const args = process.argv.slice(2);

if (args.length > 0) {
    const filename = args[0];
    if (!filename.endsWith('.earl')) {
        console.error("Hanya file dengan ekstensi .earl yang dapat dijalankan.");
        process.exit(1);
    }

    if (fs.existsSync(filename)) {
        const kode = fs.readFileSync(filename, 'utf8');
        runEarl(kode, modules);
    } else {
        console.error(`File '${filename}' tidak ditemukan.`);
    }
} else {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: 'earl>'
    });

    console.log("Earl REPL Mode - ketik 'keluar' untuk keluar dan ketik 'bantuan' untuk melihat daftar perintah");

    rl.prompt();

    rl.on('line', async (line) => {
        const input = line.trim();

        if (line.trim() === 'keluar') {
            rl.close();
            return;
        }

        if (input === 'bantuan') {
            bantuan();
            rl.prompt();
            return;
        }

        try {
            await runEarl(input, modules);
        } catch (err) {
            console.error('Kesalahan', err.message);
        }

        rl.prompt();
    });

    rl.on('close', () => {
        console.log('Keluar!');
        process.exit(0);
    });
}


module.exports = { runEarl };
