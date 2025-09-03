// modules/peringatan.js

const levelColors = {
  peringatan: '\x1b[33m', // kuning
  bahaya: '\x1b[31m',     // merah
  info: '\x1b[34m',       // biru
};

function peringatan(tokens, modules, context) {
  const baris = context.lines?.[context.index] ?? tokens.slice(1).join(' ');

  const regex = /!!([\s\S]*?)!!/g;
  let cocok;
  let adaPeringatan = false;

  while ((cocok = regex.exec(baris)) !== null) {
    adaPeringatan = true;
    let pesan = cocok[1].trim();

    let level = 'peringatan'; // default
    const levelMatch = pesan.match(/^(\w+):\s*(.*)$/s);
    if (levelMatch) {
      const possibleLevel = levelMatch[1].toLowerCase();
      if (levelColors[possibleLevel]) {
        level = possibleLevel;
        pesan = levelMatch[2];
      }
    }

    const warna = levelColors[level] || levelColors.peringatan;
    const reset = '\x1b[0m';

    console.warn(`${warna}[${level.toUpperCase()}]${reset} ${pesan}`);
  }

  if (!adaPeringatan) {
    console.warn('Format peringatan salah. Gunakan sintaks: !!level: pesan!! atau !!pesan!!');
  }
}

module.exports = { peringatan };
