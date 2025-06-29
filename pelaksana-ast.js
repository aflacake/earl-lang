// pelaksana-ast.js

async function laksanakanAST(ast, modules, context) {
    for (const node of ast) {
        const { type, tokens } = node;
        const handler = modules[type];
        if (!handler) {
            console.error(`Modul tidak dikenali: '${type}'`);
            continue;
        }
        try {
            context.currentNode = node;
            const result = await handler(tokens, modules, newContent);

            if (result !== undefined) {
                console.log(result);
            }
        } catch (err) {
            console.error(`Kesalahan saat menjalankan '${type}':`, err.message);
        }

        if (context.berhenti || context.lanjutkan) break;
    }
}

module.exports = { laksanakanAST };
