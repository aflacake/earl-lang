// modules/matematika.js

const { memory } = require('../memory');

async function matematika(tokens) {
    let targetVar = null;
    let offset = 1;

    if (tokens[1]?.startsWith(':') && tokens[1]?.endsWith(':')) {
        targetVar = tokens[1].slice(1, -1);
        offset = 2;
    }

    const operasi = tokens[offset];

    const ambilNilai = (token) => {
        if (token.startsWith(':') && token.endsWith(':')) {
            const nama = token.slice(1, -1);
            return memory[nama];
        } else if (!isNaN(token)) {
            return Number(token);
        } else {
            return NaN;
        }
    };

    const simpanAtauTampilkan = (hasil) => {
        if (targetVar) {
            memory[targetVar] = hasil;
        } else {
            console.log(hasil);
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
            simpanAtauTampilkan(Math.sqrt(x));
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
            const min = ambilNilai(tokens[offset + 1]) || 0;
            const max = ambilNilai(tokens[offset + 2]) || 100;
            if(isNaN(min) || isNaN(max)) return console.error("Nilai acak harus angka.");
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
            simpanAtauTampilkan(Math.pow(base, expoent));
            break;
        }

        // Fitur lanjutan
        case 'log': {
            const x = ambilNilai(tokens[offset + 1]);
            if (isNaN(x) || x <= 0) return console.error("Nilai log harus positif.");
            simpanAtauTampilkan(Math.log(x);
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

        default:
            console.error(`Perintah matematika '${operasi}' tidak dikenali.`);
    }
}

module.exports = { matematika };
