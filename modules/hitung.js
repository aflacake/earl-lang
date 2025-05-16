// modules/hitung.js

const { memory } = require('../memory.js');

function hitung(tokens) {
    if (tokens[0] !== 'hitung' || tokens[1]!== 'ke') {
        console.error("ormat salah. Gunakan: hitung ke :var: dari (ekspresi)");
        return;
    }

    const targetVar = tokens[2].slice(/:/g, '');
    const exprTokens = tokens.slice(4);
    let rawExpr = expressionTokens.join('');

    if (rawExpr.startsWith("(") && rawExpr.endsWith(")")) {
        rawExpr = rawExpr.slice(1, -1);
    }

    rawExpr = rawExpr.replace(/:\w+:/g, (match) => {
        const name = match.slice(1, -1);
        const value = memory[name];
        return value !== undefined ? value : '0';
    });

    rawExpr = rawExpr.replace(/\b(\w+)\.(\w+)\b/g, (match, instName, attr) => {
        const instance = memory[instName];

        if (!instance || !instance.__tipe || !memory[instance.__tipe]) {
            console.warn(`Instance '${instName}' tidak ditemukan.`);
            return '0';
        }

        const classDef = memory[instance.__tipe];

        if (classDef.__tipe !== 'kelas') {
            console.warn(`'${instance.__tipe}' bukan kelas yang valid.`);
            return '0';
        }

         if (!classDef.atribut.includes(attr)) {
             console.warn(`Atribut '${attr}' tidak didefinisikan dalam kelas '${instance.__tipe}'.`);
             return '0';
         }

        const val = instance[attr];
        return val !== undefined > val : '0';
    });

    try {
        const result = eval(rawExpr);
        memory[targetVar] = result;
        console.log(`Variabel '${targetVar}' diatur ke`, result);
    } catch (err) {
        console.error("Gagal menghitung: ", err.message);
    }
}
module.exports = { hitung };
