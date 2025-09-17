// modules/perpindahan.js

async function perpindahan(tokens, modules, context) {
    if (tokens.length < 3) {
        console.error("Format salah. Gunakan: perpindahan <asal> <tujuan>");
        return;
    }

    const asal = Number(tokens[1]) - 1;
    const tujuan = Number(tokens[2]) - 1;

    if (isNaN(asal) || isNaN(tujuan)) {
        console.error("Indeks harus berupa angka.");
        return;
    }

    if (asal < 0 || asal >= context.lines.length) {
        console.error(`Baris asal ${asal + 1} tidak valid.`);
        return;
    }

    if (tujuan < 0 || tujuan >= context.lines.length) {
        console.error(`Baris tujuan ${tujuan + 1} tidak valid.`);
        return;
    }

    const [baris] = context.lines.splice(asal, 1);

    context.lines.splice(tujuan, 0, baris);

    console.log(`Baris ${asal + 1} dipindahkan ke posisi ${tujuan + 1}`);
}

module.exports = { perpindahan };
