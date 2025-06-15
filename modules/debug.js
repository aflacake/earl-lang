// modules/debug.js

const { memory } = require('../memory.js');

async function debug(tokens, modules, context) {
  const arg = tokens[1];

  if (!arg || arg === 'memory') {
    console.log('=== DEBUG MEMORY ===');
    console.log('Isi memory saat ini', JSON.stringify(memory, null, 2));

  } else if (arg === 'context') {
    console.log('=== DEBUG CONTEXT ===');
    console.log('Konteks eksekusi:', {
      index: context.index,
      total_baris: context.lines.length,
      baris_saat_ini: context.lines[context.index]
    });

  } else if (arg === 'gambar') {
      if (!memory.gambar) {
          console.log("Belum ada kanvas yang dibuat.");
      } else {
          console.log("=== DEBUG GAMBAR ===");
          console.log(`Ukuran kanvas: ${memory.gambar.lebar} x ${memory.gambar.tinggi}`);
          console.log(`Warna aktif: ${memory.gambar.warna}`);
      }

  } else if (arg === 'semua') {
    console.log('=== DEBUG MEMORY ===');
    console.log('Isi memory saat ini', JSON.stringify(memory, null, 2));

    console.log('=== DEBUG CONTEXT ===');
    console.log('Konteks eksekusi:', {
      index: context.index,
      total_baris: context.lines.length,
      baris_saat_ini: context.lines[context.index]
    });

  } else if (/^:[^:\[\]]+\[\d+\]:$/.test(arg)) {
    const match = arg.match(/^:([^:\[\]]+)\[(\d+)\]:$/);
    const nama = match[1];
    const index = parseInt(match[2]);

    if (!(nama in memory)) {
        console.warn(`Variabel '${nama}' tidak ditemukan.`);
        return;
    }

    const daftar = memory[nama];
    if (!Array.isArray(daftar)) {
      console.warn(`Variabel '${nama}' bukan daftar.`);
      return;
    }
    const nilai = daftar[index];
    console.log(`=== DEBUG DAFTAR: ${nama}[${index}] ===`);
    console.log(nilai !== undefined ? nilai : `Tidak ada elemen pada indeks ${index}`);

  } else if (Array.isArray(memory[arg])) {
    console.log(`=== DEBUG DAFTAR: ${arg} ===`);
    console.log(memory[arg]);

  } else if (memory[arg]?.__tipe === 'kelas') {
    console.log(`=== DEBUG KELAS: ${arg} ===`);
    console.log({
        atribut: memory[arg].atribut,
        instance: memory[arg].instance
    });
  } else {
    console.warn(`Argumen debug tidak dikenali: '${arg}'`);
  }
}

module.exports = { debug };
