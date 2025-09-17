// index.js

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { memory } = require('./memory');
const { laksanakanAST } = require('./pelaksana-ast');

const { tokenize } = require('./tokenize');
const { tokenizekedua } = require('./utili');
const { parse } = require('./parser');

// Impor modul-modul secara manual
const { ambil } = require('./modules/ambil');
const { apg } = require('./modules/apg');
const { atur } = require('./modules/atur');
const { aturheader } = require('./modules/aturheader');
const { aturPilihan } = require('./modules/aturPilihan');
const { baca } = require('./modules/baca');
const { berhenti } = require('./modules/berhenti');
const { buka } = require('./modules/buka');
const { bukaPintu } = require('./modules/bukaPintu');
const { cobaTangkap } = require('./modules/cobaTangkap');
const { daftar } = require('./modules/daftar');
const { dikta } = require('./modules/dikta');
const { evaluasi } = require('./modules/evaluasi');
const { folder } = require('./modules/folder');
const { fungsi } = require('./modules/fungsi');
const { gambar } = require('./modules/gambar');
const { github } = require('./modules/github');
const { hapus } = require('./modules/hapus');
const { hitung } = require('./modules/hitung');
const { http } = require('./modules/http');
const { impor } = require('./modules/impor');
const { ingatan } = require('./modules/ingatan');
const { isi } = require('./modules/isi');
const { jeda } = require('./modules/jeda');
const { jejak } = require('./modules/jejak');
const { jika } = require('./modules/jika');
const { jikaLainnya } = require('./modules/jikaLainnya');
const { kelas } = require('./modules/kelas');
const { kembalikan } = require('./modules/kembalikan');
const { lakukan } = require('./modules/lakukan');
const { langkah } = require('./modules/langkah');
const { lingkup } = require('./modules/lingkup');
const { masukkan } = require('./modules/masukkan');
const { matematika } = require('./modules/matematika');
const { melahirkan } = require('./modules/melahirkan');
const { memanjat } = require('./modules/memanjat');
const { membangun } = require('./modules/membangun');
const { mencairkan } = require('./modules/mencairkan');
const { mengandung } = require('./modules/mengandung');
const { mengangkat } = require('./modules/mengangkat');
const { menyelam } = require('./modules/menyelam');
const { panggilMetode } = require('./modules/panggilMetode');
const { penugasan } = require('./modules/penugasan');
const { peranti } = require('./modules/peranti');
const { periksa } = require('./modules/periksa');
const { peringatan } = require('./modules/peringatan');
const { perpindahan } = require('./modules/perpindahan');
const { prosesor } = require('./modules/prosesor');
const { simpan } = require('./modules/simpan');
const { tampilkan } = require('./modules/tampilkan');
const { tanya } = require('./modules/tanya');
const { teks } = require('./modules/teks');
const { tetapkan } = require('./modules/tetapkan');
const { tulis } = require('./modules/tulis');
const { tutup } = require('./modules/tutup');
const { ulangi } = require('./modules/ulangi');
const { ulangi_sebelumnya } = require('./modules/ulangi_sebelumnya');
const { ulangiKontrol } = require('./modules/ulangiKontrol');
const { untukSetiap } = require('./modules/untukSetiap');
const { versi } = require('./modules/versi');
const { waktu } = require('./modules/waktu');

function pilihTokenizer(line) {
    if (line.includes('"')) return tokenizekedua(line);
    return tokenize(line);
}

const modules = { 
    memory,
    tokenize: pilihTokenizer,
    laksanakanAST,

    // daftar modul-modul
    ambil,
    apg,
    atur,
    aturheader,
    aturPilihan,
    baca,
    berhenti,
    buka,
    bukaPintu,
    cobaTangkap,
    daftar,
    dikta,
    evaluasi,
    folder,
    fungsi,
    gambar,
    github,
    hapus,
    hitung,
    http,
    impor,
    ingatan,
    isi,
    jeda,
    jejak,
    jika,
    jikaLainnya,
    kelas,
    kembalikan,
    lakukan,
    langkah,
    lingkup,
    masukkan,
    matematika,
    melahirkan,
    memanjat,
    membangun,
    mencairkan,
    mengandung,
    mengangkat,
    menyelam,
    panggilMetode,
    penugasan,
    peranti,
    periksa,
    peringatan,
    perpindahan,
    prosesor,
    simpan,
    tampilkan,
    tanya,
    teks,
    tetapkan,
    tulis,
    tutup,
    ulangi,
    ulangi_sebelumnya,
    ulangiKontrol,
    untukSetiap,
    versi,
    waktu
};

function bantuan() {
    console.log('Daftar perintah yang tersedia:');
    const cmds = Object.keys(modules)
        .filter(k => k !== 'memory' && k !== 'tokenize')
        .sort();
    cmds.forEach(cmd => console.log(`- ${cmd}`));
    console.log("Ketik 'keluar' untuk keluar dari mode REPL.");
}

async function runEarl(code, customModules = modules, parentContext, lewatiManual = false) {
    const lines = code.trim().split('\n');
    const ast = parse(code);
    const context = parentContext ?? {
        index: 0,
        lines,
        lingkup: [{}]
    };
    context.kondisiTerpenuhi = false;

    if (lewatiManual) {
        await laksanakanAST(ast, customModules, context);
        context.berhenti = false;
        return context;
    }

    while (context.index < context.lines.length && !context.berhenti) {
        const line = context.lines[context.index].trim();

        const tokens = customModules.tokenize(line);
        if (!tokens || tokens.length === 0) {
            context.index++;
            continue;
        }

        const cmd = tokens[0];

        let func = null;
        for (let i = context.lingkup.length - 1; i >= 0; i--) {
            if (typeof context.lingkup[i][cmd] === 'function') {
                func = context.lingkup[i][cmd];
                break;
            }
        }

        if (func) {
            try {
                await func(tokens, customModules, context);
            } catch (err) {
                console.error(`Kesalahan saat menjalankan fungsi '${cmd}':`, err.message);
            }
            context.index++;
        } else if (customModules[cmd]) {
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

                await handler(tokens, customModules, { 
                    ...context, 
                    lines: blockLines, 
                    index: 0, 
                    kondisiTerpenuhi: false,
                            currentNode: {
                                type: 'Block',
                                body: parse(blockLines.join('\n'))
                            }
                });
            } else {
                try {
                    await handler(tokens, customModules, context);
                } catch (err) {
                    console.error(`Kesalahan saat menjalankan perintah '${cmd}' di baris ${context.index + 1}:`, err.message);
                }
                context.index++;
            }
        } else {
            console.error(`Modul atau fungsi tidak dikenali: '${cmd}' di baris ${context.index + 1}`);
            context.index++;
        }
    }

    return context;
}

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
    memory,
    repl: true
};

let multilineBuffer = [];
let insideBlock = false;

modules.bacaBaris = (prompt) => {
    return new Promise((resolve) => {
        rl.question(prompt, (jawaban) => resolve(jawaban));
    });
};

rl.prompt();

rl.on('line', async (line) => {
    const input = line.trim();

    if (input) {
        memory.sourceLines.push(input);
    }

    if (line.trim() === 'keluar') {
        rl.close();
        return;
    }

    if (input === 'bantuan') {
        bantuan();
        rl.prompt();
        return;
    }

    if (!insideBlock && /^(jika|fungsi|ulangi|kelas|untukSetiap|menyelam)\b/.test(input)) {
        insideBlock = true;
    }

    if (insideBlock) {
        multilineBuffer.push(line);

        if (input === 'selesai') {
            insideBlock = false;
            const codeBlock = multilineBuffer.join('\n');
            multilineBuffer = [];

            try {
                await runEarl(codeBlock, modules, {
                    ...contextGlobal,
                    currentNode: { type: 'REPL', body: parse(codeBlock) }
                    });
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
            await runEarl(input, modules, contextGlobal, true);
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

module.exports = { runEarl };
