// index.js

import { tokenize } from './tokenize.js';

import { ambil } from './modules/ambil.js';
import { tampilkan } from './modules/tampilkan.js';
import { masukkan } from './modules/masukkan.js';
import { hitung } from './modules/hitung.js';
import { jika } from './modules/jika.js';
import { ulangi } from './modules/ulangi.js';
import { membangun } from './modules/membangun.js';
import { kelas } from './modules/kelas.js';



const modules = {
    ambil,
    tampilkan,
    masukkan,
    hitung,
    jika,
    ulangi,
    membangun,
    kelas,
    tokenize
};

export function runPearl(code) {
    const lines = code.trim().split('\n');
    const context = { index: 0, lines }

    while (context.index < line.length) {
        const line = lines[context.index].trim();
        const tokens = tokenize(line);

        if (!tokens || tokens.length === 0) {
            context.index++;
            continue;
        }

        const cmd = tokens[0];

        if (modules[cmd]) {
            try {
                modules[cmd](tokens, modules, context);
            } catch (err) {
                console.error(`Kesalahan saat menjalankan perintah '${cmd}' di baris ${context.index + 1}:`, err);
            }
        } else {
            console.error(`Modul tidak dikenali: '${cmd}' di baris ${context.index + 1}`);
        }

        context.index++;
    }
}



document.addEventListener("DOMContentLoaded", () => {
    const tombol = document.getElementById("jalankanBtn");
    const textarea = document.getElementById("codeInput");

    tombol.addEventListener("click", () => {
      const code = textarea.value;
      runPearl(code);
    })
});
