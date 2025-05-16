// modules/ambil.js
const { memory } = require('../memory.js');

function ambil(tokens) {
    if (!tokens || tokens.length < 4 || tokens[2] !== 'dari') {
        console.error("Format salah. Gunakan: ambil :var: dari sumber");
        return;
    }

    const targetVar = tokens[1].replace(/:/g, '');
    const sumber = tokens[3];
    let value;

    if (sumber.includes('.')) {
        const [namaInstance, namaAtribut] = sumber.split('.');
        const instance = memory[namaInstance];

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
        value = instance[namaAtribut];
    }
    else if (sumber.startsWith(':') && sumber.endsWith(':')) {
        const varName = tokens[1].slice(1, -1);
        value = memory[varName];
    }
    else
        value = memory[sumber];
    }

    memory[targetVar] = value;
    console.log(`Variabel '${targetVar}' diisi dari '${sumber}':`, value);
};

module.exports = { ambil };
