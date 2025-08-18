// modules/untukSetiap.js

const { resolveToken } = require('./tampilkan');
const { validasiNumerik } = require('../utili');

async function untukSetiap(tokens, modules, context) {
  if (tokens.length < 4 || tokens[2] !== 'setiap') {
    console.error("Format salah. Gunakan: untukSetiap koleksi setiap :barang:");
    return;
  }

  const koleksiToken = tokens[1];
  const itemToken = tokens[3];

  if (!itemToken.startsWith(':') || !itemToken.endsWith(':')) {
    console.error("Variabel barang harus dalam format :nama:");
    return;
  }

  if (!context.currentNode || !Array.isArray(context.currentNode.body)) {
    console.error("Blok perintah tidak ditemukan untuk 'untukSetiap'.");
    return;
  }

  const koleksi = resolveToken(koleksiToken, context, modules);
  if (!Array.isArray(koleksi)) {
    console.error(`Koleksi '${koleksiToken}' bukan array.`);
    return;
  }

  const namaVariabel = itemToken.slice(1, -1);

  const lingkupAsli = context.lingkup || [{}];
  context.lingkup = [...lingkupAsli];

  for (const barang of koleksi) {
    if (typeof barang === 'number' && !validasiNumerik(barang)) {
      console.warn(`Barang '${barang}' di koleksi '${koleksiToken}' tidak valid (underflow atau overflow). Lewati barang ini.`);
      continue;
    }

    context.lingkup.push({ [namaVariabel]: barang });

    for (const node of context.currentNode.body) {
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

  context.lingkup = lingkupAsli;

  console.log(`Perintah 'untukSetiap' selesai dieksekusi untuk koleksi: ${koleksiToken}`);
}

untukSetiap.isBlock = true;

module.exports = { untukSetiap };
