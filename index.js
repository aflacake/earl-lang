// index.js

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { memory } = require('./memory');
const { laksanakanAST } = require('./pelaksana-ast');

const { tokenize } = require('./tokenize');
const { tokenizekedua } = require('./utili');

function pilihTokenizer(line) {
    if (line.includes('"')) return tokenizekedua(line);
    return tokenize(line);
}

const modules = { 
    memory,
    tokenize: pilihTokenizer,
    laksanakanAST
};

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
    cmds.forEach(cmd => console.log(`- ${cmd}`));
    console.log("Ketik 'keluar' untuk keluar dari mode REPL.");
}

const { parse } = require('./parser');

async function runEarl(code, customModules = modules, parentContext) {
    const lines = code.trim().split('\n');
    const ast = parse(code);
    const context = parentContext ?? {
        index: 0,
        lines,
        lingkup: [{}]
    };
    await laksanakanAST(ast, customModules, context);
    context.berhenti = false;

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
                    await handler(tokens, modules, context);
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

    const contextGlobal = {
        index: 0,
        lines: [],
        lingkup: [{}],
        memory
    };

    let multilineBuffer = [];
    let insideBlock = false;

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

        if (!insideBlock && /^(jika|fungsi|ulangi|kelas|untukSetiap)\b/.test(input)) {
            insideBlock = true;
        }

        if (insideBlock) {
            multilineBuffer.push(line);

            if (input === 'selesai') {
                insideBlock = false;
                const codeBlock = multilineBuffer.join('\n');
                multilineBuffer = [];

                try {
                    await runEarl(codeBlock, modules, contextGlobal);
                    contextGlobal.berhenti = false;
                } catch (err) {
                    console.error('Kesalahan:', err.message);
                }
                rl.prompt();
            } else {
                rl.prompt();
            }
        } else {
            try {
                contextGlobal.lines = [input];
                contextGlobal.index = 0;
                await runEarl(input, modules, contextGlobal);
                contextGlobal.berhenti = false;
            } catch (err) {
                console.error('Kesalahan:', err.message);
            }
            rl.prompt();
        }
    });

    rl.on('close', () => {
        console.log('Keluar!');
        process.exit(0);
    });
}


module.exports = { runEarl };
