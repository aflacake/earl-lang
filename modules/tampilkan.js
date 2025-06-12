// modules/tampilkan.js

const { memory } = require('../memory.js');

function aksesBersarang(arr, indexes) {
    let current = arr;
    for (const idx of indexes) {
        if (!Array.isArray(current)) {
            return undefined;
        }
        if (idx < 0 || idx >= current.length || isNaN(idx)) {
            return undefined;
        }
        current = current[idx];
    }
    return current;
}

function tampilkan(tokens, modules, context) {
    const target = tokens[1];

    const daftarBersarangMatch = target.match(/^:([^:\[\]]+)((\[\d+\])+):$/);
    if (daftarBersarangMatch) {
        const varName = daftarBersarangMatch[1];
        const indexesStr = daftarBersarangMatch[2];
        const indexes = [...indexesStr.matchAll(/\[(\d+)\]/g)].map(m => Number(m[1]));
        const arr = memory[varName];

        if (Array.isArray(arr)) {
            console.log(`'${varName}' bukan daftar.`);
            return;
        }
        const nilai = aksesBersarang(arr, indexes);
        if (nilai === undefined) {
            console.log(`Indeks tidak valid untuk daftar bersarang '${varName}'.`);
        } else {
            console.log(nilai);
        }
        return;
    }

    const daftarSatuMatch = target.match(/^:([^:\[\]]+)\[(\d+)\]:$/);
    if (daftarSatuMatch) {
        const varName = daftarSatuMatch[1];
        const index = Number(daftarSatuMatch[2]);
        const arr = memory[varName];
        if (!Array.isArray(arr)) {
            console.log(`'${varName}' bukan daftar.`);
            return;
        }
        if (index < 0 || index >= arr.length) {
            console.log(`Indeks ${index} di luar batas untuk daftar '${varName}'.`);
            return;
        }
        console.log(arr[index]);
        return;
    }

    const diktaAkses = target.match(/^:([^:\[\]]+):([^:\[\]]+)$/);
    if (diktaAkses) {
        const varName = diktaAkses[1];
        const key = diktaAkses[2];

        const dikta = memory[varName];
        if (dikta && typeof dikta === 'object' && !Array.isArray(dikta)) {
            if (key in dikta) {
                console.log(dikta[key]);
            } else {
                console.log(`Kunci '${key}' tidak ditemukan di dikta '${varName'}.`);
            }
        } else {
            console.log(`Variabel '${varName}' bukan dikta.`);
        }
        return;
    }

    if (target.startsWith(":") && target.endsWith(':')) {
        const varName = target.slice(1, -1);
        const val = memory[varName];
        if (typeof val === 'object' && val !== null) {
            console.log(JSON.stringify(val, null, 2));
        } else {
            console.log(val ?? "tidak dikenali");
        }
    } 
    else if (target.includes(".")) {
        const [className, attrName] = target.split(".");
        const kelas = memory[className];

        if (kelas && kelas.__tipe === "kelas") {
            const value = kelas.instance ? kelas.instance[attrName] : undefined;
            console.log(value ?? `atribut '${attrName}' tidak ditemukan di kelas '${className}'`);
        } else {
            console.log(`Kelas '${className}' tidak ditemukan`);
        }
        return;
    }
        
    console.log(target.replace(/"/g, ""));
}

module.exports = { tampilkan };
