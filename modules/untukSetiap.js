// modules/untukSetiap.js

async function untukSetiap(tokens, modules, context) {
    if (tokens.length < 4 || tokens[2] !== 'setiap') {
        console.error("Format salah. Gunakan: untukSetiap koleksi setiap :item: { perintah }");
        return;
    }

    const koleksiToken = tokens[1];
    const itemToken = tokens[3];
    const blokPerintah = context.currentNode?.body ?? [];

    if (!koleksiToken || !itemToken || blokPerintah.length === 0) {
        console.error("Format perintah 'untukSetiap' tidak lengkap.");
        return;
    }
    const koleksi = resolveToken(koleksiToken, context, modules);

    if (!Array.isArray(koleksi)) {
        console.error(`Koleksi '${koleksiToken}' bukan array.`);
        return;
    }

    for (const item of koleksi) {
        context.memory[itemToken] = item;

        for (let i = 0; i < blokPerintah.length; i++) {
            const { type, tokens: subTokens, body: subBody } = blokPerintah[i];
            if (type === 'perintah') {
                await modules[subTokens[0]](subTokens, modules, context);
            }
        }
    }
    console.log(`Perintah 'untukSetiap' selesai dieksekusi untuk koleksi: ${koleksiToken}`);
}

module.exports = { untukSetiap };
