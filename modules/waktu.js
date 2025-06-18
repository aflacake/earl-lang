// modules/waktu.js

const { memory } = require('../memory');

async function waktu(tokens, modules, context) {
    if (!tokens[1]) {
        console.error("Perintah waktu membutuhkan subperintah. Contoh: waktu sekarang");
        return;
    }

  const subcommand = tokens[1];

  const simpanJikaPerlu = (nilai) => {
      const indexKe = tokens.indexOf("ke");
      if (indexKe !== -1 && tokens[indexKe + 1]?.startsWith(":") && tokens[indexKe + 1]?.endsWith(":")) {
          const namaVar = tokens[indexKe + 1].slice(1, -1);
          memory[namaVar] = nilai;
      } else {
          console.log(nilai);
      }
  };

  switch (subcommand) {
    case "bulan": {
        const sekarang = new Date();
        const bulanNama = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];
        simpanJikaPerlu(bulanNama[sekarang.getMonth()]);
        break;
    }

    case "hari": {
        const sekarang = new Date();
        const hariNama = [
            "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"
        ];
        simpanJikaPerlu(hariNama[sekarang.getDay()]);
        break;
    }

    case "hitungmundur": {
        const durasiStr = tokens[2];
        if (!durasiStr) {
            console.error("Gunakan format: waktu hitungmundur <durasi> [ke :var] [lalu <perintah>]");
            return;
        }

        let totalMs = 0;
        if (/^\d+s$/.test(durasiStr)) {
            totalMs = parseInt(durasiStr) * 1000;
        } else if (/^\d+ms$/.test(durasiStr)) {
            totalMs = parseInt(durasiStr);
        } else {
            console.error("Format durasi tidak valid. Gunakan angka diikuti 's' atau 'ms'.");
            return;
        }

        let simpanKe = null;
        const indexKe = tokens.indexOf("ke");
        if (indexke !== -1 && tokens[indexKe + 1]?.startsWith(":") && tokens[indexKe + 1]?.endsWith(":")) {
            simpanKe = tokens[indexKe + 1].slice(1, -1);
        }

        const indexLalu = tokens.indexOf("lalu");
        let perintahLanjut = null;
        if (indexLalu !== -1) {
            perintahLanjut = tokens.slice(indexLalu + 1).join(" ");
        }

        const interval = 1000;
        let sisaDetik = Math.ceil(totalMs / 1000);

        while (sisaDeti > 0) {
            console.log(sisaDetik);
            await new Promise(resolve => setTimeout(resolve, interval));
            sisaDetik--;
        }

        const hasil = "Selesai!";
        console.log(hasil);
        if (simpanKe) memory[simpanKe] = hasil;

        if (perintahLanjut) {
            const fakeContext = {
                ...context,
                lines: [perintahLanjut],
                index: 0
            };
            await modules.tokenize;
            await modules[fakeContext.lines[0].split(' ')[0]]?.(
                modules.tokenize(perintahLanjut),
                modules,
                fakeContext
            );
        }
        break;
    }

    case "sekarang": {
        const zona = tokens[2] || "local";
        const zonaMap = {
            WIB: "Asia/Jakarta",
            WITA: "Asia/Makassar",
            WIT: "Asia/Jayapura",
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
      let miliseconds = 0;
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
        const now = new Date();
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

    case "formatkustom": {
        const rawFormat = tokens[2];
        if (!rawFormat || !rawFormat.startsWith('"') || !rawFormat.endsWith('"')) {
            console.error('Gunakan tanda kutip ganda di format, contoh: waktu formatkustom "HH-BB-TTTT JJ:mm:dd"');
            return;
        }

        sekarang = new Date();
        const format = rawFormat.slice(1, -1);

        const hasil = format
            .replace(/TTTT/g, now.getFullYear())
            .replace(/BB/g, String(sekarang.getMonth() + 1).padStart(2, '0'))
            .replace(/HH/g, String(sekarang.getDate()).padStart(2, '0'))
            .replace(/JJ/g, String(sekarang.getHours()).padStart(2, '0'))
            .replace(/mm/g, String(sekarang.getMinutes()).padStart(2, '0'))
            .replace(/dd/g, String(sekarang.getSeconds()).padStart(2, '0'));

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
