// modules/lakukan.js

const { memory } = require('../memory');

async function lakukan(tokens, modules, context) {
    const line = context.lines[context.index].trim();

    if (tokens.length === 2 && /^:.*:$/.test(tokens[1])) {
        const key = tokens[1].slice(1, -1);
        const kode = memory[key];

        if (!kode) {
            console.error(`Memori '${tokens[1]}' tidak ditemukan.`);
            return;
        }

        if (typeof kode === 'string') {
            const linesFromMemory = kode.trim().split('\n');
            context.lines.splice(context.index + 1, 0, ...linesFromMemory);
        } else {
            console.error(`Memori '${tokens[1]}' tidak berisi kode yang valid.`);
        }
        return;
    }

    if (!line.includes('(') && line.endsWith(')')) {
        const start = line.indexOf('(');
        const end = line.lastIndexOf(')');
        const inner = line.substring(start + 1, end).trim();

        if (inner) {
            context.lines.splice(context.index + 1, 0, inner);
        }
        return;
    }

    if (line.includes('(')) {
        const blockLines = [];
        context.index++;

        while (context.index < context.lines.length) {
            const currentLine = context.lines[context.index].trim();
            if (currentLine === ')') break;

            blockLines.push(context.lines[context.index]);
            context.index++;
        }

        if (context.index < context.lines.length && context.lines[context.index].trim() === ')') {
            context.index++;
        }

        context.lines.splice(context.index, 0, ...blockLines);
        return;
    }

    const command = tokens.slice(1).join(' ');
    if (command) {
        context.lines.splice(context.index + 1, 0, command);
    }
}

lakukan.isBlock = true;
module.exports = { lakukan };
