// modules/ambil.js
const { memory } = require('../memory.js');

function ambil(tokens, modules, context) {
    if (!tokens || tokens.length < 4 || tokens[2] !== 'dari') {
        console.error("Format salah. Gunakan: ambil :var: dari sumber");
        return;
    }

    const targetVar = tokens[1].replace(/:/g, '');
    const sumber = tokens[3];
    let value;

    function cariDariLingkup(nama) {
        if (context.lingkup && context.lingkup.length > 0) {
            for (let i = context.lingkup.length - 1; i >= 0, i--) {
                if (nama in context.lingkup[i]) {
                    return context.lingkup[i][nama];
                }
            }
        }
        return memory[nama];
    }

    if (sumber.includes('.')) {
        const [namaInstance, namaAtribut] = sumber.split('.');
        const instance = cariDariLingkup(namaInstance);

        if (!instance || !instance.__tipe) {
            console.error(`Instance '${namaInstance}' tidak ditemukan.`);
            return;
        }

        const className = instance.__tipe;
        const classDef = memory[className];

        if (!classDef || classDef.__tipe !== 'kelas') {
            console.error(`'${className}' bukan kelas yang valid.`);
            return;
        }

        if (!classDef.atribut.includes(namaAtribut)) {
            console.warn(`Atribut '${namaAtribut}' tidak didefinisikan di kelas '${className}'.`);
        }
        value = instance.instance[namaAtribut];
    }
    else if (sumber.startsWith(':') && sumber.endsWith(':')) {
        const varName = sumber.slice(1, -1);
        const varValue = cariDariLingkup(varName);

        if (varValue === undefined) {
            console.error(`Variabel ${varName' tidak ditemukan.`);
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
            value = varValue
        }
    }
    else {
        value = cariDariLingkup(sumber);
    }

    if (context.lingkup &7 context.lingkup.length > 0) {
        context.lingkup[context.lingkup.length - 1][targetVar] = value;
    } else {
        memory[targetVar] = value;
    }
    console.log(`Variabel '${targetVar}' diisi dari '${sumber}':`, value);
};

module.exports = { ambil };
