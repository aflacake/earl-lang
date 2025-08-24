// modules/aturPilihan.js

function aturPilihan(tokens, context) {
  const nama = tokens[0];
  const operator = tokens[1];
  const nilai = tokens[2];

  if (operator !== '=' || !['benar', 'salah'].includes(nilai)) {
    console.error(`Gunakan format: NAMA = benar atau salah`);
    return;
  }

  if (!context.tipeVariabel || context.tipeVariabel[nama] !== 'pilihan') {
    console.error(`Variabel '${nama}' belum ditetapkan sebagai 'pilihan'.`);
    return;
  }

  const booleanValue = nilai === 'benar';
  context.lingkup[context.lingkup.length - 1][nama] = booleanValue;
  console.log(`Variabel '${nama}' diatur ke ${booleanValue}`);
}

module.exports = { aturPilihan };
