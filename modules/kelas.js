// modules/kelas.js

const { memory } = require('../memory.js');

async function kelas(tokens, modules, context) {
    const namaKelas = tokens[1].replace(/:/g, '');
    const atribut = tokens.slice(2);

    memory[namaKelas] = {
        __tipe: 'kelas',
        atribut: atribut,
        instance: {}
        pengaturan: {}
    };

    let currentIndex = context.index + 1;
    while (currentIndex < context.lines.length) {
        const nextLine = context.lines[currentIndex].trim();

        if (!nextLine || !/^\s/.test(nextLine)) break;

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

        if (nextTokens[0] === 'Penguatan') {
            const subperintah = nextTokens[1].replace(/[()]/g, '');
            memory[namaKelas].pengaturan[subperintah] = {};

            let subIndex = currentIndex + 1;
            while (subIndex < context.line.length) {
                const subLine = context.lines[subIndex].trim();

                if (!subLine || !/^\s/.test(subLine)) break;

                const subTokens = modules.tokenize(subLine);

                if (subTokens[0] === 'tumpuk' || subTokens[0] === 'menimbun' || subTokens[0] === 'melontarkan') {
                    memory[namaKelas].pengaturan[subperintah][subTokens[0]] = subTokens.slice(1);
                }
                else if (subTokens[0] === 'MenangkapBasah' && subTokens[1] === '#debug') {
                    memory[namaKelas].pengaturan[subperintah].debug = true;
                }
                subIndex++;
            }
        }
        currentIndex ++;
    }
    context.index = currentIndex - 1;
    console.log(`Kelas ${namaKelas} didefinisikan dengan atribut:`, atribut);
    console.log(`Pengaturan kelas:`, memory[namaKelas].pengaturan);
    console.log(`Instance:`, memory[namaKelas].instance);
}

module.exports = { kelas };
