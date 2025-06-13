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
const { lakukan } = require('./modules/lakukan.js');
const { fungsi } = require('./modules/fungsi.js');
const { kembalikan } = require('./modules/kembalikan.js');
const { daftar } = require('./modules/daftar.js');
const { dikta } = require('./modules/dikta.js');
const { melahirkan } = require('./modules/melahirkan.js');
const { gambar } = require('./modules/gambar.js');
const { ingatan } = require('./modules/ingatan.js');
const { prosesor } = require('./modules/prosesor.js');
const { peranti } = require('./modules/peranti.js');
const { jikaLainnya } = require('./modules/jikaLainnya.js');
const { ulangiKontrol } = require('./modules/ulangiKontrol.js');
const { string } = require('./modules/string.js');

const fs = require('fs');
const readline = require('readline');

const modules = {
    ambil,
    tampilkan,
    masukkan,
    hitung,
    jika: jikaLainnya,
    ulangi,
    ulangiKontrol,
    membangun,
    kelas,
    atur,
    waktu,
    buka,
    tulis,
    tutup,
    debug,
    lakukan,
    fungsi,
    kembalikan,
    daftar,
    dikta,
    melahirkan,
    gambar,
    ingatan,
    prosesor,
    peranti,
    string;
    tokenize
};

async function runPearl(code) {
    const lines = code.trim().split('\n');
    const context = { index: 0, lines };

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
                console.error(`Kesalahan saat menjalankan perintah '${cmd}' di baris ${context.index + 1}:`, err.message);
            }
        } else {
            console.error(`Modul tidak dikenali: '${cmd}' di baris ${context.index + 1}`);
        }

        context.index++;
    }
}

const args = process.argv.slice(2);

if (args.length > 0) {
    const filename = args[0];
    if (!filename.endsWith('.pearl')) {
        console.error("Hanya file dengan ekstensi .pearl yang dapat dijalankan.");
        process.exit(1);
    }

    if (fs.existsSync(filename)) {
        const kode = fs.readFileSync(filename, 'utf8');
        runPearl(kode);
    } else {
        console.error(`File '${filename}' tidak ditemukan.`);
    }
} else {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: 'pearl>'
    });

    console.log("Pearl REPL Mode - ketik 'keluar' untuk keluar");

    rl.prompt();

    rl.on('line', async (line) => {
        if (line.trim() === 'keluar') {
            rl.close();
            return;
        }

        try {
            await runPearl(line);
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


module.exports = { runPearl };
