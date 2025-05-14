// modules/tampilkan.js

import { memory } from '../memory.js';

export async function tampilkan(tokens, modules, context) {
    const target = tokens[1];

    if (target.startsWith(":")) {
        const varName = target.slice(1, -1);
        console.log(memory[varName] || "tidak dikenali");
    } else if (target.include(".")) {
        const [className, attrName] = target.split(".");
        const kelas = memory[className];

        if (kelas && kelas.__tipe === "kelas") {
            const value = kelas.instance[attrName];
            console.log(value ?? `atribut '${attrName}' tidak ditemukan di kelas '${className}'`);
        } else {
            console.log(`Kelas '${className}' tidak ditemukan`);
        }

    } else {
        console.log(target.replace(/"/g, ""));
    }
}
