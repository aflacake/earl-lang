// modules/kembalikan.js

const { resolveToken, evalMathExpression } = require('./tampilkan');

async function kembalikan(tokens, modules, context) {
    const exprTokens = tokens.slice(1);

    if (exprTokens.length === 0) {
        context.return = undefined;
    } else if (exprTokens.length === 1) {
        context.return = resolveToken(exprTokens[0], context, modules);
    } else {
        const resolvedExpr = exprTokens.map(token => {
            const val = resolveToken(token, context, modules);
            return typeof val === 'number' || typeof val === 'boolean' ? val : `"${val}"`;
        }).join(' ');

        try {
            const hasilEvaluasi = evalMathExpression(resolvedExpr);
            context.return = hasilEvaluasi;
        } catch {
            context.return = resolvedExpr;
        }
    }

    context.stopExecution = true;
}

module.exports = { kembalikan };

