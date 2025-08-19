// modules/kelas.js

const { memory } = require('../memory.js');
const { setTokenNilai, validasiIndeks, validasiNumerik } = require('../utili');

async function setAtributContoh(namaKelas, jalurToken, nilaiBaru) {
    const kelas = memory[namaKelas];
    if (!kelas) {
        console.warn(`Kelas '${namaKelas}' tidak ditemukan.`);
        return false;
    }

    if (jalurToken.length > 1) {
        const indeks = Number(jalurToken[1]);
        if (!validasiIndeks(kelas.instance[jalurToken[0]], indeks)) {
            console.warn(`Indeks ${indeks} di luar batas atribut '${jalurToken[0]}' pada kelas '${namaKelas}'.`);
            return false;
        }
    }

    if (typeof nilaiBaru === 'number') {
        if (!validasiNumerik(nilaiBaru, 0, 100)) {
            console.warn(`Nilai ${nilaiBaru} di luar batas yang diizinkan.`);
            return false;
        }
    }

    return setTokenNilai(jalurToken, kelas.instance, nilaiBaru);
}

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
            const atributNames = subTokens.slice(1);

            for (const attr of atributNames) {
                if (/^\d+$/.test(attr)) {
                    const idks = Number (attr);
                    if (!validasiIndeks(atribut, idks)) {
                        console.warn(`Indeks atribut '${idks}' diluar batas.`);
                        continue;
                    }
                }
                atribut.push(attr);

                if (!(attr in instance)) {
                    const namaAttr = attr.replace(/:/g, '');
                    instance[namaAttr] = null;
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

            if (isiMetode.includes('tampilkan')) {
                metode[namaMetode] = `function ${namaMetode}() {\n  console.log('Output dari metode ${namaMetode}:', ${isiMetode});\n}`;
            } else {
                metode[namaMetode] = isiMetode;
            }
        }
    }

    console.log(`Kelas '${namaKelas}' berhasil dibuat${parentKelas ? ` (mewarisi '${parentKelas}')` : ''}.`);
    console.log(`Atribut:`, atribut);
    console.log(`Instance:`, instance);
    console.log(`Pengaturan:`, pengaturan);
    console.log(`Metode:`, Object.keys(metode));
}

kelas.isBlock = true;
module.exports = { kelas, setAtributContoh };
