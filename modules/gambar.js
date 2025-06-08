// modules/gambar.js

const { createCanvas } = require('canvas');
const fs = require('fs');
const { memory } = require('../memory.js');
const { ambilDaftarJikaPerlu } = require('../utili');

function cekKanvas() {
    if (!memory.gambar) {
        console.error("Kanvas belum dibuat. Gunakan 'gambar buat-kanvas <lebar> <tinggi>' terlebih dahulu");
        return false;
    }
    return true;
}

function validasiAngka (angkaArray, namaArgumen) {
    if (angkaArray.some(isNaN)) {
        console.error(`Argumen '${namaArgumen}' harus berupa angka valid.`);
        return false;
    }
    return true;
}

function terapkanModeMenggambar(ctx, shapeType) {
    const mode = memory.gambar.mode || "isi";
    if (mode === "isi") {
        ctx.fill();
    } else if (mode === "garis") {
        ctx.stroke();
    } else if (mode === "isi-garis") {
        ctx.fill();
        ctx.stroke();
    } else {
        console.warn(`Mode gambar tidak dikenal: '${node}', fallback ke 'isi'`);
        ctx.fill();
    }
}

function buatKanvas(lebar, tinggi) {
    const kanvas = createCanvas(lebar, tinggi);
    const ctx = kanvas.getContext('2d');

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, lebar, tinggi);

    ctx.font = "20px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    memory.gambar = {
        kanvas,
        ctx,
        lebar,
        tinggi,
        warna: "white",
        huruf: "20px Arial",
        meluruskan: "left",
        garisdasar: "alphabetic"
    };
    console.log(`Kanvas ${lebar}x${tinggi} berhasil dibuat.`);
}

async function gambar(tokens, modules, context) {
    const perintah = tokens[1];

    switch (perintah) {
        case 'buat-kanvas': {
            const [lebar, tinggi] = tokens.slice(2, 4).map(Number);
            if (!validasiAngka([lebar, tinggi], 'buat-kanvas')) break;
            buatKanvas(lebar, tinggi);
            break;
        }

        case 'warna': {
            if (!cekKanvas()) break;
            const warna = tokens[2].replace(/"/g,'');
            console.log("Set warna ke:", warna);
            memory.gambar.ctx.fillStyle = warna;
            memory.gambar.ctx.strokeStyle = warna;
            memory.gambar.warna = warna;
            break;
        }

        case 'mode': {
            const mode = tokens[2];
            if (!["isi", "garis", "isi-garis"].includes(mode)) {
                console.error(`Mode gambar tidak dikenali: '${mode}'`);
                break;
            }
            memory.gambar.mode = mode;
            console.log(`Mode gambar diatur ke: ${mode}`);
            break;
        }

        case 'kotak': {
            if (!cekKanvas()) break;

            let param = tokens.slice(2, 6).map(Number);
            const daftar = ambilDaftarJikaPerlu(tokens[2]);
            if (daftar) {
                if (daftar.length !== 4) {
                    console.error("Daftar untuk 'kotak' harus memiliki 4 angka: x, y, w, h");
                    break;
                }
                param = daftar.map(Number);
            }

            const [x, y, w, h] = param;
            if (!validasiAngka([x, y, w, h], 'kotak')) break;
            const ctx = memory.gambar.ctx;
            ctx.beginPath();
            ctx.rect(x, y, w, h);
            terapkanModeMenggambar();
            break;
       }

        case 'lingkaran': {
            if (!cekKanvas()) break;

            let param = tokens.slice(2, 5).map(Number);
            const daftar = ambilDaftarJikaPerlu(tokens[2]);
            if (daftar) {
                if (daftar.length !== 3) {
                    console.error("Daftar untuk 'lingkaran' harus memiliki 3 angka: lx, ly, radius");
                    break;
                }
                param = daftar.map(Number);
            }

            const [lx, ly, radius] = param;
            if (!validasiAngka([lx, ly, radius], 'lingkaran')) break;
            const ctx = memory.gambar.ctx;
            ctx.beginPath();
            ctx.arc(lx, ly, radius, 0, Math.PI * 2);
            console.log("Warna saat lingkaran digambar:", ctx.fillStyle);
            terapkanModeMenggambar();
            break;
        }

        case 'poligon': {
            if(!cekKanvas()) break;
            let koordi = tokens.slice(2).map(Number);
            const daftarDariMemori = ambilDaftarJikaPerlu(tokens[2]);
            if (daftarDariMemori) {
                koordi = daftarDariMemori.map(Number);
            }

            if (koordi.length < 6 || koordi.length % 2 !== 0) {
                console.error("Minimal harus 3 titik (6 angka) dan jumlah koordinat genap.");
                return;
            }
            if (!validasiAngka(koordi, 'poligon')) break;

            const ctx = memory.gambar.ctx;
            ctx.beginPath();
            ctx.moveTo(koordi[0], koordi[1]);
            for (let i = 2; i < koordi.length; i += 2) {
                ctx.lineTo(koordi[i], koordi[i + 1]);
            }
            ctx.closePath();
            terapkanModeMenggambar();
            break;
        }

        case 'garis': {
            if (!cekKanvas()) break;

            let param = tokens.slice(2, 6).map(Number);
            const daftar = ambilDaftarJikaPerlu(tokens[2]);
            if (daftar) {
                if (daftar.length !== 4) {
                    console.error("Daftar untuk 'garis' harus memiliki 4 angka: gx, gy, gx2, gy2");
                    break;
                }
                param = daftar.map(Number);
            }

            const [gx, gy, gx2, gy2] = param;
            if (!validasiAngka([gx, gy, gx2, gy2], 'garis')) break;
            const ctx = memory.gambar.ctx;
            ctx.beginPath();
            ctx.moveTo(gx, gy);
            ctx.lineTo(gx2, gy2);
            ctx.stroke();
            break;
        }

        case 'teks': {
            if (!cekKanvas()) break;
            const teks = tokens[2].replace(/"/g, '');
            const x = parseInt(tokens[3], 10);
            const y = parseInt(tokens[4], 10);
            if (!validasiAngka([x, y], 'teks')) break;
            memory.gambar.ctx.fillText(teks, x, y);
            break;
        }

        case 'huruf': {
            if (!cekKanvas()) break;
            const huruf = tokens.slice(2).join(' ').replace(/"/g, '');
            memory.gambar.ctx.font = huruf;
            memory.gambar.huruf = huruf;
            break;
        }

        case 'rata': {
            if (!cekKanvas()) break;
            const meluruskan = tokens[2];
            memory.gambar.ctx.textAlign = meluruskan;
            memory.gambar.meluruskan = meluruskan;
            break;
        }

        case 'dasar': {
            if (!cekKanvas()) break;
            const garisdasar = tokens[2];
            memory.gambar.ctx.textBaseline = garisdasar;
            memory.gambar.garisdasar = garisdasar;
            break;
        }

        case 'simpan': {
            if (!cekKanvas()) break;
            const namafile = tokens[2].replace(/"/g, '');
            try {
                const out = fs.createWriteStream(namafile);
                const stream = memory.gambar.kanvas.createPNGStream();
                stream.pipe(out);
                out.on('finish', () =>  {
                    console.log(`Gambar tersimpan sebagai ${namafile}`);
                });
            } catch (err) {
                console.error(`Gagal menyimpan gambar: ${err.message}`);
            }
            break;
        }

        case 'hapus-canvas': {
            if (!cekKanvas()) break;
            const { ctx, lebar, tinggi } = memory.gambar;
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, lebar, tinggi);
            ctx.fillStyle = memory.gambar.warna;
            console.log("Kanvas dibersihkan.");
            break;
        }
 
        default:
            console.error(`Perintah gambar tidak dikenali: ${perintah}`);
    }
}

module.exports = { gambar };
