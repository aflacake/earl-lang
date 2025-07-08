// modules/mencairkan.js

function cairkanTeks(tokens, modules, context) {
    let nilai = tokens[1];
    if (typeof nilai === 'string') {
        if (nilai.startsWith('"') && nilai.endsWith('"')) {
            nilai = nilai.slice(1, -1);
        }

        const angka = parseFloat(nilai);
        if (!isNaN(angka)) {
            console.log(angka);
        } else {
            console.error(`Tidak bisa mengonversi '${nilai}' menjadi angka.`);
        }
    } else {
        console.error(`Harap memberikan teks sebagai input untuk perintah 'cairkanTeks'.`);
    }
}

function cairkanAngka(tokens, modules, context) {
    let nilai = tokens[1];

    if (typeof nilai === 'string') {
        const angka = Number(nilai);
        if (!isNaN(angka)) {
            nilai = angka;
        } else {
            console.error(`Harap memberikan angka sebagai input untuk perintah 'cairkanAngka'.`);
            return;
        }
    }

    if (typeof nilai === 'number') {
        const str = nilai.toString();
        console.log(str);
    } else {
        console.error(`Harap memberikan angka sebagai input untuk perintah 'cairkanAngka'.`);
    }
}


module.exports = {
    cairkanTeks,
    cairkanAngka
}
