// modules/bukaPintu.js

const { memory } = require('../memory');

async function bukaPintu(tokens, modules, context) {
    // Format sintaks:
    // bukaPintu :namaPintu: [dengan :namaKunci:] [pesanBerhasil "text"] [pesanGagal "text"]

    const pintuToken = tokens[1];
    if (!pintuToken || !pintuToken.startsWith(':') || !pintuToken.endsWith(':')) {
        console.error("Format bukaPintu salah: harus ada :namaPintu:");
        return;
    }
    const namaPintu = pintuToken.slice(1, -1);

    let namaKunci = null;
    let pesanBerhasil = "Pintu terbuka.";
    let pesanGagal = "Pintu terkunci! Anda butuh kunci.";

    for (let i = 2; i < tokens.length; i++) {
        if (tokens[i] === 'dengan' && tokens[i+1] && tokens[i+1].startsWith(':') && tokens[i+1].endsWith(':')) {
            namaKunci = tokens[i+1].slice(1, -1);
            i++;
        } else if (tokens[i] === 'pesanBerhasil' && tokens[i+1] && tokens[i+1].startsWith('"') && tokens[i+1].endsWith('"')) {
            pesanBerhasil = tokens[i+1].slice(1, -1);
            i++;
        } else if (tokens[i] === 'pesanGagal' && tokens[i+1] && tokens[i+1].startsWith('"') && tokens[i+1].endsWith('"')) {
            pesanGagal = tokens[i+1].slice(1, -1);
            i++;
        }
    }

    memory[namaPintu] = memory[namaPintu] || {};
    if (memory[namaPintu].status === 'terbuka') {
        console.log(`Pintu ${namaPintu} sudah terbuka.`);
        return;
    }

    if (namaKunci) {
        const inventori = memory.inventori || [];
        if (!inventori.includes(namaKunci)) {
            console.log(pesanGagal);
            return;
        }
    }

    memory[namaPintu].status = 'terbuka';
    console.log(pesanBerhasil);
}

bukaPintu.isBlock = false;

module.exports = { bukaPintu };
