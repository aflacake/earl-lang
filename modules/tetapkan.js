// modules/tetapkan.js

function tetapkan(tokens, context) {
  if (!context.tipeVariabel) context.tipeVariabel = {};

  if (tokens.length !== 4 || tokens[2] !== 'sebagai') {
    console.error("Format salah. Gunakan: tetapkan NAMA sebagai pilihan");
    return;
  }

  const nama = tokens[1];
  const tipe = tokens[3];

  if (tipe === 'pilihan') {
    context.tipeVariabel[nama] = 'pilihan';
    console.log(`Variabel '${nama}' ditetapkan sebagai pilihan.`);
  } else {
    console.error(`Tipe '${tipe}' tidak dikenali.`);
  }
}

module.exports = { tetapkan };
