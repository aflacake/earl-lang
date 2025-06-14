// modules/lingkup.js

async function masuklingkup(tokens, modules, context) {
    context.lingkup.push({});
}

async function keluarlingkup(tokens, modules, context) {
    if (context.lingkup.length > 1) {
        context.lingkup.pop();
    } else {
        console.warn('Tidak bisa keluar dari lingkup global.');
    }
}

module.exports = { masuklingkup, keluarlingkup };
