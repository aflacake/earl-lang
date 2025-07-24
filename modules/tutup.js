// modules/tutup.js

function tutup(tokens, modules, context) {
    if (context.filePath || context.fileContent) {
        const nama = context.filePath || '[tidak diketahui]';
        const mode = context.fileOpenMode || 'tidak diketahui';

        console.log(`File '${nama}' (${mode}) telah ditutup.`);

        delete context.fileContent;
        delete context.filePath;
        delete context.fileOpenMode;
        delete context.fileOpenedAt;
    } else {
        console.log("Tidak ada file yang sedang dibuka.");
    }
}

module.exports = { tutup };
