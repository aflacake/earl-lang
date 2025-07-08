// modules/mencairkan.js

function cairkanTeks(tokens, modules, context) {
    const nilai = tokens[1];
    if (typeof nilai === 'string') {
        const angka = parseFloat(nilai);
        if (!isNaN(angka)) {
            console.log(angka);
        } else {
            console.error(`Tidak bisa mengonversi '${nilai}' menjadi angka.`);
        }
    } else {
        console.error(`Harap memberikan teks sebagai input untuk perintah 'mencairkan'.`);
    }
}

function cairkanAngka(tokens, modules, context) {
    const nilai = tokens[1];
    if (typeof nilai === 'number') {
        const str = nilai.toString();
        console.log(str);
    } else {
        console.error(`Harap memberikan angka sebagai input untuk perintah 'mencairkan'.`);
    }
}

module.exports = {
    cairkanTeks,
    cairkanAngka
}
