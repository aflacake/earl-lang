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
  } else if (arg === 'semua') {
    console.log('=== DEBUG MEMORY ===');
    console.log('Isi memory saat ini', JSON.stringify(memory, null, 2));

    console.log('=== DEBUG CONTEXT ===');
    console.log('Konteks eksekusi:', {
      index: context.index,
      total_baris: context.lines.length,
      baris_saat_ini: context.lines[context.index]
    });

  } else if (memory[arg] && memory[arg].__tipe === 'kelas') {
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
