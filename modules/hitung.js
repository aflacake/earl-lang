// modules/hitung.js

const { memory } = require('../memory.js');

function hitung(tokens) {
    const varName = tokens[2].slice(1, -1);
    const expressionTokens = tokens.slice(4);

    let rawExpr = expressionTokens.join("");
    if (rawExpr.startsWith("(") && rawExpr.endsWith(")")) {
        rawExpr = rawExpr.slice(1, -1);
    }

    const replacedExpr= rawExpr.replace(/:\w+:/g, (match) => {
        const name = match.slice(1, -1);
        const value = memory[name];
        return value !== undefined ? value : "0";
    });

    try {
        const result = eval(replacedExpr);
        memory[varName] = result;
    } catch (err) {
        console.error("Gagal menghitung: ", err.message);
    }
}
module.export = { hitung };
