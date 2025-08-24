// pelaksana-ast.js

async function laksanakanAST(ast, modules, context) {
  for (const node of ast) {
    const { type, tokens } = node;

    if (
      context.tipeVariabel?.[tokens[0]] === 'pilihan' &&
      tokens[1] === '=' &&
      ['benar', 'salah'].includes(tokens[2])
    ) {
      await modules.aturPilihan(tokens, context);
      continue;
    }

    const handler = modules[type];
    if (!handler) {
      console.error(`Modul tidak dikenali: '${type}'`);
      continue;
    }

    try {
      context.currentNode = node;
      await handler(tokens, modules, context);

      if (context.berhenti) {
        console.log('Diberhentikan. Tekan ENTER untuk melanjutkan...');
        break;
      }

    } catch (err) {
      console.error(`Kesalahan saat menjalankan '${type}':`, err.message);
    }

    if (context.lanjutkan) {
      context.lanjutkan = false;
      continue;
    }
  }
}

module.exports = { laksanakanAST };
