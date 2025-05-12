// index.js

import { tokenize } from './tokenize.js';

import { ambil } from './modules/ambil.js';
import { tampilkan } from './modules/tampilkan.js';
import { masukkan } from './modules/masukkan.js';
import { hitung } from './modules/hitung.js';
import { jika } from './modules/jika.js';
import { ulangi } from './modules/ulangi.js';
import { membangun } from './modules/membangun.js';


const modules = {
    ambil,
    tampilkan,
    masukkan,
    hitung,
    jika,
    ulangi,
    membangun,
    tokenize
};

export function runPearl(code) {
    const lines = code.trim().split('\n');
    const context = { index: 0, lines }

    while (context.index < line.length) {
        const line = lines[context.index].trim();
        const tokens = tokenize(line);
        const cmd = tokens[0];

        if (modules[cmd]) {
            modules[cmd](tokens, modules, context);
        } else {
            console.error("Modul tidak dikenali: " + cmd);
        }

        context.index++;
    }
}

import { runPearl } from './index.js';

document.addEventListener("DOMContentLoaded", () => {
    const tombol = document.getElementById("jalankanBtn");
    const textarea = document.getElementById("codeInput");

    tombol.addEventListener("click", () => {
      const code = textarea.value;
      runPearl(code);
    })
});