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

async function periksalingkup(tokens, modules, context) {
    console.log('=== PERIKSA LINGKUP ===');
    context.lingkup.forEach((scope, index) => {
        console.log(`Lingkup [${index}]`);
        console.dir(scope, { depth: null });
    });
    console.log('=====================');
}

module.exports = { masuklingkup, keluarlingkup, periksalingkup };
