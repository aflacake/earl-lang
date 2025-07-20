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

    for (const line of context.lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed === 'selesai') continue;

        try {
            await runEarl(trimmed, modules, context);

            context.log.push({ line: trimmed, result: 'Berhasil' });
        } catch (err) {
            console.error(`Kesalahan saat memanjat baris: "${trimmed}"`, err.message || err);
            break;
        }
    }

    console.log("Selesai memanjat!");
}

memanjat.isBlock = true;

module.exports = { memanjat };
