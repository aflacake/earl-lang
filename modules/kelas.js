// modules/kelas.js

const { memory } = require('../memory.js');

async function ambilAtributMetodeRekursif(namaKelas) {
    if (!memory[namaKelas]) return { atribut: [], instance: {}, metode: {} };

    const kelas = memory[namaKelas];
    if (kelas.__tipe !== 'kelas') return { atribut: [], instance: {}, metode: {} };

    let atribut = [...(kelas.atribut || [])];
    let instance = { ...(kelas.instance || {}) };
    let metode = { ...(kelas.metode || {}) };

    if (kelas.mewarisi) {
        const induk = await ambilAtributMetodeRekursif(kelas.mewarisi);
        atribut = [...new Set([...induk.atribut, ...atribut])];
        instance = { ...induk.instance, ...instance };
        metode = { ...induk.metode, ...metode };
    }

    return { atribut, instance, metode };
}

async function kelas(tokens, modules, context) {
    const namaKelas = tokens[1]?.replace(/:/g, '');
    if (!namaKelas) {
        console.warn('Nama kelas tidak ditemukan.');
        return;
    }

    if (memory[namaKelas]) {
        console.warn(`Kelas '${namaKelas}' sudah didefinisikan.`);
        return;
    }

    let parentKelas = null;
    const mewarisiIndex = tokens.indexOf('mewarisi');
    if (mewarisiIndex !== -1 && tokens[mewarisiIndex + 1]) {
        parentKelas = tokens[mewarisiIndex + 1].replace(/:/g, '');
        if (!memory[parentKelas] || memory[parentKelas].__tipe !== 'kelas') {
            console.warn(`Kelas induk '${parentKelas}' tidak ditemukan atau bukan kelas.`);
            return;
        }
    }

    const hasil = parentKelas
        ? await ambilAtributMetodeRekursif(parentKelas)
        : { atribut: [], instance: {}, metode: {} };

    const atribut = hasil.atribut;
    const instance = hasil.instance;
    const metode = hasil.metode;
    const pengaturan = {};

    instance.__tipe = namaKelas;

    memory[namaKelas] = {
        __tipe: 'kelas',
        mewarisi: parentKelas,
        atribut,
        instance,
        pengaturan,
        metode,
    };

    const body = context.currentNode?.body ?? [];

    for (let i = 0; i < body.length; i++) {
        const { type, tokens: subTokens, body: subBody } = body[i];

        if (type === 'punggung') {
            const vars = subTokens.slice(1).map(v => v.replace(/[:,]/g, ''));
            vars.forEach(varName => {
                if (memory.hasOwnProperty(varName)) {
                    memory[namaKelas].instance[varName] = memory[varName];
                } else {
                    console.warn(`Variabel '${varName}' tidak ditemukan.`);
                }
            });
        }

        else if (type === 'Penguatan') {
            const namaPenguatan = subTokens[1]?.replace(/[():]/g, '') || 'tanpaNama';
            pengaturan[namaPenguatan] = {};

            for (const sub of subBody ?? []) {
                const [subcmd, ...subargs] = sub.tokens;
                if (['tumpuk', 'menimbun', 'melontarkan'].includes(subcmd)) {
                    pengaturan[namaPenguatan][subcmd] = subargs;
                } else if (subcmd === 'MenangkapBasah' && subargs[0] === '#debug') {
                    pengaturan[namaPenguatan].debug = true;
                }
            }
        }

        else if (type === 'metode') {
            const namaMetode = subTokens[1]?.replace(/[:,]/g, '');
            if (!namaMetode) {
                console.warn('Metode tanpa nama ditemukan.');
                continue;
            }

            const isiMetode = (subBody ?? []).map(n => n.tokens.join(' ')).join('\n');
            metode[namaMetode] = isiMetode;
        }

        else {
            console.warn(`Perintah '${type}' tidak dikenali dalam kelas.`);
        }
    }

    console.log(`Kelas '${namaKelas}' berhasil dibuat${parentKelas ? ` (mewarisi '${parentKelas}')` : ''}.`);
    console.log(`Atribut:`, atribut);
    console.log(`Instance:`, instance);
    console.log(`Pengaturan:`, pengaturan);
    console.log(`Metode:`, Object.keys(metode));
}

kelas.isBlock = true;
module.exports = { kelas };

