// modules/kelas.js

const { memory } = require('../memory.js');

async function ambilAtributMetodeRekursif(namaKelas) {
    if (!memory[namaKelas]) return { atribut: [], instance: {}, metode:{} };

    const kelas = memory[namaKelas];
    if (kelas.tipe !== 'kelas') return { atribut: [], instance: {}, metode: {} };

    let atribut = [...(kelas.atribut || [])];
    let instance = { ...(kelas.instance || {}) };
    let metode = { ...(kelas.metode || {}) };

    if (kelas.mewarisi) {
        const indukData = await ambilAtributMetodeRekursif(kelas.mewarisi);

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

        if (!memory[parentKelas] || memory[parentKelas].__tipe !== 'kelas') {
            console.warn(`Kelas induk '${parentKelas}' tidak ditemukan atau bukan kelas valid.`);
            return;
        }
    }

    const { atribut, instance, metode } = parentKelas
        ? ambilAtributMetodeRekursif(parentkelas)
        : { atribut: [], instance: {}, metode: {} };

    instance.__tipe = namaKelas;

    const pengaturan = {};

    memory[namaKelas] = {
        __tipe: 'kelas',
        mewarisi: parentKelas || null,
        atribut,
        instance,
        pengaturan,
        metode,
    };

    for (const subNode of context.currentNode.body) {
        const [cmd, ...args] = subNode.tokens;

        if (nextTokens[0] === 'punggung') {
            const vars= args.map(v => v.replace(/[:,]/g, ''));
            vars.forEach(varName => {
                if (memory.hasOwnProperty(varName)) {
                    memory[namaKelas].instance[varName] = memory[varName];
                } else {
                    console.warn(`Variabel '${varName}' tidak ditemukan di memory.`);
                }
            });
        }

        if (nextTokens[0] === 'Penguatan') {
            const namaPenguatan = args[0].replace(/[()]/g, '');
            pengaturan[namaPenguatan] = {};

            for (const isiPenguatan of subNode.body) {
                const [subcmd, ...subargs] = isiPenguatan.tokens;

                if (['tumpuk', 'menimbun', 'melontarkan'].includes(subcmd)) {
                    pengaturan[namaPenguatan][subcmd] = subargs;
                }
                else if (subcmd === 'MenangkapBasah' && subargs[0] === '#debug') {
                    pengaturan[namaPenguatan].debug = true;
                }
            }
        }

        if (nextTokens[0] === 'metode') {
            const namaMetode = args[0].replace(/[:,]/g, '');
            const metodeLines = subNode.body.map(n => n.tokens.join(' '));
            metode[namaMetode] = metodeLines.join('\n');   
        }
    }

    console.log(`Kelas '${namaKelas}' didefiniskan${parentKelas ? ` (mewarisi '${parentKelas}')` : ''}.`);
    console.log(`Atribut:`, atribut);
    console.log(`Instance:`, instance);
    console.log(`Pengaturan:`, pengaturan);
    console.log(`Metode:`, metode);
}

kelas.isBlock = true;
module.exports = { kelas };
