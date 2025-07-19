// modules/lingkup.js

async function masuklingkup(tokens, modules, context) {
    if (!Array.isArray(context.lingkup)) {
        context.lingkup = [{}];
    }
    context.lingkup.push({});
}

async function keluarlingkup(tokens, modules, context) {
    if (!Array.isArray(context.lingkup)) {
        console.warn('Lingkup belum diinisialisasi.');
        context.lingkup = [{}];
        return;
    }

    if (context.lingkup.length > 1) {
        const lingkupKeluar = context.lingkup.pop();

        Object.assign(context.lingkup[0], lingkupKeluar);

        if (context.memory && typeof context.memory === 'object') {
            Object.assign(context.memory, lingkupKeluar);
        }
    } else {
        console.warn('Tidak bisa keluar dari lingkup global.');
    }
}

async function periksalingkup(tokens, modules, context) {
    if (!Array.isArray(context.lingkup)) {
        console.log('Lingkup belum diinisialisasi.');
        return;
    }

    console.log('=== PERIKSA LINGKUP ===');
    context.lingkup.forEach((scope, index) => {
        console.log(`Lingkup [${index}]`);
        console.dir(scope, { depth: null });
    });
    console.log('=====================');
}

module.exports = { masuklingkup, keluarlingkup, periksalingkup };
