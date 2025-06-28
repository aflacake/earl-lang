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
            const newContent = {
                ...context,
                currentNode: node
            };
            await handler(tokens, modules, newContent);
        } catch (err) {
            console.error(`Kesalahan saat menjalankan '${type}':`, err.message);
        }

        if (context.berhenti || context.lanjutkan) break;
    }
}

module.exports = { laksanakanAST };
