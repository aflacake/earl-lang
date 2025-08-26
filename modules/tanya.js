// modules/tanya.js

async function tanya(tokens, modules, context) {
    if (tokens.length < 4 || tokens[2] !== '->') {
        console.error("Format: tanya \"pertanyaan?\" -> :variabel:");
        return;
    }

    const pertanyaan = tokens[1];
    const varName = tokens[3].slice(1, -1);

    const jawaban = await modules.bacaBaris(`${pertanyaan} (lanjutkan/kembali): `);

    context.memory[varName] = jawaban.trim().toLowerCase();
    console.log(`Jawaban disimpan di variabel '${varName}':`, context.memory[varName]);
}

module.exports = { tanya };
