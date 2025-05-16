// modules/debug.js

const { memory } = require('../memory.js');

async function debug(tokens, modules, context) {
  const arg = tokens[1];

  if (!arg || arg === memory) {
    console.log('Isi mempry saat ini', JSON.stringify(memory, null, 2));
  } else if (arg === 'context') {
    console.log('Konteks eksekusi:', {
      index: context.index,
      sisa_baris: context.lines.length - context.index
    });
  } else {
    console.warn(`Argumen debug tidak dikenali: '${arg}'`);
  }
}

module.exports = { debug };
