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
    cmds.forEach(cmd => console.log(`- ${cmd}`));
    console.log("Ketik 'keluar' untuk keluar dari mode REPL.");
}

const { runEarl, modules } = require('./penjalankan');

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

    const contextGlobal = {
        index: 0,
        lines: [],
        lingkup: [{}],
        memory
    };

    let multilineBuffer = [];
    let inMultiline = false;

    rl.on('line', async (line) => {
        const input = line.trim();

        if (input === 'keluar') {
            rl.close();
            return;
        }

        if (input === 'bantuan') {
            bantuan();
            rl.prompt();
            return;
        }

        if (input === 'selesai') {
            inMultiline = false;
            const fullCode = multilineBuffer.join('\n');
            multilineBuffer = [];
            try {
                await runEarl(fullCode, modules, contextGlobal);
            } catch (err) {
                console.error('Kesalahan', err.message);
            }
            rl.prompt();
            return;
        }

        if (input.startsWith('fungsi') || inMultiline) {
            inMultiline = true;
            multilineBuffer.push(line);
            rl.prompt();
            return;
        }

        try {
            await runEarl(input, modules, contextGlobal);
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
