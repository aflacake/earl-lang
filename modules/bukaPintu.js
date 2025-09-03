const { memory } = require('../memory');

async function bukaPintu(tokens, modules, context) {
    const pintuToken = tokens[1];
    if (!pintuToken || !pintuToken.startsWith(':') || !pintuToken.endsWith(':')) {
        console.error("Format bukaPintu salah: harus ada :namaPintu:");
        return;
    }

    let namaPintu = pintuToken.slice(1, -1);

    const denganIndex = tokens.indexOf('dengan');

    let kunciToken = null;
    if (denganIndex !== -1 && tokens[denganIndex + 1]) {
        kunciToken = tokens[denganIndex + 1];
        if (kunciToken.startsWith(':') && kunciToken.endsWith(':')) {
            kunciToken = kunciToken.slice(1, -1);
        } else {
            kunciToken = null;
        }
    }

    let pesanBerhasil = "Pintu terbuka.";
    let pesanGagal = "Pintu terkunci! Anda butuh kunci.";

    const pesanBerhasilIndex = tokens.indexOf('pesanBerhasil');
    if (pesanBerhasilIndex !== -1 && tokens[pesanBerhasilIndex + 1]) {
        const pb = tokens[pesanBerhasilIndex + 1];
        if (pb.startsWith('"') && pb.endsWith('"')) {
            pesanBerhasil = pb.slice(1, -1);
        }
    }

    const pesanGagalIndex = tokens.indexOf('pesanGagal');
    if (pesanGagalIndex !== -1 && tokens[pesanGagalIndex + 1]) {
        const pg = tokens[pesanGagalIndex + 1];
        if (pg.startsWith('"') && pg.endsWith('"')) {
            pesanGagal = pg.slice(1, -1);
        }
    }

    modules.memory[namaPintu] = modules.memory[namaPintu] || {};
    if (modules.memory[namaPintu].status === 'terbuka') {
        console.log(`Pintu '${namaPintu}' sudah terbuka.`);
        return;
    }

    if (kunciToken) {
        const inventori = modules.memory['inventori'] || [];
        if (!inventori.includes(kunciToken)) {
            console.log(pesanGagal);
            return;
        }
    }

    modules.memory[namaPintu].status = 'terbuka';
    console.log(pesanBerhasil);
}

bukaPintu.isBlock = false;

module.exports = { bukaPintu };
