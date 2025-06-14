// modules/impor.js

const fs = require('fs').promises;

async function impor(tokens, modules, context) {
    if (tokens.length < 2) {
        console.error("Perintah 'impor' harus diikuti nama file.");
        return;
    }

    let namafile = tokens[1];

    if (!namafile.endsWith('.pearl')) {
        namafile += '.pearl';
    }

    try {
        const kode = await fs.readFile(filename, 'utf8');
        await modules.runPearl(kode, modules, context);
    } catch (err) {
        console.error(`Gagal; mengimpor file '${namafile}':`, err.message);
    }
}

module.exports = { impor };
