// modules/waktu.js

const { memory } = require('../memory');

async function waktu(tokens, modules, context) {
  const subcommand = tokens[1];

  const simpanJikaPerlu = (nilai) => {
      const indexKe = tokens,indexOf("ke");
      if (indexKe !== -1 && tokens[indexKe + 1]?.startsWith(":") && tokens[indexKe + 1]?.endsWith(":")) {
          const namaVar = tokens[indexKe + 1].slice(1, -1);
          memory[namaVar] = nilai;
      } else {
          console.log(nilai);
      }
  };

  switch (subcommand) {
    case "sekarang": {
        const zona = tokens[2] || "local";
        const zonaMap = {
            WIB: "Asia/Jakarta";
            WITA: "Asia/Makassar";
            WIT: "Asia/Jayapura";
            UTC: "UTC",
            LOCAL: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        const timeZone = zonaMap[zona.toUpperCase()];
        if (!timeZone) {
            console.error(`Zona waktu '${zona}' tidak dikenali.`);
            break;
        }
        const sekarang = new Date();
        const formatter = new Intl.DateTimeFormat("id-ID", {
            timeZone,
            dateStyle: "full",
            timeStyle: "long"
        });
        simpanJikaPerlu(formatter.format(sekarang));
        break;
    }

    case "tunda": {
      let durasi = tokens[2];
      const miliseconds = 0;
      if (/^\d+s$/.test(durasi)) {
            miliseconds = parseInt(durasi) * 1000;
      } else if (/^\d+ms$/.test(durasi)) {
            miliseconds = parseInt(durasi);
      } else {
            miliseconds = parseInt(durasi);
      }

      if (isNaN(miliseconds) || miliseconds < 0) {
          console.error("Argumen tunda harus berupa angka positif (milidetik atau detik dengan suffix s/ms).");
          break;
      }
      await new Promise(resolve => setTimeout(resolve, miliseconds));
      break;
    }

    case "format": {
        const format = tokens[2];
        const now = new Date;
        let hasil;
        switch (format) {
            case "bawaan":
            case undefined:
                hasil = now.toLocaleString();
                break;
            case "tanggal":
                hasil = now.toLocaleDateString();
                break;
            case "jam":
                hasil = now.toLocaleTimeString();
                break;
            case "iso":
                hasil = now.toISOString();
                break;
            default:
            console.error(`Format waktu tidak dikenali: ${format}`);
        }
        simpanJikaPerlu(hasil);
        break;
      }

    case "stempelwaktu":
        simpanJikaPerlu(Date.now());
        break;

    case "beda": {
        const waktu1 = new Date(tokens[2]);
        const waktu2 = new Date(tokens[3]);

        if (isNaN(waktu1.getTime()) || isNaN(waktu2.getTime())) {
            console.error("Format waktu tidak valid. Gunakan format ISO, contoh: 2025-05-17T10:00:00");
        } else {
            const selisih = Math.abs(waktu2 - waktu1);
            simpanJikaPerlu(selisih);
        }
        break;
    }

    case "ambil": {
        const comp = tokens[2];
        const sekarang = new Date();
        let hasil;
        switch (comp) {
            case "tahun": hasil = sekarang.getFullYear(); break;
            case "bulan": hasil = sekarang.getMonth() + 1; break;
            case "hari": hasil = sekarang.getDate(); break;
            case "jam": hasil = sekarang.getHours(); break;
            case "menit": hasil = sekarang.getMinutes(); break;
            case "detik": hasil = sekarang.getSeconds(); break;
            default:
                console.error(`Komponen waktu tidak dikenali: ${comp}`);
                return;
        }
        simpanJikaPerlu(hasil);
        break;
    }

    default:
      console.log(`Subperintah waktu tidak dikenali: ${subcommand}`);
    }
}

module.exports = { waktu };
