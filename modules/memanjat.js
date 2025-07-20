const { runEarl } = require('../penjalankan');

async function memanjat(tokens, modules, context) {
    if (!context.log) context.log = [];

    console.log("Mulai memanjat...");

    if (!context.lines || !Array.isArray(context.lines)) {
        console.error("Context tidak memiliki properti 'lines' berupa array.");
        return;
    }

    for (const line of context.lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        try {
            const hasilContext = await runEarl(trimmed, modules, context);
            context.log.push({
                line: trimmed,
                result: hasilContext
            });
        } catch (err) {
            console.error(`Kesalahan saat memanjat baris: "${trimmed}"`, err.message || err);
            console.log("Eksekusi dihentikan karena error.");
            break;
        }
    }

    console.log("Selesai memanjat!");
}

memanjat.isBlock = true;

module.exports = { memanjat };
