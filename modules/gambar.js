// modules/gambar.js

const { createCanvas } = require('canvas');
const fs = require('fs');
const { memory } = require('../memory.js');

async function gambar(tokens, modules, context) {
    const perintah = tokens[1];

    switch (perintah) {
        case 'buat-kanvas': {
            const lebar = parseInt(tokens[2], 10);
            const tinggi = parseInt(tokens[3], 10);

            const kanvas = createCanvas(lebar, tinggi);
            const ctx = kanvas.getContext('2d');

            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, lebar, tinggi);

            memory.gambar = {
                kanvas,
                ctx,
                lebar,
                tinggi,
                warna: "white"
            };

            break;
        }

        case 'warna': {
            const warna = tokens[2];
            if (!memory.gambar) return console.error("Kanvas belum dibuat.");
            memory.gambar.ctx.fillStyle = warna;
            memory.gambar.ctx.strokeStyle = warna;
            memory.gambar.ctx.warna = warna;
            break;
        }

        case 'kotak': {
            const [x, y, w, h] = tokens.slice(2, 6).map(Number);
            if (!memory.gambar) return console.error("Kanvas belum dibuat.");
            memory.gambar.ctx.fillRect(x, y, w, h);
            break;
       }

        case 'lingkaran': {
            const [lx, ly, radius] = tokens.slice(2, 5).map(Number);
            if (!memory.gambar) return console.error("Kanvas belum dibuat.");
            const ctx = memory.gambar.ctx;
            ctx.beginPath();
            ctx.arc(lx, ly, radius, 0, Math.PI * 2);
            ctx.fill();
            break;
        }

        case 'garis': {
            const [gx, gy, gx2, gy2] = tokens.slice(2, 6).map(Number);
            if (!memory.gambar) return console.error("Kanvas belum dibuat.");
            const ctx = memory.gambar.ctx;
            ctx.beginPath();
            ctx.moveTo(gx, gy);
            ctx.lineTo(gx2, gy2);
            ctx.stroke();
            break;
        }

        case 'simpan': {
            if (!memory.gambar) return console.error("Kanvas belum dibuat.");
            const namafile = tokens[2].replace(/"/g, '');
            const penyangga = memory.gambar.kanvas.toBuffer('image/png');
            fs.writeFileSync(namafile, penyangga);
            console.log(`Gambar tersimpan sebagai ${namafile}`);
            break;
        }

        default:
            console.error(`Perintah gambar tidak dikenali: ${perintah}`);
    }
}

module.exports = { gambar };
