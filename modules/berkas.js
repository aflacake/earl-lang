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
        console.error("Cara penggunaan: bacaBerkas <nama_berkas> [ke] [:variabel:]");
        console.error("Contoh: bacaBerkas \"data.txt\" atau bacaBerkas \"data.txt\" ke :isi:");
        return;
    }

    const filePath = resolveToken(tokens[1], context, modules);
    
    if (!(await berkasAda(filePath))) {
        console.error(`Berkas '${filePath}' tidak ditemukan. Pastikan nama dan lokasi berkas sudah benar.`);
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
        console.error(`Tidak dapat membaca berkas '${filePath}'. Pastikan berkas tidak sedang digunakan program lain.`);
    }
}

async function tulisBerkas(tokens, modules, context) {
    if (tokens.length < 3) {
        console.error("Cara penggunaan: tulisBerkas <nama_berkas> <isi_teks> [timpa|tambah]");
        console.error("Contoh: tulisBerkas \"data.txt\" \"Hello Earl!\" atau tulisBerkas \"log.txt\" \"Baris baru\" tambah");
        return;
    }

    const filePath = resolveToken(tokens[1], context, modules);
    const content = resolveToken(tokens[2], context, modules);
    const mode = tokens[3] || 'timpa';

    try {
        if (mode === 'tambah') {
            await fs.appendFile(filePath, content + '\n');
            console.log(`Teks berhasil ditambahkan ke berkas '${filePath}'.`);
        } else {
            await fs.writeFile(filePath, content);
            console.log(`Berkas '${filePath}' berhasil dibuat dan ditulis.`);
        }
    } catch (err) {
        console.error(`Tidak dapat menulis ke berkas '${filePath}'. Periksa izin folder dan pastikan berkas tidak terkunci.`);
    }
}

async function salinBerkas(tokens, modules, context) {
    if (tokens.length < 3) {
        console.error("Cara penggunaan: salinBerkas <berkas_asli> <berkas_salinan>");
        console.error("Contoh: salinBerkas \"data.txt\" \"backup_data.txt\"");
        return;
    }

    const srcPath = resolveToken(tokens[1], context, modules);
    const destPath = resolveToken(tokens[2], context, modules);

    if (!(await berkasAda(srcPath))) {
        console.error(`Berkas asli '${srcPath}' tidak ditemukan. Pastikan nama berkas sudah benar.`);
        return;
    }

    try {
        await fs.copyFile(srcPath, destPath);
        console.log(`Berkas '${srcPath}' berhasil disalin ke '${destPath}'.`);
    } catch (err) {
        console.error(`Tidak dapat menyalin berkas. Pastikan folder tujuan ada dan Anda memiliki izin untuk menulis.`);
    }
}

async function pindahBerkas(tokens, modules, context) {
    if (tokens.length < 3) {
        console.error("Cara penggunaan: pindahBerkas <berkas_asli> <lokasi_baru>");
        console.error("Contoh: pindahBerkas \"data.txt\" \"folder/data.txt\"");
        return;
    }

    const srcPath = resolveToken(tokens[1], context, modules);
    const destPath = resolveToken(tokens[2], context, modules);

    if (!(await berkasAda(srcPath))) {
        console.error(`Berkas asli '${srcPath}' tidak ditemukan. Pastikan nama berkas sudah benar.`);
        return;
    }

    try {
        await fs.rename(srcPath, destPath);
        console.log(`Berkas '${srcPath}' berhasil dipindah ke '${destPath}'.`);
    } catch (err) {
        console.error(`Tidak dapat memindah berkas. Pastikan folder tujuan ada dan berkas tidak sedang digunakan.`);
    }
}

async function hapusBerkas(tokens, modules, context) {
    if (tokens.length < 2) {
        console.error("Cara penggunaan: hapusBerkas <nama_berkas>");
        console.error("Contoh: hapusBerkas \"data.txt\"");
        console.error("Peringatan: Berkas yang dihapus tidak dapat dikembalikan!");
        return;
    }

    const filePath = resolveToken(tokens[1], context, modules);

    if (!(await berkasAda(filePath))) {
        console.error(`Berkas '${filePath}' tidak ditemukan. Pastikan nama berkas sudah benar.`);
        return;
    }

    try {
        await fs.unlink(filePath);
        console.log(`Berkas '${filePath}' berhasil dihapus.`);
    } catch (err) {
        console.error(`Tidak dapat menghapus berkas '${filePath}'. Pastikan berkas tidak sedang digunakan dan Anda memiliki izin.`);
    }
}

async function infoBerkas(tokens, modules, context) {
    if (tokens.length < 2) {
        console.error("Cara penggunaan: infoBerkas <nama_berkas> [ke] [:variabel:]");
        console.error("Contoh: infoBerkas \"data.txt\" atau infoBerkas \"data.txt\" ke :info:");
        return;
    }

    const filePath = resolveToken(tokens[1], context, modules);

    if (!(await berkasAda(filePath))) {
        console.error(`Berkas '${filePath}' tidak ditemukan. Pastikan nama berkas sudah benar.`);
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
            folder: path.dirname(filePath)
        };

        console.log(`Informasi berkas '${filePath}':`);
        console.log(`  Nama: ${info.nama}`);
        console.log(`  Ukuran: ${info.ukuran} byte`);
        console.log(`  Dibuat: ${info.dibuat}`);
        console.log(`  Diubah: ${info.diubah}`);
        console.log(`  Jenis: ${info.ekstensi || 'tidak ada ekstensi'}`);
        console.log(`  Folder: ${info.folder}`);

        if (tokens.length >= 4 && tokens[2] === 'ke' && tokens[3].startsWith(':') && tokens[3].endsWith(':')) {
            const varName = tokens[3].slice(1, -1);
            context.memory[varName] = info;
            console.log(`Informasi berkas disimpan ke variabel '${varName}'.`);
        }
    } catch (err) {
        console.error(`Tidak dapat mengakses informasi berkas '${filePath}'. Pastikan berkas tidak sedang digunakan.`);
    }
}

async function cariBerkas(tokens, modules, context) {
    if (tokens.length < 3) {
        console.error("Cara penggunaan: cariBerkas <nama_folder> <kata_kunci> [ke] [:variabel:]");
        console.error("Contoh: cariBerkas \"Documents\" \"*.txt\" atau cariBerkas \".\" \"data\" ke :hasil:");
        return;
    }

    const dirPath = resolveToken(tokens[1], context, modules);
    const pattern = resolveToken(tokens[2], context, modules);

    try {
        const files = await fs.readdir(dirPath);
        const regex = new RegExp(pattern, 'i');
        const matches = files.filter(file => regex.test(file));

        if (matches.length === 0) {
            console.log(`Tidak ada berkas yang cocok dengan kata kunci '${pattern}' di folder '${dirPath}'.`);
            return;
        }

        console.log(`Berkas yang ditemukan dengan kata kunci '${pattern}':`);
        matches.forEach(file => console.log(`  ${file}`));

        if (tokens.length >= 5 && tokens[3] === 'ke' && tokens[4].startsWith(':') && tokens[4].endsWith(':')) {
            const varName = tokens[4].slice(1, -1);
            context.memory[varName] = matches;
            console.log(`Hasil pencarian disimpan ke variabel '${varName}'.`);
        }
    } catch (err) {
        console.error(`Tidak dapat mencari berkas di folder '${dirPath}'. Pastikan folder ada dan dapat diakses.`);
    }
}

async function bacaBarisPerBaris(tokens, modules, context) {
    if (tokens.length < 2) {
        console.error("Cara penggunaan: bacaBarisPerBaris <nama_berkas> [ke] [:variabel:]");
        console.error("Contoh: bacaBarisPerBaris \"data.txt\" atau bacaBarisPerBaris \"log.txt\" ke :baris:");
        return;
    }

    const filePath = resolveToken(tokens[1], context, modules);

    if (!(await berkasAda(filePath))) {
        console.error(`Berkas '${filePath}' tidak ditemukan. Pastikan nama berkas sudah benar.`);
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
        console.error(`Tidak dapat membaca berkas baris per baris '${filePath}'. Pastikan berkas berupa teks.`);
    }
}

async function gabungBerkas(tokens, modules, context) {
    if (tokens.length < 4) {
        console.error("Cara penggunaan: gabungBerkas <berkas_pertama> <berkas_kedua> <berkas_hasil>");
        console.error("Contoh: gabungBerkas \"file1.txt\" \"file2.txt\" \"gabungan.txt\"");
        return;
    }

    const file1 = resolveToken(tokens[1], context, modules);
    const file2 = resolveToken(tokens[2], context, modules);
    const output = resolveToken(tokens[3], context, modules);

    if (!(await berkasAda(file1))) {
        console.error(`Berkas pertama '${file1}' tidak ditemukan. Pastikan nama berkas sudah benar.`);
        return;
    }

    if (!(await berkasAda(file2))) {
        console.error(`Berkas kedua '${file2}' tidak ditemukan. Pastikan nama berkas sudah benar.`);
        return;
    }

    try {
        const content1 = await fs.readFile(file1, 'utf8');
        const content2 = await fs.readFile(file2, 'utf8');
        const combined = content1 + '\n' + content2;

        await fs.writeFile(output, combined);
        console.log(`Berkas '${file1}' dan '${file2}' berhasil digabung menjadi '${output}'.`);
    } catch (err) {
        console.error(`Tidak dapat menggabung berkas. Pastikan kedua berkas dapat dibaca dan folder tujuan dapat ditulis.`);
    }
}

async function periksaTipe(tokens, modules, context) {
    if (tokens.length < 2) {
        console.error("Cara penggunaan: periksaTipe <nama_berkas> [ke] [:variabel:]");
        console.error("Contoh: periksaTipe \"data.txt\" atau periksaTipe \"gambar.jpg\" ke :jenis:");
        return;
    }

    const filePath = resolveToken(tokens[1], context, modules);

    if (!(await berkasAda(filePath))) {
        console.error(`Berkas '${filePath}' tidak ditemukan. Pastikan nama berkas sudah benar.`);
        return;
    }

    try {
        const ext = path.extname(filePath).toLowerCase();
        const types = {
            '.txt': 'Berkas Teks',
            '.js': 'Kode JavaScript',
            '.json': 'Data JSON',
            '.html': 'Halaman Web HTML',
            '.css': 'Gaya CSS',
            '.md': 'Dokumen Markdown',
            '.jpg': 'Gambar JPEG',
            '.png': 'Gambar PNG',
            '.pdf': 'Dokumen PDF',
            '.zip': 'Arsip ZIP'
        };

        const fileType = types[ext] || 'Jenis berkas tidak dikenal';

        if (tokens.length >= 4 && tokens[2] === 'ke' && tokens[3].startsWith(':') && tokens[3].endsWith(':')) {
            const varName = tokens[3].slice(1, -1);
            context.memory[varName] = fileType;
            console.log(`Jenis berkas disimpan ke variabel '${varName}'.`);
        } else {
            console.log(`Jenis berkas '${filePath}': ${fileType}`);
        }
    } catch (err) {
        console.error(`Tidak dapat memeriksa jenis berkas '${filePath}'. Pastikan berkas dapat diakses.`);
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