// modules/ambil.js
const { memory } = require('../memory.js');
const { ambilDaftarJikaPerlu } = require('../utili.js');

function ambil(tokens, modules, context) {
    if (!tokens || tokens.length < 4 || tokens[2] !== 'dari') {
        console.error("Format salah. Gunakan: ambil :var: dari sumber");
        return;
    }

    if (!tokens[1].startsWith(':') || !tokens[1].endsWith(':')) {
        console.error("Variabel tujuan harus dalam format :nama:");
        return;
    }

    const targetVar = tokens[1].slice(1, -1);
    const sumber = tokens[3];
    let value;

    function cariDariLingkup(nama) {
        if (context.lingkup && context.lingkup.length > 0) {
            for (let i = context.lingkup.length - 1; i >= 0; i--) {
                if (nama in context.lingkup[i]) {
                    return context.lingkup[i][nama];
                }
            }
        }
        return memory[nama];
    }

    const daftarNilai = ambilDaftarJikaPerlu(sumber);
    if (daftarNilai !== null) {
        value = daftarNilai;
        if (context.lingkup && context.lingkup.length > 0) {
            context.lingkup[context.lingkup.length - 1][targetVar] = value;
        } else {
            memory[targetVar] = value;
        }
        console.log(`Variabel '${targetVar}' diisi dari '${sumber}':`, value);
        return;
    }

    else if (sumber.includes('.')) {
        const bagian = sumber.split('.');
        const namaInstance = bagian[0];
        const instance = cariDariLingkup(namaInstance);

        if (!instance || typeof instance !== 'object') {
            console.error(`Instance '${namaInstance}' tidak ditemukan atau bukan objek.`);
            return;
        }

        value = instance;
        for (let i = 1; i < bagian.length; i++) {
            const kunci = bagian[i];
            if (value && kunci in value) {
                value = value[kunci];
            } else {
                console.error(`Atribut '${kunci}' tidak ditemukan.`);
                return;
            }
        }

        if (instance.__tipe) {
            const className = instance.__tipe;
            const classDef = memory[className];
            const namaAtribut = bagian[1];

            if (!classDef || classDef.__tipe !== 'kelas') {
                console.error(`'${className}' bukan kelas yang valid.`);
                return;
            }

            if (!classDef.atribut.includes(namaAtribut)) {
                console.warn(`Atribut '${namaAtribut}' tidak didefinisikan di kelas '${className}'.`);
            }
        }
    }
    else if (sumber.startsWith(':') && sumber.endsWith(':')) {
        const varName = sumber.slice(1, -1);
        const varValue = cariDariLingkup(varName);

        if (varValue === undefined) {
            console.error(`Variabel '${varName}' tidak ditemukan.`);
            return;
        }
        if (typeof varValue === 'object'&& !Array.isArray(varValue)) {
            if(tokens.length > 4) {
                const key = tokens[4];
                if (key in varValue) {
                    value = varValue[key];
                } else {
                    console.error(`Kunci '${key}' tidak ditemukan di dikta '${varName}'.`);
                    return;
                }
            } else {
                value = varValue;
            }
        } else {
            value = varValue;
        }
    }
    else {
        value = cariDariLingkup(sumber);
    }

    if (context.lingkup && context.lingkup.length > 0) {
        context.lingkup[context.lingkup.length - 1][targetVar] = value;
    } else {
        memory[targetVar] = value;
    }
    console.log(`Variabel '${targetVar}' diisi dari '${sumber}':`, value);
    return;
};

module.exports = { ambil };
