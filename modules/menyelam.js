// modules/menyelam.js

const { parse } = require('../parser');
const { laksanakanAST } = require('../pelaksana-ast');

async function menyelam(tokens, modules, context) {
    let code = tokens.slice(1).join(" ");

    if (context.currentNode?.body) {
        code = context.currentNode.body.map(n => n.tokens.join(" ")).join("\n");
    }

    console.log("=== MODE MENYELAM (DEBUG) ===");
    console.log("Kode yang akan dieksekusi:\n", code);
    console.log("=============================");

    try {
        const ast = parse(code);
        console.log("AST terbentuk:", JSON.stringify(ast, null, 2));

        const debugContext = {
            ...context,
            index: 0,
            lines: code.split("\n"),
            currentNode: null,
        };

        for (const node of ast) {
            console.log(`Menjalankan node:`, node.type, node.tokens);
            debugContext.currentNode = node;

            const handler = modules[node.type];
            if (!handler) {
                console.warn(`Modul '${node.type}' tidak dikenali.`);
                continue;
            }

            try {
                await handler(node.tokens, modules, debugContext);
                console.log(`Node '${node.type}' selesai.`);
            } catch (err) {
                console.error(`Error pada node '${node.type}':`, err.message);
            }
        }

        console.log("=== SELESAI MENYELAM ===");
    } catch (err) {
        console.error("Gagal menyelam:", err.message);
    }
}

menyelam.isBlock = true;
module.exports = { menyelam };
