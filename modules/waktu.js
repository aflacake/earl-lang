// modules/waktu.js

async function waktu(tokens, modules, context) {
  const subcommand = tokens[1];

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
        console.log(`Waktu (${zona.toUpperCase()}):`, formatter.format(sekarang));
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
        switch (format) {
            case "bawaan":
            case undefined:
                console.log(now.toLocaleString());
                break;
            case "tanggal":
                console.log(now.toLocaleDateString());
                break;
            case "jam":
                console.log(now.toLocaleTimeString());
                break;
            case "iso":
                console.log(now.toISOString());
                break;
            default:
            console.error(`Format waktu tidak dikenali: ${format}`);
        }
        break;
      }

    case "stempelwaktu":
        console.log(Date.now());
        break;

    case "beda":
        const waktu1 = new Date(tokens[2]);
        const waktu2 = new Date(tokens[3]);

        if (isNaN(waktu1.getTime()) || isNaN(waktu2.getTime())) {
            console.error("Format waktu tidak valid. Gunakan format ISO, contoh: 2025-05-17T10:00:00");
        } else {
            const selisih = Math.abs(waktu2 - waktu1);
            console.log(`Selisih waktu: ${selisih} milidetik`);
        }
        break;

  case "ambil": {
      const comp = tokens[2];
      const sekarang = new Date();
      switch () {
          case "tahun": console.log(sekarang.getFullYear()); break;
          case "bulan": console.log(sekarang.getMonth() + 1); break;
          case "hari": console.log(sekarang.getDate()); break;
          case "jam": console.log(sekarang.getHours()); break;
          case "menit": console.log(sekarang.getMinutes()); break;
          case "detik": console.log(sekarang.getSeconds()); break;
          default:
              console.error(`Komponen waktu tidak dikenali: ${comp}`);
      }
      break;
  }

  default:
    console.log(`Subperintah waktu tidak dikenali: ${subcommand}`);
  }
}

module.exports = { waktu };
