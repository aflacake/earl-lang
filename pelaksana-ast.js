// pelaksana-ast.js

async function laksanakanAST(ast, modules, context) {
  for (const node of ast) {
    const { type, tokens } = node;
    const handler = modules[type];
    if (!handler) {
      console.error(`Modul tidak dikenali: '${type}'`);
      continue;
    }
    try {
      context.currentNode = node;
      await handler(tokens, modules, context);

      if (context.berhenti) {
        console.log('Eksekusi dihentikan sementara oleh perintah berhenti.');
        context.berhenti = false;
        break;
      }
    } catch (err) {
      console.error(`Kesalahan saat menjalankan '${type}':`, err.message);
    }

    if (context.lanjutkan) break;
  }
}
