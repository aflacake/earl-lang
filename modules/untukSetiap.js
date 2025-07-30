const { resolveToken } = require('./tampilkan');

async function untukSetiap(tokens, modules, context) {
  if (tokens.length < 4 || tokens[2] !== 'setiap') {
    console.error("Format salah. Gunakan: untukSetiap koleksi setiap :item:");
    return;
  }

  const koleksiToken = tokens[1];
  const itemToken = tokens[3];

  if (!itemToken.startsWith(':') || !itemToken.endsWith(':')) {
    console.error("Variabel item harus dalam format :nama:");
    return;
  }

  const blokPerintah = context.currentNode?.body ?? [];

  if (!blokPerintah.length) {
    console.error("Blok perintah tidak ditemukan untuk 'untukSetiap'.");
    return;
  }

  const koleksi = resolveToken(koleksiToken, context, modules);

  if (!Array.isArray(koleksi)) {
    console.error(`Koleksi '${koleksiToken}' bukan array.`);
    return;
  }

  const namaVariabel = itemToken.slice(1, -1);

  for (const item of koleksi) {
    context.lingkup.push({ [namaVariabel]: item });

    for (const node of blokPerintah) {
      const handler = modules[node.type];
      if (!handler) {
        console.error(`Modul tidak dikenali: '${node.type}'`);
        continue;
      }
      try {
        await handler(node.tokens, modules, context);
      } catch (err) {
        console.error(`Kesalahan saat menjalankan '${node.type}':`, err.message);
      }
    }

    context.lingkup.pop();
  }

  console.log(`Perintah 'untukSetiap' selesai dieksekusi untuk koleksi: ${koleksiToken}`);
}

untukSetiap.isBlock = true;

module.exports = { untukSetiap };
