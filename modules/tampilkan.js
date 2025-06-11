// modules/tampilkan.js

const { memory } = require('../memory.js');

function tampilkan(tokens, modules, context) {
    const target = tokens[1];

    const daftarAkses = target.match(/^:([^:\[\]]+)\[(.+)\]:$/);
    if (daftarAkses) {
        const varName = daftarAkses[1];
        const indexExpr = daftarAkses[2];

        const arr = memory[varName];
        let index = parseInt(indexExpr);

        if (isNaN(index)) {
            const indexVar = indexExpr.replace(/:/g, '');
            index = memory[indexVar];
        }

        if (Array.isArray(arr) && index >= 0 && index < arr.length) {
            console.log(arr[index]);
        } else {
            console.log(`Tidak dapat menampilkan :${varName}:[${indexExpr}]: (daftar tidak valid atau index di luar batas)`);
        }
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
        if (typeof val === 'object' && val !== null && !Array.isArray()val) {
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

    } else {
        console.log(target.replace(/"/g, ""));
    }
}

module.exports = { tampilkan };
