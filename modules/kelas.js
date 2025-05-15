// modules/kelas.js

const { memory } = require('../memory.js');

async function kelas(tokens, modules, context) {
    const namaKelas = tokens[1].replace(/:/g, '');
    const atribut = tokens.slice(2);

    memory[namaKelas] = {
        __tipe: 'kelas',
        atribut: atribut,
        instance: {}
    };

    let currentIndex = context.index + 1;
    while (currentIndex < context.lines.length) {
        const nextLine = context.lines[currentIndex].trim();

        if (!nextLine || !/^\s/.test(context.lines[currentIndex])) break;

        const nextTokens = modules.tokenize(nextLine);

        if (nextTokens[0] === 'punggung') {
            const variables = nextTokens.slice(1).map(v => v.replace(/[:,]/g, ''));
            variables.forEach(varName => {
                if (memory.hasOwnProperty(varName)) {
                    memory[namaKelas].instance[varName] = memory[varName];
                } else {
                    console.warn(`Variabel '${varName}' tidak ditemukan di memory.`);
                }
            });
        }
        currentIndex ++;
    }
    context.index = currentIndex - 1;
    console.log(`Kelas ${namaKelas} didefinisikan dengan atribut:`, atribut);
    console.log(`Instance:`, memory[namaKelas].instance);
}

module.exports = { kelas };
