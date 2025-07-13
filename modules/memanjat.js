// modules/memanjat.js

const { runEarl } = require('../penjalankan');

async function memanjat(tokens, modules, context) {
    console.log("Mulai memanjat...");

    for (const line of context.lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        try {
            await runEarl(trimmed, modules, context);
        } catch (err) {
            console.error(`Kesalahan saat memanjat baris: "${trimmed}"`, err.message);
        }
    }

    console.log("Selesai memanjat!");
}

memanjat.isBlock = true;
module.exports = { memanjat };
