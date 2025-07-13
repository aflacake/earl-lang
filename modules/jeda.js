// modules/jeda.js

function jeda(tokens, modules, context) {
    if (tokens.length < 3) {
        console.error("Format salah. Gunakan: jeda <angka> <satuan>");
        return;
    }

    const jumlah = Number(tokens[1]);
    const satuan = tokens[2].toLowerCase();

    if (isNaN(jumlah) || jumlah < 0) {
        console.error("Jumlah waktu harus angka positif.");
        return;
    }

    let md = 0;
    switch (satuan) {
        case 'md':
            md = jumlah;
            break;
        case 'd':
            md = jumlah * 1000;
            break;
        case 'm':
            md = jumlah * 60 * 1000;
            break;
        default:
            console.error("Satuan tidak dikenali. Gunakan 'md' (milidetik), 'd' (detik), atau 'm' (menit).");
            return;
    }

    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, md);
    });
}

jeda.isBlock = false;

module.exports = { jeda };
