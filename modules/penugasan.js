// modules/penugasan.js

function isBooleanString(str) {
  return ['benar', 'salah', 'tidak benar'].includes(str);
}

function parseBoolean(str) {
  if (str === 'benar') return true;
  if (str === 'salah' || str === 'tidak benar') return false;
  return null;
}

function isAssignmentLine(tokens) {
  return (
    tokens.length >= 3 &&
    tokens[0].startsWith(':') &&
    tokens[0].endsWith(':') &&
    tokens[1] === '='
  );
}

async function penugasan(tokens, modules, context) {
  const rawNama = tokens[0];
  const nama = rawNama.slice(1, -1).toLowerCase();
  const nilaiStr = tokens.slice(2).join(' ').trim();

  if (!context.tipeVariabel || !context.tipeVariabel[nama]) {
    console.error(`Variabel '${nama}' belum ditetapkan dengan tipe.`);
    return;
  }

  const tipe = context.tipeVariabel[nama];

  if (tipe === 'pilihan') {
    if (!isBooleanString(nilaiStr)) {
      console.error(`Nilai '${nilaiStr}' tidak valid untuk tipe pilihan.`);
      return;
    }

    const nilai = parseBoolean(nilaiStr);
    context.lingkup[context.lingkup.length - 1][nama] = nilai;
    console.log(`Variabel '${nama}' diatur ke ${nilai}`);
    return;
  }

  console.error(`Tipe '${tipe}' belum didukung oleh penugasan langsung.`);
}

module.exports = {
  ':penugasan:': penugasan,
  isAssignmentLine,
};
