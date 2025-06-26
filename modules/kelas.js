// modules/kelas.js

const { memory } = require('../memory.js');

async ambilAtributMetodeRekursif(namaKelas) {
    if (!memory[namaKelas]) return { atribut: [], instance: {}, metode:{] };

    const kelas = memory[namaKelas];
    if (kelas.tipe !== 'kelas') return { atribut: [], instance: {}, metode: {} };

    let atribut = [...(kelas.atribut || [])];
    let instance = { ...(kelas.instance || {}) };
    let metode = { ...(kelas.metode || {}) };

    if (kelas.mewarisi) {
        const indukData = ambilAtributMetodeRekursif(kelas.mewarisi);

        atribut = [...new Set([...indukData.atribut, ...atribut])];

        instance = { ...indukData.instance, ...instance };

        metode = { ...indukData.metode, ...metode };
    }
    return { atribut, instance, metode };
}

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

        if (!memory[parentKelas] || memory[parentkelas].__tipe !== 'kelas') {
            console.warn(`Kelas induk '${parentKelas}' tidak ditemukan atau bukan kelas valid.`);
            return;
        }
    }

    const { atribut, instance, metode } = parentKelas
        ? ambilAtributMetodeRekursif(parentkelas)
        : { atribut: [], instance: {}, metode: {} };

    instance.__tipe = namaKelas;

    memory[namaKelas] = {
        __tipe: 'kelas',
        mewarisi: parentKelas || null,
        atribut,
        instance,
        pengaturan: {},
        metode,
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
            let metodeBody = '';

            if (nextToken.includes('(')) {
                let motodeLines = [];
                currentIndex++;

                while (currentIndex < context.lines.length) {
                    const baris = context.lines[currentIndex].trim();
                    if (baris === ')') break;
                    metodeLines.push(baris);
                    currentIndex++;
                }
                metodeBody = mtodeLines.join('\n');
            } else {
                metodeBody = nextTokens.slice(2).join(" ");
            }
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
