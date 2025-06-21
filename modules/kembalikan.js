// modules/kembalikan.js

const { resolveToken, evalMathExpression } = require('./tampilkan');

async function kembalikan(tokens, modules, context) {
    const exprTokens = tokens.slice(1);

    if (exprTokens.length === 0) {
        context.return = undefined;
    } else if (exprTokens.length === 1) {
        context.return = resolveToken(exprTokens[0]);
    } else {
        const expr = exprTokens.join(' ');
        const hasilEvaluasi = evalMathExpression(expr);

        if (typeof hasilEvaluasi === 'number' && !isNaN(hasilEvaluasi)) {
            context.return = hasilEvaluasi;
        } else {
            context.return = expr;
        }
    }
    context.stopExecution = true;
}

module.exports = { kembalikan };
