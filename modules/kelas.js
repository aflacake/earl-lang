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

        if (type === 'atribut') {
            // Menambahkan atribut ke kelas
            const atributNames = subTokens.slice(1);
            atribut.push(...atributNames);
        }

        else if (type === 'metode') {
            const namaMetode = subTokens[1]?.replace(/[:,]/g, '');
            if (!namaMetode) {
                console.warn('Metode tanpa nama ditemukan.');
                continue;
            }

            const isiMetode = (subBody ?? []).map(n => n.tokens.join(' ')).join('\n');

            if (isiMetode.includes('tampilkan')) {
                metode[namaMetode] = `function ${namaMetode}() {\n  console.log('Output dari metode ${namaMetode}:', ${isiMetode});\n}`;
            } else {
                metode[namaMetode] = isiMetode;
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

