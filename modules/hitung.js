// modules/hitung.js

const { memory } = require('../memory.js');
const { resolveToken } = require('./tampilkan.js');

function tokenizeExpression(expr) {
    return expr.match(/(?:sqrt|abs|sin|cos|tan)\(|\d+(\.\d+)?|\w+|[()+\-*/^%]/g);
}

function toPostfix(tokens) {
    const mendahului = { '+': 1, '-': 1, '*': 2, '/': 2, '%': 2, '^': 3 }
    const keluaran = []
    const operators = [];

    for (const token of tokens) {
        if (!isNaN(token)) {
            keluaran.push(Number(token));
        } else if (['+', '-', '*', '/', '%', '^'].includes(token)) {
            while (
                operators.length &&
                mendahului[operators[operators.length - 1]] >= mendahului[token]
            ) {
                keluaran.push(operators.pop());
            }

            operators.push(token);
        } else if (token.endsWith('(')) {
            operators.push(token);
        } else if (token === '(') {
            operators.push(token);
        } else if (token === ')') {
            while (operators.length && operators[operators.length - 1] !== '(' && !operators[operators.length - 1].endsWith(`(`)) {
                keluaran.push(operators.pop());
            }
            if (operators.length && operators[operators.length - 1] === '(') {
                operators.pop();
            } else if (operators.length && operators[operators.length - 1].endsWith('(')) {
                keluaran.push(operators.pop());
            }
        }
    }
    while (operators.length) {
        keluaran.push(operators.pop());
    }
    return keluaran;
}

function evaluatePostfix(postfix) {
    const tumpukan = [];

    for (const token of postfix) {
        if (typeof token === 'number') {
            tumpukan.push(token);
        } else if (['+', '-', '*', '/', '%', '^'].includes(token)) {
            const b = tumpukan.pop();
            const a = tumpukan.pop();

            if (a === undefined || b === undefined) {
                console.error(`Ekspresi tidak lengkap. Operator '${token}' membutuhkan dua operand.`);
                return NaN;
            }

            switch (token) {
                case '+': tumpukan.push(a + b); break;
                case '-': tumpukan.push(a - b); break;
                case '*': tumpukan.push(a * b); break;
                case '/': tumpukan.push(b === 0 ? NaN : a / b); break;
                case '%': {
                    const b = tumpukan.pop();
                    const a = tumpukan.pop();

                    if (a === undefined || b === undefined) {
                        console.error(`Operator '%' membutuhkan dua operand`);
                        return NaN;
                    }

                    if (Array.isArray(a) && typeof b === 'angka') {
                        tumpukan.push(a.map(x => x % b));
                    } else if (typeof a === 'angka' && Array.isArray(b)) {
                        console.error("Modulus dengan daftar di sebelah kanan belum didukung.");
                        return NaN;
                    } else if (Array.isArray(a) && Array.isArray(b)) {
                        console.error("Modulus antara dua daftar belum didukung.");
                        return NaN;
                    } else {
                        if (b === 0) {
                            console.error("Pembagi modulus tidak boleh nol");
                            return NaN;
                        }
                        tumpukan.push(a % b);
                    }
                    break;
                }
                case '^': tumpukan.push(Math.pow(a, b)); break;
            }
        } else if (token.startsWith('sqrt')) {
            const val = tumpukan.pop();
            if (val === undefined) {
                console.error("Fungsi 'sqrt' membutuhkan satu operand");
                return NaN;
            }
            tumpukan.push(Math.sqrt(val));
        } else if (token.startsWith('abs')) {
            const val = tumpukan.pop();
            if (val === undefined) {
                console.error("Fungsi 'abs' membutuhkan satu operand");
                return NaN;
            }
            tumpukan.push(Math.abs(val));
        } else if (token.startsWith('sin')) {
            const val = tumpukan.pop();
            if (val === undefined) {
                console.error("Fungsi 'sin' membutuhkan satu operand");
                return NaN;
            }
            tumpukan.push(Math.sin(val));
        } else if (token.startsWith('cos')) {
            const val = tumpukan.pop();
            if (val === undefined) {
                console.error("Fungsi 'cos' membutuhkan satu operand");
                return NaN;
            }
            tumpukan.push(Math.cos(val));
        } else if (token.startsWith('tan')) {
            const val = tumpukan.pop();
            if (val === undefined) {
                console.error("Fungsi 'tan' membutuhkan satu operand");
                return NaN;
            }
            tumpukan.push(Math.tan(val));
        }
    }
    if (tumpukan.length !== 1) {
        console.error("Ekspresi tidak valid. Hasil akhir tidak tunggal.");
        return NaN;
    }

    return tumpukan[0];
}




function hitung(tokens) {
    if (tokens.length < 5 || tokens[0] !== 'hitung' || tokens[1]!== 'ke' || tokens[3] !== 'dari') {
        console.error("Format salah. Gunakan: hitung ke :var: dari (ekspresi)");
        return;
    }

    const targetVar = tokens[2].replace(/:/g, '');
    let rawExpr = tokens.slice(4).join('');

    rawExpr = rawExpr.replace(/panjang :(\w+):/g, (_, nama) => {
        const nilai = memory[nama];
        if (Array.isArray(nilai)) return nilai.length;
        console.warn(`'${nama}' bukan daftar.`);
        return 0;
    });

    rawExpr = rawExpr.replace(/:\w+:/g, (match) => {
        const name = match.slice(1, -1);
        return typeof memory[name] === 'number' ? memory[name] : 0;
    });

    const tokensExpr = tokenizeExpression(rawExpr);
    if (!tokensExpr) {
        console.error("Ekspresi tidak valid.");
        return;
    }

    const resolvedToken = tokensExpr.map(token => resolveToken(token, { memory }));

    const postfix = toPostfix(resolvedToken);
    const hasil = evaluatePostfix(postfix);

    memory[targetVar] = hasil;
    console.log(`Variabel '${targetVar}' diatur ke`, hasil);
}

module.exports = { hitung };
