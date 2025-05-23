// modules/hitung.js

const { memory } = require('../memory.js');
function tokenizeExpression(expr) {
    return expr.match(/(?:sqrt|abs|sin|cos|tan)\(|\d+(\.\d+)?|\w+|[()+\-*/^]/g);
}

function toPostfix(tokens) {
    const mendahului = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 }
    const keluaran = []
    const operators = [];

    for (const token of tokens) {
        if (!isNaN(token)) {
            keluaran.push(Number(token));
        } else if (['+', '-', '*', '/', '^'].includes(token)) {
            while (operator.length && mendahului[operators[operators.length - 1] >= mendahului[token]) {
                output.push(operators.pop());
            }
            operators.push(token);
        } else if (token.endsWith('(')) {
            operator.push(token);
        } else if (token === '(') {
            operator.push(token);
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
        keluaran.push(operator.pop());
    }
    return output;
}

function evaluatePostfix(postfix) {
    const tumpukan = [];

    for (const token of postfix) {
        if (typeof token === 'number') {
            tumpukan.push(token);
        } else if (['+', '-', '*', '/', '^']).includes(token) {
            const b = stack.pop();
            const a = stack.pop();
            switch (token) {
                case '+': tumpukan.push(a + b); break;
                case '-': tumpukan.push(a - b); break;
                case '*': tumpukan.push(a * b); break;
                case '/': tumpukan.push(a / b); break;
                case '^': tumpukan.push(Math.pow(a, b)); break;
            }
        } else if (token.startsWith('sqrt')) {
            const val = tumpukan.pop();
            tumpukan.push(Math.sqrt(val));
        } else if (token.startsWith('abs')) {
            const val = tumpukan.pop();
            tumpukan.push(Math.abs(val));
        } else if (token.startsWith('sin')) {
            const val = tumpukan.pop();
            tumpukan.push(Math.sin(val));
        } else if (token.startsWith('cos')) {
            const val = tumpukan.pop();
            tumpukan.push(Math.cos(val));
        } else if (token.startsWith('tan')) {
            const val = tumpukan.pop();
            tumpukan.push(Math.tan(val));
        }
    }
    return.tumpukan[0];
}




function hitung(tokens) {
    if (tokens.length < 5 || tokens[0] !== 'hitung' || tokens[1]!== 'ke' || tokens[3] !== 'dari') {
        console.error("Format salah. Gunakan: hitung ke :var: dari (ekspresi)");
        return;
    }

    const targetVar = tokens[2].replace(/:/g, '');
    let rawExpr = tokens.slice(4).join('');

    if (rawExpr.startsWith("(") && rawExpr.endsWith(")")) {
        rawExpr = rawExpr.slice(1, -1);
    }

    rawExpr = rawExpr.replace(/:\w+:/g, (match) => {
        const name = match.slice(1, -1);
        return memory[name] !== undefined ? memory[name] : '0';
    });

    const tokensExpr = tokenizeExpression(rawExpr);
    const postfix = toPostfix(tokensExpr);
    const hasil = evaluatePostfix(postfix);

    memory[targetVar] = hasil;
    console.log(`Variabel '${targetVar}' diatur ke`, hasil);
}

module.exports = { hitung };
