// modules/folder.js

const fs = require('fs').promises;
const path = require('path');

async function buatFolder(tokens, modules, context) {
    const folderPath = tokens[1];

    try {
        await fs.mkdir(folderPath, { recursive: true });
        console.log(`Folder '${folderPath}' berhasil dibuat`);
    } catch (err) {
        console.error(`Gagal membuat folder '${folderPath}': ${err.message}`);
    }
}

async function hapusFolder(tokens, modules, context) {
    const folderPath = tokens[1];

    try {
        await fs.rm(folderPath, { recursive: true, force: true });
        console.log(`Folder '${folderPath}' berhasil dihapus.`);
    } catch (err) {
        console.error(`Gagal menghapus folder '${folderPath}': ${err.message}`);
    }
}

async function bacaFolder(tokens, modules, context) {
    const folderPath = tokens[1];

    try {
        const files = await fs.readdir(folderPath);
        console.log(`Isi folder '${folderPath}':`);
        files.forEach(file => console.log(file));
    } catch (err) {
        console.error(`Gagal membaca folder '${folderPath}': ${err.message}`);
    }
}

async function gantiNamaFolder(tokens, modules, context) {
    const pathLama = tokens[1];
    const pathBaru = tokens[2];

    try {
        await fs.rename(pathLama, pathBaru);
        console.log(`Folder '${pathLama}' berhasil diganti namanya menjadi '${pathBaru}'.`);
    } catch (err) {
        console.error(`Gagal mengganti nama folder '${pathLama}': ${err.message}`);
    }
}

module.exports = { buatFolder, hapusFolder, bacaFolder, gantiNamaFolder };
