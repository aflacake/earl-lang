// pelaksana-ast.js

async function laksanakanAST(ast, modules, context) {
    for (const node of ast) {
        const { type, tokens, body } = node;
        const handler = modules[type];
        if (!handler) {
            console.error(`Modul tidak dikenali: '${type}'`);
            continue;
        }
        try {
            if (body) {
                await handler(tokens, modules, { ...context, lines: body, index: 0 });
            } else {
                await handler(tokens, modules, context);
            }
        } catch (err) {
            console.error(`Kesalahan saat menjalankan '${type}':`, err.message);
        }
    }
}

module.exports = { laksanakanAST };
