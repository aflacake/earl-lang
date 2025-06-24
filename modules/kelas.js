// modules/kelas.js

const { memory } = require('../memory.js');

async function kelas(tokens, modules, context) {
    const namaKelas = tokens[1].replace(/:/g, '');
    let parentKelas = null;

    if (memory[namaKelas]) {
        console.warn(`Kelas '${namaKelas}' sudah didefinisikan.`);
        return;
    }

    const mewarisiIndex = tokens.indexOf('mewarisi');
    if (mewarisiIndex !== -1 && tokens[mewarisiIndex + 1]) {
         parentKelas = tokens[mewarisiIndex + 1].replace(/:/g, '');
    }

    let atribut = [];
    let instance = {};
    const pengaturan = {};
    const metode = {};

    if (parentKelas && memory[parentKelas]) {
        const parent = memory[parentKelas];
        if (parent._tipe === 'kelas') {
            atribut = [...parent.atribut];
            instance = { ... parent.instance };
            Object.assign(metode, parent.metode);
        } else {
            console.warn(`Kelas induk '$parentKelas' bukan kelas valid.`);
        }
    }

    instance.__tipe = namaKelas;

    memory[namaKelas] = {
        __tipe: 'kelas',
        mewarisi: parentKelas || null,
        atribut,
        instance,
        pengaturan,
        metode
    };

    let currentIndex = context.index + 1;
    while (currentIndex < context.lines.length) {
        const nextLine = context.lines[currentIndex];

        if (!nextLine || !/^\s/.test(nextLine)) break;

        const nextTokens = modules.tokenize(nextLine.trim());

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
            pengaturan[subperintah] = {};

            let subIndex = currentIndex + 1;
            while (subIndex < context.lines.length) {
                const subLine = context.lines[subIndex];

                if (!subLine || !/^\s{4}/.test(subLine)) break;

                const subTokens = modules.tokenize(subLine.trim());

                if (['tumpuk', 'menimbun', 'melontarkan'].includes(subTokens[0])) {
                    pengaturan[subperintah][subTokens[0]] = subTokens.slice(1);
                }
                else if (subTokens[0] === 'MenangkapBasah' && subTokens[1] === '#debug') {
                    pengaturan[subperintah].debug = true;
                }
                subIndex++;
            }
            currentIndex = subIndex - 1;
        }

        if (nextTokens[0] === 'metode') {
            const metodeName = nextTokens[1].replace(/[:,]/g, '');
            const metodeBody = nextTokens.slice(2).join(" ");
            metode[metodeName] = metodeBody;
        }
        currentIndex ++;
    }
    context.index = currentIndex - 1;
    console.log(`Kelas '${namaKelas}' didefiniskan${parentKelas ? ` (mewarisi '${parentKelas}')` : ''}.`);
    console.log(`Atribut:`, atribut);
    console.log(`Instance:`, instance);
    console.log(`Pengaturan:`, pengaturan);
    console.log(`Metode:`, metode);
}

module.exports = { kelas };
