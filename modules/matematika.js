// modules/matematika.js

const { memory } = require('../memory');

async function matematika(tokens) {
    const operasi = tokens[1];

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

    switch (operasi) {
        case 'mod': {
            const a = ambilNilai(tokens[2]);
            const b = ambilNilai(tokens[3]);
            if (isNaN(a) || isNaN(b)) {
                console.error('Gunakan angka atau variabel angka untuk operasi mod.');
                return;
            }
            console.log(a % b);
            break;
        }

        case 'akar': {
            const x = ambilNilai(tokens[2]);
            if (isNaN(x)) {
                console.error('Nilai tidak valid untuk akar.');
                return;
            }
            console.log(Math.sqrt(x));
            break;
        }

        case 'bulatkan': {
            const x = ambilNilai(tokens[2]);
            if (isNaN(x)) {
                console.error('Nilai tidak valid untuk pembulatan.');
                return;
            }
            console.log(Math.round(x));
            break;
        }

        case 'lantai': {
            const x = ambilNilai(tokens[2]);
            if (isNaN(x)) {
                console.error('Nilai tidak valid.');
                return;
            }
            console.log(Math.floor(x));
            break;
        }

        case 'plafon': {
            const x = ambilNilai(tokens[2]);
            if (isNaN(x)) {
                console.error('Nilai tidak valid.')
                return;
            }
            console.log(Math.ceil(x));
            break;
        }

        case 'acak': {
            const min = ambilNilai(tokens[2]) || 0;
            const max = ambilNilai(tokens[3]) || 100;
            if(isNaN(min) || isNaN(max)) {
                console.error("Nilai acak harus angka.");
                return;
            }
            const hasil = Math.floor(Math.random() * (max - min + 1)) + min;
            console.log(hasil);
            break;
        }

        case 'mutlak': {
            const x = ambilNilai(tokens[2]);
            if (isNaN(x)) {
                console.error("Nilai tidak valid.");
                return;
            }
            console.log(Math.abs(x));
            break;
        }
        default:
            console.error(`Perintah matematika '${operasi}' tidak dikenali.`);
    }
}

module.exports = { matematika };
