// modules/berkas.js

const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const { resolveToken } = require('./tampilkan');

async function berkasAda(filePath) {
    try {
        const status = await fs.stat(filePath);
        return status.isFile();
    } catch {
        return false;
    }
}

async function bacaBerkas(tokens, modules, context) {
    if (tokens.length < 2) {
        console.error("Sintaks: bacaBerkas <namafile> [ke] [:variabel:]");
        return;
    }

    const filePath = resolveToken(tokens[1], context, modules);
    
    if (!(await berkasAda(filePath))) {
        console.error(`Berkas '${filePath}' tidak ditemukan.`);
        return;
    }

    try {
        const content = await fs.readFile(filePath, 'utf8');
        
        if (tokens.length >= 4 && tokens[2] === 'ke' && tokens[3].startsWith(':') && tokens[3].endsWith(':')) {
            const varName = tokens[3].slice(1, -1);
            context.memory[varName] = content;
            console.log(`Isi berkas '${filePath}' disimpan ke variabel '${varName}'.`);
        } else {
            console.log(`Isi berkas '${filePath}':`);
            console.log(content);
        }
    } catch (err) {
        console.error(`Gagal membaca berkas '${filePath}': ${err.message}`);
    }
}

async function tulisBerkas(tokens, modules, context) {
    if (tokens.length < 3) {
        console.error("Sintaks: tulisBerkas <namafile> <konten> [timpa|tambah]");
        return;
    }

    const filePath = resolveToken(tokens[1], context, modules);
    const content = resolveToken(tokens[2], context, modules);
    const mode = tokens[3] || 'timpa';

    try {
        if (mode === 'tambah') {
            await fs.appendFile(filePath, content + '\n');
            console.log(`Konten berhasil ditambahkan ke berkas '${filePath}'.`);
        } else {
            await fs.writeFile(filePath, content);
            console.log(`Berkas '${filePath}' berhasil ditulis.`);
        }
    } catch (err) {
        console.error(`Gagal menulis berkas '${filePath}': ${err.message}`);
    }
}

async function salinBerkas(tokens, modules, context) {
    if (tokens.length < 3) {
        console.error("Sintaks: salinBerkas <berkas_asal> <berkas_tujuan>");
        return;
    }

    const srcPath = resolveToken(tokens[1], context, modules);
    const destPath = resolveToken(tokens[2], context, modules);

    if (!(await berkasAda(srcPath))) {
        console.error(`Berkas asal '${srcPath}' tidak ditemukan.`);
        return;
    }

    try {
        await fs.copyFile(srcPath, destPath);
        console.log(`Berkas '${srcPath}' berhasil disalin ke '${destPath}'.`);
    } catch (err) {
        console.error(`Gagal menyalin berkas: ${err.message}`);
    }
}

async function pindahBerkas(tokens, modules, context) {
    if (tokens.length < 3) {
        console.error("Sintaks: pindahBerkas <berkas_asal> <berkas_tujuan>");
        return;
    }

    const srcPath = resolveToken(tokens[1], context, modules);
    const destPath = resolveToken(tokens[2], context, modules);

    if (!(await berkasAda(srcPath))) {
        console.error(`Berkas asal '${srcPath}' tidak ditemukan.`);
        return;
    }

    try {
        await fs.rename(srcPath, destPath);
        console.log(`Berkas '${srcPath}' berhasil dipindah ke '${destPath}'.`);
    } catch (err) {
        console.error(`Gagal memindah berkas: ${err.message}`);
    }
}

async function hapusBerkas(tokens, modules, context) {
    if (tokens.length < 2) {
        console.error("Sintaks: hapusBerkas <namafile>");
        return;
    }

    const filePath = resolveToken(tokens[1], context, modules);

    if (!(await berkasAda(filePath))) {
        console.error(`Berkas '${filePath}' tidak ditemukan.`);
        return;
    }

    try {
        await fs.unlink(filePath);
        console.log(`Berkas '${filePath}' berhasil dihapus.`);
    } catch (err) {
        console.error(`Gagal menghapus berkas '${filePath}': ${err.message}`);
    }
}

async function infoBerkas(tokens, modules, context) {
    if (tokens.length < 2) {
        console.error("Sintaks: infoBerkas <namafile>");
        return;
    }

    const filePath = resolveToken(tokens[1], context, modules);

    if (!(await berkasAda(filePath))) {
        console.error(`Berkas '${filePath}' tidak ditemukan.`);
        return;
    }

    try {
        const stats = await fs.stat(filePath);
        const info = {
            nama: path.basename(filePath),
            ukuran: stats.size,
            dibuat: stats.birthtime.toLocaleString('id-ID'),
            diubah: stats.mtime.toLocaleString('id-ID'),
            ekstensi: path.extname(filePath),
            direktori: path.dirname(filePath)
        };

        console.log(`Informasi berkas '${filePath}':`);
        console.log(`  Nama: ${info.nama}`);
        console.log(`  Ukuran: ${info.ukuran} byte`);
        console.log(`  Dibuat: ${info.dibuat}`);
        console.log(`  Diubah: ${info.diubah}`);
        console.log(`  Ekstensi: ${info.ekstensi || 'tidak ada'}`);
        console.log(`  Direktori: ${info.direktori}`);

        if (tokens.length >= 4 && tokens[2] === 'ke' && tokens[3].startsWith(':') && tokens[3].endsWith(':')) {
            const varName = tokens[3].slice(1, -1);
            context.memory[varName] = info;
            console.log(`Info berkas disimpan ke variabel '${varName}'.`);
        }
    } catch (err) {
        console.error(`Gagal mendapatkan info berkas '${filePath}': ${err.message}`);
    }
}

async function cariBerkas(tokens, modules, context) {
    if (tokens.length < 3) {
        console.error("Sintaks: cariBerkas <direktori> <pola> [ke] [:variabel:]");
        return;
    }

    const dirPath = resolveToken(tokens[1], context, modules);
    const pattern = resolveToken(tokens[2], context, modules);

    try {
        const files = await fs.readdir(dirPath);
        const regex = new RegExp(pattern, 'i');
        const matches = files.filter(file => regex.test(file));

        if (matches.length === 0) {
            console.log(`Tidak ada berkas yang cocok dengan pola '${pattern}' di '${dirPath}'.`);
            return;
        }

        console.log(`Berkas yang ditemukan dengan pola '${pattern}':`);
        matches.forEach(file => console.log(`  ${file}`));

        if (tokens.length >= 5 && tokens[3] === 'ke' && tokens[4].startsWith(':') && tokens[4].endsWith(':')) {
            const varName = tokens[4].slice(1, -1);
            context.memory[varName] = matches;
            console.log(`Hasil pencarian disimpan ke variabel '${varName}'.`);
        }
    } catch (err) {
        console.error(`Gagal mencari berkas di '${dirPath}': ${err.message}`);
    }
}

async function bacaBarisPerBaris(tokens, modules, context) {
    if (tokens.length < 2) {
        console.error("Sintaks: bacaBarisPerBaris <namafile> [ke] [:variabel:]");
        return;
    }

    const filePath = resolveToken(tokens[1], context, modules);

    if (!(await berkasAda(filePath))) {
        console.error(`Berkas '${filePath}' tidak ditemukan.`);
        return;
    }

    try {
        const content = await fs.readFile(filePath, 'utf8');
        const lines = content.split('\n');

        if (tokens.length >= 4 && tokens[2] === 'ke' && tokens[3].startsWith(':') && tokens[3].endsWith(':')) {
            const varName = tokens[3].slice(1, -1);
            context.memory[varName] = lines;
            console.log(`${lines.length} baris dari '${filePath}' disimpan ke variabel '${varName}'.`);
        } else {
            console.log(`Berkas '${filePath}' memiliki ${lines.length} baris:`);
            lines.forEach((line, index) => {
                console.log(`${index + 1}: ${line}`);
            });
        }
    } catch (err) {
        console.error(`Gagal membaca berkas per baris '${filePath}': ${err.message}`);
    }
}

async function gabungBerkas(tokens, modules, context) {
    if (tokens.length < 4) {
        console.error("Sintaks: gabungBerkas <berkas1> <berkas2> <hasil>");
        return;
    }

    const file1 = resolveToken(tokens[1], context, modules);
    const file2 = resolveToken(tokens[2], context, modules);
    const output = resolveToken(tokens[3], context, modules);

    if (!(await berkasAda(file1))) {
        console.error(`Berkas '${file1}' tidak ditemukan.`);
        return;
    }

    if (!(await berkasAda(file2))) {
        console.error(`Berkas '${file2}' tidak ditemukan.`);
        return;
    }

    try {
        const content1 = await fs.readFile(file1, 'utf8');
        const content2 = await fs.readFile(file2, 'utf8');
        const combined = content1 + '\n' + content2;

        await fs.writeFile(output, combined);
        console.log(`Berkas '${file1}' dan '${file2}' berhasil digabung menjadi '${output}'.`);
    } catch (err) {
        console.error(`Gagal menggabung berkas: ${err.message}`);
    }
}

async function periksaTipe(tokens, modules, context) {
    if (tokens.length < 2) {
        console.error("Sintaks: periksaTipe <namafile> [ke] [:variabel:]");
        return;
    }

    const filePath = resolveToken(tokens[1], context, modules);

    if (!(await berkasAda(filePath))) {
        console.error(`Berkas '${filePath}' tidak ditemukan.`);
        return;
    }

    try {
        const ext = path.extname(filePath).toLowerCase();
        const types = {
            '.txt': 'Teks',
            '.js': 'JavaScript',
            '.json': 'JSON',
            '.html': 'HTML',
            '.css': 'CSS',
            '.md': 'Markdown',
            '.jpg': 'Gambar JPEG',
            '.png': 'Gambar PNG',
            '.pdf': 'PDF',
            '.zip': 'Arsip ZIP'
        };

        const fileType = types[ext] || 'Tidak dikenal';

        if (tokens.length >= 4 && tokens[2] === 'ke' && tokens[3].startsWith(':') && tokens[3].endsWith(':')) {
            const varName = tokens[3].slice(1, -1);
            context.memory[varName] = fileType;
            console.log(`Tipe berkas disimpan ke variabel '${varName}'.`);
        } else {
            console.log(`Tipe berkas '${filePath}': ${fileType}`);
        }
    } catch (err) {
        console.error(`Gagal memeriksa tipe berkas '${filePath}': ${err.message}`);
    }
}

module.exports = {
    bacaBerkas,
    tulisBerkas,
    salinBerkas,
    pindahBerkas,
    hapusBerkas,
    infoBerkas,
    cariBerkas,
    bacaBarisPerBaris,
    gabungBerkas,
    periksaTipe
};