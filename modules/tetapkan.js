// modules/tetapkan.js

function tetapkan(tokens, context) {
  if (tokens.length < 4) {
    console.error("Sintaks 'tetapkan' kurang lengkap");
    return;
  }

  const [_, nama, sebagai, tipe] = tokens;

  if (sebagai !== 'sebagai' || tipe !== 'pilihan') {
    console.error("Format salah, gunakan: tetapkan NAMA sebagai pilihan");
    return;
  }

  if (!context.tipeVariabel) context.tipeVariabel = {};
  context.tipeVariabel[nama] = 'pilihan';

  if (!context.memory) context.memory = {};
  context.memory[nama] = false;

  console.log(`Variabel '${nama}' ditetapkan sebagai pilihan.`);
}

function aturPilihan(tokens, context) {
  if (tokens.length < 3 || tokens[1] !== '=') {
    console.error("Format salah untuk mengatur nilai pilihan");
    return;
  }

  const nama = tokens[0];
  let nilai = tokens.slice(2).join(' ').trim();

  if (!context.tipeVariabel || context.tipeVariabel[nama] !== 'pilihan') {
    console.error(`Variabel '${nama}' bukan tipe pilihan.`);
    return;
  }

  if (nilai.toLowerCase() === 'benar') nilai = true;
  else if (nilai.toLowerCase() === 'salah') nilai = false;
  else {
    console.error(`Nilai '${nilai}' tidak valid untuk pilihan (gunakan 'benar' atau 'salah')`);
    return;
  }

  context.memory[nama] = nilai;
  console.log(`Variabel '${nama}' diatur ke`, nilai);
}

module.exports = { tetapkan, aturPilihan };
