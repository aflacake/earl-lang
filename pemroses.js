// pemroses.js

const { parse } = require('./parser');
const { laksanakanAST } = require('./pelaksana-ast')

async function runEarl(code, customModules = modules, parentContext) {
    const lines = code.trim().split('\n');
    const ast = parse(code);
    const context = parentContext ?? { index: 0, lines: [], lingkup: [{}] };
    await laksanakanAST(ast, customModules, context);

    if (!parentContext) context.lines = lines;

    while (context.index < context.lines.length) {
        const line = context.lines[context.index].trim();

        const tokens = customModules.tokenize(line);
        if (!tokens || tokens.length === 0) {
            context.index++;
            continue;
        }

        const cmd = tokens[0];

        if (customModules[cmd]) {
            const handler = customModules[cmd];

            if (handler.isBlock) {
                let blockLines = [];
                context.index++;

                while (context.index < context.lines.length) {
                    const nextLine = context.lines[context.index].trim();
                    if (nextLine === 'selesai') break;
                    blockLines.push(context.lines[context.index]);
                    context.index++;
                }
                context.index++;
                await handler(tokens, customModules, { ...context, lines: blockLines, index: 0 });
            } else {
                try {
                    await handler[cmd](tokens, modules, context);
                } catch (err) {
                    console.error(`Kesalahan saat menjalankan perintah '${cmd}' di baris ${context.index + 1}:`, err.message);
                }
                context.index++;
            }
        } else {
            console.error(`Modul tidak dikenali: '${cmd}' di baris ${context.index + 1}`);
            context.index++;
        }
    }
}
