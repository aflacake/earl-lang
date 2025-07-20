// modules/memanjat.js

const { runEarl } = require('../penjalankan');

async function memanjat(tokens, modules, context) {
    console.log("Mulai memanjat...");

    if (!context.lines || !Array.isArray(context.lines)) {
        console.error("Context tidak memiliki properti 'lines' berupa array.");
        return;
    }

    const blockCode = context.lines.join('\n');

    try {
        const nestedContext = {
            ...context,
            lines: context.lines,
            index: 0,
            lingkup: [...(context.lingkup || [{}])],
            memory: context.memory || {},
        };

        await runEarl(blockCode, modules, nestedContext);
        if (!context.log) context.log = [];
        context.log.push({ block: blockCode, result: 'Berhasil' });

    } catch (err) {
        console.error(`Kesalahan saat menjalankan blok memanjat:`, err.message || err);
        if (!context.log) context.log = [];
        context.log.push({ block: blockCode, error: err.message || err });
        return;
    }

    console.log("Selesai memanjat!");
}

memanjat.isBlock = true;

module.exports = { memanjat };
