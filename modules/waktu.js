// modules/waktu.js

async function waktu(tokens, modules, context) {
  const subcommand = tokens[1];

  switch (subcommand) {
    case "sekarang":
      console.log("Waktu sekarang", new Date().toLocaleString());
      break;

    case "tunda":
      const miliseconds = parseInt(tokens[2], 10);
      if (isNaN(miliseconds)) {
        console.error("Argumen tunda harus berupa angka (milidetik).");
        break;
      }
      await new Promise(resolve => setTimeout(resolve, miliseconds));
      break;

    case "format":
        const format = tokens[2];
        const now = new Date;
        if (!format || format === "default") {
            console.log(now.toLocaleString());
        } else if (format === "tanggal") {
            console.log(now.toLocaleDateString());
        } else if (format === "jam") {
            console.log(now.toLocaleTimeString());
        } else {
            console.error(`Format waktu tidak dikenali: ${format}`);
        }
        break;

    case "stempelwaktu":
        console.log(Date.now());
        break;

    case "beda":
        const waktu1 = new Date(tokens[2]);
        const waktu2 = new Date(tokens[3]);

        if (isNaN(waktu1) || isNaN(waktu2)) {
            console.error("Format waktu tidak valid. Gunakan format ISO, contoh: 2025-05-17T10:00:00");
        } else {
            const selisih = Math.abs(waktu2 - waktu1);
            console.log(`Selisih waktu: ${selisih} milidetik`);
        }
        break;

    default:
      console.log(`Subperintah waktu tidak dikenali: ${subcommand}`);
  }
}

module.exports = { waktu };
