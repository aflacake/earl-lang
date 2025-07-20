// modules/memanjat.js

const { runEarl } = require('../penjalankan');

async function memanjat(tokens, modules, context) {
    if (!context.lines || !Array.isArray(context.lines)) {
        console.error("Context tidak memiliki properti 'lines' berupa array.");
        return;
    }

    if (!context.log) {
        context.log = [];
    }

    console.log("Mulai memanjat...");

    const blokLines = context.lines.filter(line => line.trim() !== 'selesai');

    try {
        await runEarl(blokLines.join('\n'), modules, {
            ...context,
            lines: blokLines,
            index: 0
        });
        context.log.push({ block: blokLines.join('\n'), result: 'Berhasil' });
    } catch (err) {
        console.error(`Kesalahan saat menjalankan blok memanjat:`, err.message || err);
    }

    console.log("Selesai memanjat!");
}

memanjat.isBlock = true;

module.exports = { memanjat };
