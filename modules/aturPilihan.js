// modules/aturPilihan.js

function aturPilihan(tokens, context) {
  const nama = tokens[0];
  const operator = tokens[1];
  const nilaiTokens = tokens.slice(2);

  if (operator !== '=') {
    console.error(`Gunakan format: NAMA = benar atau salah atau tidak benar`);
    return;
  }

  const nilaiStr = nilaiTokens.join(' ');

  let booleanValue;

  if (nilaiStr === 'benar') {
    booleanValue = true;
  } else if (nilaiStr === 'salah' || nilaiStr === 'tidak benar') {
    booleanValue = false;
  } else {
    console.error(`Nilai '${nilaiStr}' tidak dikenali. Gunakan: benar atau salah atau tidak benar`);
    return;
  }

  if (!context.tipeVariabel || context.tipeVariabel[nama] !== 'pilihan') {
    console.error(`Variabel '${nama}' belum ditetapkan sebagai 'pilihan'.`);
    return;
  }

  context.lingkup[context.lingkup.length - 1][nama] = booleanValue;
  console.log(`Variabel '${nama}' diatur ke ${booleanValue}`);
}

module.exports = { aturPilihan };
