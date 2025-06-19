// modules/folder.js

const fs = require('fs').promises;
const path = require('path');

async function folderAda(folderPath) {
    try {
        const status = await fs.stat(folderPath);
        return status.isDirectory();
    } catch {
        return false;
    }
}

async function buatFolder(tokens, modules, context) {
    const folderPath = tokens[1];

    if (await folderAda(folderPath)) {
        console.log(`Folder '${folderPath}' sudah ada.`);
        return
    }

    try {
        await fs.mkdir(folderPath, { recursive: true });
        console.log(`Folder '${folderPath}' berhasil dibuat`);
    } catch (err) {
        console.error(`Gagal membuat folder '${folderPath}': ${err.message}`);
    }
}

async function hapusFolder(tokens, modules, context) {
    const folderPath = tokens[1];

    if (!(await folderAda(folderPath))) {
        console.log(`Folder '${folderPath}' tidak ditemukan.`);
        return;
    }

    try {
        await fs.rm(folderPath, { recursive: true, force: true });
        console.log(`Folder '${folderPath}' berhasil dihapus.`);
    } catch (err) {
        console.error(`Gagal menghapus folder '${folderPath}': ${err.message}`);
    }
}

async function bacaFolder(tokens, modules, context) {
    const folderPath = tokens[1];

    if (!(await folderAda(folderPath))) {
        console.log(`Folder '${folderPath}' tidak ditemukan.`);
        return;
    }

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


    if (!(await folderAda(pathLama)) {
        console.log(`Folder asal '${pathLama}' tidak ditemukan.`);
        return;
    }

    try {
        await fs.rename(pathLama, pathBaru);
        console.log(`Folder '${pathLama}' berhasil diganti namanya menjadi '${pathBaru}'.`);
    } catch (err) {
        console.error(`Gagal mengganti nama folder '${pathLama}': ${err.message}`);
    }
}

async function periksaUkuranFolder(tokens, modules, context) {
    const folderPath = tokens[1];

    if (!(await folderAda(folderPath))) {
        console.log(`Folder '${folderPath}' tidak ditemukan.`);
        return;
    }

    async function hitungUkuran(folder) {
        const entries = await fs.readdir(folder, { withFileTypes: true });
        let total = 0;

        for (const entry of entries) {
            const pathPenuh = path.join(folder, entry.name);
            if (entry.isDirectory()) {
                total += await hitungUkuran(pathPenuh);
            } else {
                const status = await fs.stat(pathPenuh);
                total += status.size;
            }
        }
        return total;
    }
    try {
        const totalBytes = await hitungUkuran(folderPath);
        console.log(`Ukuran total folder '${folderPath}': ${totalBytes} byte`);
    } catch (err) {
        console.error(`Gagal memeriksa ukuran folder '${folderPath}': ${err.message}`);
    }
}

module.exports = { 
    buatFolder,
    hapusFolder,
    bacaFolder,
    gantiNamaFolder,
    periksaUkuranFolder
};
