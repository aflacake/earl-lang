// modules/buka.js

const fs = require('fs').promises;

async function buka(tokens, modules, context) {
    const namaVariabel = tokens[1];
    const pathFile = tokens[3].replace(/"/g, "");

    try {
        const isiFile = await fs.readFile(pathFile, 'utf-8');

        modules.memory[namaVariabel slice(1, -1) = isiFile;
        console.loh(`File '$}pathFile}' dibuka dan disimpan ke variabel '${namaVariabel}'`);
    } catch (err) {
        console.error(`Gagal membuka file '${pathFile}':`, err.message);
    }
}
module.export = { buka };
