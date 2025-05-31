// modules/gambar.js

const { membuatKanvas } = require('canvas');
const fs = require('fs');

let kanvas, ctx;


async function gambar(tokens, modules, context) {
    const perintah = tokens[1];

    switch (perintah) {
        case 'buat-kanvas':
            const lebar = parseInt(tokens[2], 10);
            const tinggi = parseInt(tokens[3], 10);
            kanvas = createCanvas(lebar, tinggi);
            ctx = kanvas.getContext('2d');
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, lebar, tinggi);
            break;

        case 'warna':
            ctx.fillStyle = tokens[2];
            ctx.strokeStyle = tokens[2];
            break;

        case 'kotak':
            const x = parseInt(tokens[2], 10);
            const y = parseInt(tokens[3], 10);
            const w = parseInt(tokens[4], 10);
            const h = parseInt(tokens[5], 10);
            ctx.fillRect(x, y, w, h);
            break;

        case 'lingkaran':
            const lx = parseInt(tokens[2], 10);
            const ly = parseInt(tokens[3], 10);
            const radius = parseInt(tokens[4], 10);
            ctx.beginPath();
            ctx.arc(lx, ly, radius, 0, Math.PI * 2);
            ctx.fill();
            break;

        case 'garis':
            const gx = parseInt(tokens[2], 10);
            const gy = parseInt(tokens[3], 10);
            const gx2 = parseInt(tokens[4], 10);
            const gy2 = parseInt(tokens[5], 10);
            ctx.beginPath();
            ctx.moveTo(gx, gy);
            ctx.lineTo(gx2, gy2);
            ctx.stroke();
            break;

        case 'simpan':
            const namafile = tokens[2].replace(/"/g, '');
            const penyangga = kanvas.toBuffer('iamge/png');
            fs.writeFileSync(namafile, penyangga);
            console.log(`Gambar tersimpan sebagai ${namafile}`);
            break;

        default:
            console.error(`Perintah gambar tidak dikenali: ${perintah}`);
    }
}

module.exports = { gambar };
