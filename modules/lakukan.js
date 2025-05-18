// modules/lakukan.js

async function lakukan(tokens, modules, context) {
    const line = context.lines[context.index].trim();

    if (!line.includes('(')) {
        const command = tokens.slice(1).join(' ');
        if (!command) {
            console.error(`Tidak ada perintah untuk 'lakukan' dibaris ${context.index + 1}`);
            return;
        }
        context.lines.splice(context.index + 1, 0, command);
        return;
    }

    const blockLines = [];
    context.index++;

    while (context.index < context.lines.length) {
        const currentLine = context.lines[context.index].trim();

        if (currentLine === ')') {
            break;
        }
        blockLines.push(currentLine);
        context.index++;
    }
    context.lines.splice(context.index + 1, 0, ...blockLines);
}

module.exports = { lakukan };
