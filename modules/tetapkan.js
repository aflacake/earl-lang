// modules/tetapkan.js

function tetapkan(tokens, modules, context) {
  if (tokens.length < 4 || tokens[2] !== 'sebagai') {
    console.error("Format salah. Gunakan: tetapkan :nama: sebagai tipe");
    return;
  }

  const rawNama = tokens[1];
  if (!rawNama.startsWith(':') || !rawNama.endsWith(':')) {
    console.error("Nama variabel harus dalam format :nama:");
    return;
  }

  const nama = rawNama.slice(1, -1).toLowerCase();

  const tipe = tokens[3];

  if (!context.tipeVariabel) context.tipeVariabel = {};
  context.tipeVariabel[nama] = tipe;

  console.log(`Variabel '${nama}' ditetapkan sebagai ${tipe}.`);
}

module.exports = { tetapkan };
