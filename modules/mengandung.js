// modules/mengandung.js

function mengandung(tokens, modules, context) {
    if (tokens.length < 3) {
        console.error("Perintah 'mengandung' membutuhkan dua argumen: sumber dan nilai yang dicari.");
        return;
    }

    const sumberToken = tokens[1];
    const cariToken = tokens[2];

    const { resolveToken } = modules;
    if (!resolveToken) {
        console.error("Modul 'resolveToken' tidak ditemukan.");
        return;
    }

    const sumber = resolveToken(sumberToken, context, modules);
    const cari = resolveToken(cariToken, context, modules);

    if (typeof sumber !== 'string' && !Array.isArray(sumber)) {
        console.error("Tipe sumber tidak mendukung untuk operasi 'mengandung'. Harus string atau array.");
        return;
    }

    if (cari === undefined) {
        console.error("Nilai yang dicari tidak ditemukan.");
        return;
    }

    let hasil = false;

    if (typeof sumber === 'string') {
        hasil = sumber.includes(cari);
    } else if (Array.isArray(sumber)) {
        hasil = sumber.some(element => {
            return String(element).trim() === String(cari).trim();
        });
    }

    console.log(hasil);
}

mengandung.isBlock = false;

module.exports = { mengandung };
