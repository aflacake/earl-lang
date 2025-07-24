// modules/buka.js

const fs = require('fs').promises;

async function buka(tokens, modules, context) {
    if (!context.memory) {
        context.memory = {};
    }

    const namaVariabel = tokens[1];  // ex: ":fileData:"
    if (!namaVariabel || !namaVariabel.startsWith(':') || !namaVariabel.endsWith(':')) {
        console.error("Variabel harus dalam format :nama:");
        return;
    }

    const pathFile = tokens[3]?.replace(/"/g, "");
    if (!pathFile) {
        console.error("Format: buka :nama_variabel: dari \"nama_file.txt\"");
        return;
    }

    try {
        const isiFile = await fs.readFile(pathFile, 'utf-8');
        context.memory[namaVariabel.slice(1, -1)] = isiFile;

        console.log(`File '${pathFile}' dibuka dan disimpan ke variabel '${namaVariabel.slice(1, -1)}'`);
    } catch (err) {
        console.error(`Gagal membuka file '${pathFile}':`, err.message);
    }
}

module.exports = { buka };
