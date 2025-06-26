// pemroses.js

async function runEarl(code, customModules = modules, parentContext) {
    const lines = code.trim().split('\n');
    const context = parentContext ?? { index: 0, lines, lingkup: [{}] };

    if (!parentContext) {
        context.lines = lines;
    }

    while (context.index < context.lines.length) {
        const line = context.lines[context.index].trim();
        const tokens = customModules.tokenize(line);

        if (!tokens || tokens.length === 0) {
            context.index++;
            continue;
        }

        const cmd = tokens[0];

        if (customModules[cmd]) {
            try {
                await customModules[cmd](tokens, customModules, context);
            } catch (err) {
                console.error(`Kesalahan saat menjalankan perintah '${cmd}' di baris ${context.index + 1}:`, err.message);
            }
        } else {
            console.error(`Modul tidak dikenali: '${cmd}' di baris ${context.index + 1}`);
        }

        context.index++;
    }
}
