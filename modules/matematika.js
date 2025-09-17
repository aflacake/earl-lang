// modules/matematika.js

const { memory } = require('../memory.js');
const { resolveToken } = require('./tampilkan.js');
const { validasiNumerik } = require('../utili');

async function matematika(tokens, modules, context = {}) {
    let targetVar = null;
    let offset = 1;

    if (tokens[1]?.startsWith(':') && tokens[1]?.endsWith(':')) {
        targetVar = tokens[1].slice(1, -1);
        offset = 2;
    }

    const operasi = tokens[offset];

    const ambilNilai = (token) => {
        const hasil = resolveToken(token, context);
        const angka = Number(hasil);
        return isNaN(angka) ? NaN : angka;
    };

    const simpanAtauTampilkan = (hasil) => {
        if (targetVar) {
            if (context?.lingkup?.length > 0) {
                const scope = context.lingkup[context.lingkup.length - 1];
                scope[targetVar] = hasil;
            } else {
                memory[targetVar] = hasil;
            }
            return null;
        } else {
            return hasil;
        }
    };

    function simpanAtauTampilkanDenganValidasi(hasil) {
        if (!validasiNumerik(hasil)) {
            console.error("Terjadi underflow atau overflow. Hasil tidak valid");
            return null;
        }
        return simpanAtauTampilkan(hasil);
    }

    switch (operasi) {
        case 'mod': {
            const a = ambilNilai(tokens[offset + 1]);
            const b = ambilNilai(tokens[offset + 2]);
            if (isNaN(a) || isNaN(b)) return console.error('Gunakan angka atau variabel angka untuk operasi mod.');
            const hasil = a % b;
            const output = simpanAtauTampilkanDenganValidasi(hasil);
            if (output !== null) console.log(output);
            break;
        }

        case 'akar': {
            const x = ambilNilai(tokens[offset + 1]);
            if (isNaN(x)) return console.error('Nilai tidak valid untuk akar.');
            const hasil = Math.sqrt(x);
            const output = simpanAtauTampilkanDenganValidasi(hasil);
            if (output !== null) console.log(output);
            break;
        }

        case 'bulatkan': {
            const x = ambilNilai(tokens[offset + 1]);
            if (isNaN(x)) return console.error('Nilai tidak valid untuk pembulatan.');
            const hasil = Math.round(x);
            const output = simpanAtauTampilkanDenganValidasi(hasil);
            if (output !== null) console.log(output);
            break;
        }

        case 'lantai': {
            const x = ambilNilai(tokens[offset + 1]);
            if (isNaN(x)) return console.error('Nilai tidak valid.');
            const hasil = Math.floor(x);
            const output = simpanAtauTampilkanDenganValidasi(hasil);
            if (output !== null) console.log(output);
            break;
        }

        case 'plafon': {
            const x = ambilNilai(tokens[offset + 1]);
            if (isNaN(x)) return console.error('Nilai tidak valid.');
            const hasil = Math.ceil(x);
            const output = simpanAtauTampilkanDenganValidasi(hasil);
            if (output !== null) console.log(output);
            break;
        }

        case 'acak': {
            const minRaw = ambilNilai(tokens[offset + 1]);
            const maxRaw = ambilNilai(tokens[offset + 2]);
            const min = isNaN(minRaw) ? 0 : minRaw;
            const max = isNaN(maxRaw) ? 100 : maxRaw;

            if (isNaN(min) || isNaN(max)) {
                console.error("Nilai acak harus angka.");
                return;
            }
            const hasil = Math.floor(Math.random() * (max - min + 1)) + min;
            const output = simpanAtauTampilkanDenganValidasi(hasil);
            if (output !== null) console.log(output);
            break;
        }

        case 'mutlak': {
            const x = ambilNilai(tokens[offset + 1]);
            if (isNaN(x)) return console.error("Nilai tidak valid.");
            const hasil = Math.abs(x);
            const output = simpanAtauTampilkanDenganValidasi(hasil);
            if (output !== null) console.log(output);
            break;
        }

        // Operasi matematika dasar
        case 'tambah': {
            const a = ambilNilai(tokens[offset + 1]);
            const b = ambilNilai(tokens[offset + 2]);
            if (isNaN(a) || isNaN(b)) return console.error('Gunakan angka yang valid untuk tambah.');
            const hasil = a + b;
            const output = simpanAtauTampilkanDenganValidasi(hasil);
            if (output !== null) console.log(output);
            break;
        }

        case 'kurang': {
            const a = ambilNilai(tokens[offset + 1]);
            const b = ambilNilai(tokens[offset + 2]);
            if (isNaN(a) || isNaN(b)) return console.error('Gunakan angka yang valid untuk kurang.');
            const hasil = a - b;
            const output = simpanAtauTampilkanDenganValidasi(hasil);
            if (output !== null) console.log(output);
            break;
        }

        case 'kali': {
            const a = ambilNilai(tokens[offset + 1]);
            const b = ambilNilai(tokens[offset + 2]);
            if (isNaN(a) || isNaN(b)) return console.error('Gunakan angka yang valid untuk kali.');
            const hasil = a * b;
            const output = simpanAtauTampilkanDenganValidasi(hasil);
            if (output !== null) console.log(output);
            break;
        }

        case 'bagi': {
            const a = ambilNilai(tokens[offset + 1]);
            const b = ambilNilai(tokens[offset + 2]);
            if (isNaN(a) || isNaN(b) || b === 0) return console.error('Pembagian tidak valid.');
            const hasil = a / b;
            const output = simpanAtauTampilkanDenganValidasi(hasil);
            if (output !== null) console.log(output);
            break;
        }

        case 'pangkat': {
            const base = ambilNilai(tokens[offset + 1]);
            const exponent = ambilNilai(tokens[offset + 2]);
            if (isNaN(base) || isNaN(exponent)) return console.error('Gunakan angka yang valid untuk pangkat.');
            const hasil = Math.pow(base, exponent);
            const output = simpanAtauTampilkanDenganValidasi(hasil);
            if (output !== null) console.log(output);
            break;
        }

        // Fitur lanjutan
        case 'log': {
            const x = ambilNilai(tokens[offset + 1]);
            if (isNaN(x) || x <= 0) return console.error("Nilai log harus positif.");
            const hasil = Math.log(x);
            const output = simpanAtauTampilkanDenganValidasi(hasil);
            if (output !== null) console.log(output);
            break;
        }

        case 'sin': {
            const x = ambilNilai(tokens[offset + 1]);
            if (isNaN(x)) return console.error("Nilai tidak valid.");
            const hasil = Math.sin(x);
            const output = simpanAtauTampilkanDenganValidasi(hasil);
            if (output !== null) console.log(output);
            break;
        }

        case 'cos': {
            const x = ambilNilai(tokens[offset + 1]);
            if (isNaN(x)) return console.error("Nilai tidak valid.");
            const hasil = Math.cos(x);
            const output = simpanAtauTampilkanDenganValidasi(hasil);
            if (output !== null) console.log(output);
            break;
        }

        case 'tan': {
            const x = ambilNilai(tokens[offset + 1]);
            if (isNaN(x)) return console.error("Nilai tidak valid.");
            const hasil = Math.tan(x);
            const output = simpanAtauTampilkanDenganValidasi(hasil);
            if (output !== null) console.log(output);
            break;
        }

        case 'pi': {
            const hasil = Math.PI;
            const output = simpanAtauTampilkanDenganValidasi(hasil);
            if (output !== null) console.log(output);
            break;
        }

        case 'sigmaspiral': {
            const hasil = 18.53493733204947;
            const output = simpanAtauTampilkanDenganValidasi(hasil);
            if (output !== null) console.log(output);
            break;
        }

        case 'akarKubik': {
            const x = ambilNilai(tokens[offset + 1]);
            if (isNaN(x)) return console.error('Nilai tidak valid untuk akar kubik.');
            const hasil = Math.cbrt(x);
            const output = simpanAtauTampilkanDenganValidasi(hasil);
            if (output !== null) console.log(output);
            break;
        }

        case 'akarKeN': {
            const x = ambilNilai(tokens[offset + 1]);
            const n = ambilNilai(tokens[offset + 2]);
            if (isNaN(x) || isNaN(n) || n === 0) return console.error('Nilai atau pangkat tidak valid.');
            const hasil = Math.pow(x, 1 / n);
            const output = simpanAtauTampilkanDenganValidasi(hasil);
            if (output !== null) console.log(output);
            break;
        }

        case 'faktorial': {
            const n = ambilNilai(tokens[offset + 1]);
            if (isNaN(n) || n < 0) return console.error('Faktorial hanya dapat dihitung untuk angka positif.');
            let hasil = 1;
            for (let i = 1; i <= n; i++) {
                hasil *= i;
            }
            const output = simpanAtauTampilkanDenganValidasi(hasil);
            if (output !== null) console.log(output);
            break;
        }

        case 'modulus': {
            const a = ambilNilai(tokens[offset + 1]);
            const b = ambilNilai(tokens[offset + 2]);
            if (isNaN(a) || isNaN(b)) return console.error('Nilai tidak valid untuk modulus.');
            const hasil = Math.abs(a - b);
            const output = simpanAtauTampilkanDenganValidasi(hasil);
            if (output !== null) console.log(output);
            break;
        }

        case 'sec': {
            const x = ambilNilai(tokens[offset + 1]);
            if (isNaN(x)) return console.error("Nilai tidak valid.");
            const hasil = 1 / Math.cos(x);
            const output = simpanAtauTampilkanDenganValidasi(hasil);
            if (output !== null) console.log(output);
            break;
        }


        case 'csc': {
            const x = ambilNilai(tokens[offset + 1]);
            if (isNaN(x)) return console.error("Nilai tidak valid.");
            const hasil = 1 / Math.sin(x);
            const output = simpanAtauTampilkanDenganValidasi(hasil);
            if (output !== null) console.log(output);
            break;
        }

        case 'cot': {
            const x = ambilNilai(tokens[offset + 1]);
            if (isNaN(x)) return console.error("Nilai tidak valid.");
            const hasil = 1 / Math.tan(x);
            const output = simpanAtauTampilkanDenganValidasi(hasil);
            if (output !== null) console.log(output);
            break;
        }

        case 'derajatKeRadian': {
            const deg = ambilNilai(tokens[offset + 1]);
            if (isNaN(deg)) return console.error("Nilai derajat tidak valid.");
            const hasil = deg * Math.PI / 180;
            const output = simpanAtauTampilkanDenganValidasi(hasil);
            if (output !== null) console.log(output);
            break;
        }

        case 'radianKeDerajat': {
            const rad = ambilNilai(tokens[offset + 1]);
            if (isNaN(rad)) return console.error("Nilai radian tidak valid.");
            const hasil = rad * 180 / Math.PI;
            const output = simpanAtauTampilkanDenganValidasi(hasil);
            if (output !== null) console.log(output);
            break;
        }

        case 'log2': {
            const x = ambilNilai(tokens[offset + 1]);
            if (isNaN(x) || x <= 0) return console.error("Nilai log2 harus lebih besar dari 0.");
            const hasil = Math.log2(x);
            const output = simpanAtauTampilkanDenganValidasi(hasil);
            if (output !== null) console.log(output);
            break;
        }

        case 'log10': {
            const x = ambilNilai(tokens[offset + 1]);
            if (isNaN(x) || x <= 0) return console.error("Nilai log10 harus lebih besar dari 0.");
            const hasil = Math.log10(x);
            const output = simpanAtauTampilkanDenganValidasi(hasil);
            if (output !== null) console.log(output);
            break;
        }

        default:
            console.error(`Perintah matematika '${operasi}' tidak dikenali.`);
    }
}

module.exports = { matematika };
