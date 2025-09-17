// modules/perpindahan.js

function perpindahan(tokens, modules, context) {
    const from = parseInt(tokens[1], 10) - 1;
    const to = parseInt(tokens[2], 10) - 1;

    const source = context.memory.sourceLines;

    if (isNaN(from) || isNaN(to)) {
        console.error("Gunakan format: perpindahan <barisAsal> <barisTujuan>");
        return;
    }
    if (from < 0 || from >= source.length) {
        console.error(`Baris asal ${from + 1} tidak valid.`);
        return;
    }
    if (to < 0 || to > source.length) {
        console.error(`Baris tujuan ${to + 1} tidak valid.`);
        return;
    }

    const [line] = source.splice(from, 1);


    source.splice(to, 0, line);

    console.log(`Baris ${from + 1} dipindahkan ke posisi ${to + 1}.`);
}

module.exports = { perpindahan };
