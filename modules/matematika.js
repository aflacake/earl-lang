// modules/matematika.js

const { memory } = require('../memory.js');
const { resolveToken } = require('./tampilkan.js');

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
            memory[targetVar] = hasil;
            return null;
        } else {
            return hasil;
        }
    };

    switch (operasi) {
        case 'mod': {
            const a = ambilNilai(tokens[offset + 1]);
            const b = ambilNilai(tokens[offset + 2]);
            if (isNaN(a) || isNaN(b)) return console.error('Gunakan angka atau variabel angka untuk operasi mod.');
            simpanAtauTampilkan(a % b);
            break;
        }

        case 'akar': {
            const x = ambilNilai(tokens[offset + 1]);
            if (isNaN(x)) return console.error('Nilai tidak valid untuk akar.');
            const hasil = Math.sqrt(x);
            const output = simpanAtauTampilkan(hasil);
            if (output !== null) console.log(output);
            break;
        }

        case 'bulatkan': {
            const x = ambilNilai(tokens[offset + 1]);
            if (isNaN(x)) return console.error('Nilai tidak valid untuk pembulatan.');
            simpanAtauTampilkan(Math.round(x));
            break;
        }

        case 'lantai': {
            const x = ambilNilai(tokens[offset + 1]);
            if (isNaN(x)) return console.error('Nilai tidak valid.');
            simpanAtauTampilkan(Math.floor(x));
            break;
        }

        case 'plafon': {
            const x = ambilNilai(tokens[offset + 1]);
            if (isNaN(x)) return console.error('Nilai tidak valid.')
            simpanAtauTampilkan(Math.ceil(x));
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
            simpanAtauTampilkan(hasil);
            break;
        }

        case 'mutlak': {
            const x = ambilNilai(tokens[offset + 1]);
            if (isNaN(x)) return console.error("Nilai tidak valid.");
            simpanAtauTampilkan(Math.abs(x));
            break;
        }

        // Operasi matematika dasar
        case 'tambah': {
            const a = ambilNilai(tokens[offset + 1]);
            const b = ambilNilai(tokens[offset + 2]);
            if (isNaN(a) || isNaN(b)) return console.error('Gunakan angka yang valid untuk tambah.');
            simpanAtauTampilkan(a + b);
            break;
        }

        case 'kurang': {
            const a = ambilNilai(tokens[offset + 1]);
            const b = ambilNilai(tokens[offset + 2]);
            if (isNaN(a) || isNaN(b)) return console.error('Gunakan angka yang valid untuk kurang.');
            simpanAtauTampilkan(a - b);
            break;
        }

        case 'kali': {
            const a = ambilNilai(tokens[offset + 1]);
            const b = ambilNilai(tokens[offset + 2]);
            if (isNaN(a) || isNaN(b)) return console.error('Gunakan angka yang valid untuk kali.');
            simpanAtauTampilkan(a * b);
            break;
        }

        case 'bagi': {
            const a = ambilNilai(tokens[offset + 1]);
            const b = ambilNilai(tokens[offset + 2]);
            if (isNaN(a) || isNaN(b) || b === 0) return console.error('Pembagian tidak valid.');
            simpanAtauTampilkan(a / b);
            break;
        }

        case 'pangkat': {
            const base = ambilNilai(tokens[offset + 1]);
            const exponent = ambilNilai(tokens[offset + 2]);
            if (isNaN(base) || isNaN(exponent)) return console.error('Gunakan angka yang valid untuk pangkat.');
            simpanAtauTampilkan(Math.pow(base, exponent));
            break;
        }

        // Fitur lanjutan
        case 'log': {
            const x = ambilNilai(tokens[offset + 1]);
            if (isNaN(x) || x <= 0) return console.error("Nilai log harus positif.");
            simpanAtauTampilkan(Math.log(x));
            break;
        }

        case 'sin': {
            const x = ambilNilai(tokens[offset + 1]);
            if (isNaN(x)) return console.error("Nilai tidak valid.");
            simpanAtauTampilkan(Math.sin(x));
            break;
        }

        case 'cos': {
            const x = ambilNilai(tokens[offset + 1]);
            if (isNaN(x)) return console.error("Nilai tidak valid.");
            simpanAtauTampilkan(Math.cos(x));
            break;
        }

        case 'tan': {
            const x = ambilNilai(tokens[offset + 1]);
            if (isNaN(x)) return console.error("Nilai tidak valid.");
            simpanAtauTampilkan(Math.tan(x));
            break;
        }

        case 'pi': {
            simpanAtauTampilkan(Math.PI);
            break;
        }

        case 'akarKubik': {
            const x = ambilNilai(tokens[offset + 1]);
            if (isNaN(x)) return console.error('Nilai tidak valid untuk akar kubik.');
            simpanAtauTampilkan(Math.cbrt(x));
            break;
        }

        case 'akarKeN': {
            const x = ambilNilai(tokens[offset + 1]);
            const n = ambilNilai(tokens[offset + 2]);
            if (isNaN(x) || isNaN(n) || n === 0) return console.error('Nilai atau pangkat tidak valid.');
            simpanAtauTampilkan(Math.pow(x, 1 / n));
            break;
        }

        case 'faktorial': {
            const n = ambilNilai(tokens[offset + 1]);
            if (isNaN(n) || n < 0) return console.error('Faktorial hanya dapat dihitung untuk angka positif.');
            let hasil = 1;
            for (let i = 1; i <= n; i++) {
                hasil *= i;
            }
            simpanAtauTampilkan(hasil);
            break;
        }

        case 'modulus': {
            const a = ambilNilai(tokens[offset + 1]);
            const b = ambilNilai(tokens[offset + 2]);
            if (isNaN(a) || isNaN(b)) return console.error('Nilai tidak valid untuk modulus.');
            simpanAtauTampilkan(Math.abs(a - b));
            break;
        }

        case 'sec': {
            const x = ambilNilai(tokens[offset + 1]);
            if (isNaN(x)) return console.error("Nilai tidak valid.");
            simpanAtauTampilkan(1 / Math.cos(x));
            break;
        }

        case 'csc': {
            const x = ambilNilai(tokens[offset + 1]);
            if (isNaN(x)) return console.error("Nilai tidak valid.");
            simpanAtauTampilkan(1 / Math.sin(x));
            break;
        }

        case 'cot': {
            const x = ambilNilai(tokens[offset + 1]);
            if (isNaN(x)) return console.error("Nilai tidak valid.");
            simpanAtauTampilkan(1 / Math.tan(x));
            break;
        }

        case 'derajatKeRadian': {
            const deg = ambilNilai(tokens[offset + 1]);
            if (isNaN(deg)) return console.error("Nilai derajat tidak valid.");
            simpanAtauTampilkan(deg * Math.PI / 180);
            break;
        }

        case 'radianKeDerajat': {
            const rad = ambilNilai(tokens[offset + 1]);
            if (isNaN(rad)) return console.error("Nilai radian tidak valid.");
            simpanAtauTampilkan(rad * 180 / Math.PI);
            break;
        }

        case 'log2': {
            const x = ambilNilai(tokens[offset + 1]);
            if (isNaN(x) || x <= 0) return console.error("Nilai log2 harus lebih besar dari 0.");
            simpanAtauTampilkan(Math.log2(x));
            break;
        }

        case 'log10': {
            const x = ambilNilai(tokens[offset + 1]);
            if (isNaN(x) || x <= 0) return console.error("Nilai log10 harus lebih besar dari 0.");
            simpanAtauTampilkan(Math.log10(x));
            break;
        }

        default:
            console.error(`Perintah matematika '${operasi}' tidak dikenali.`);
    }
}

module.exports = { matematika };
