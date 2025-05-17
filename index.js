// index.js

const { tokenize } = require('./tokenize.js');

const { ambil } = require('./modules/ambil.js');
const { tampilkan } = require('./modules/tampilkan.js');
const { masukkan } = require('./modules/masukkan.js');
const { hitung } = require('./modules/hitung.js');
const { jika } = require('./modules/jika.js');
const { ulangi } = require('./modules/ulangi.js');
const { membangun } = require('./modules/membangun.js');
const { kelas } = require('./modules/kelas.js');
const { atur } = require('./modules/atur.js');
const { waktu } = require('./modules/waktu.js');
const { buka } = require('./modules/buka.js');
const { tulis } = require('./modules/tulis.js');
const { tutup } = require('./modules/tutup.js');
const { debug } = require('./modules/debug.js');

const readline = require('readline');

const modules = {
    ambil,
    tampilkan,
    masukkan,
    hitung,
    jika,
    ulangi,
    membangun,
    kelas,
    atur,
    waktu,
    buka,
    tulis,
    tutup,
    debug,
    tokenize
};

async function runPearl(code) {
    const lines = code.trim().split('\n');
    const context = { index: 0, lines }

    while (context.index < lines.length) {
        const line = lines[context.index].trim();
        const tokens = tokenize(line);

        if (!tokens || tokens.length === 0) {
            context.index++;
            continue;
        }

        const cmd = tokens[0];

        if (modules[cmd]) {
            try {
                await modules[cmd](tokens, modules, context);
            } catch (err) {
                console.error(`Kesalahan saat menjalankan perintah '${cmd}' di baris ${context.index + 1}:`, err);
            }
        } else {
            console.error(`Modul tidak dikenali: '${cmd}' di baris ${context.index + 1}`);
        }

        context.index++;
    }
}


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Masukkan kode Pearl yang ingin dijalankan:\n', async (code) => {
    await runPearl(code);
    rl.close();
});

module.exports = { runPearl };
