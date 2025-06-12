// modules/fungsi.js

function fungsi (tokens, modules, context) {
  const namaFungsi = tokens[1].replace(/\(\)/g, '');
  const body = [];

  context.index++;
  if (context.lines[context.index].trim() !== '(') {
    throw new Error("Fungsi harus diikuti blok kode dengan tanda kurung buka '('");
  }
  
  let depth = 1;
  context.index++;


  while(context.index < context.lines.length) {
    const line = context.lines[context.index].trim();

    if (line === '(') {
        depth++;
    } else if (line === ')') {
        depth--;
        if (depth === 0) break;
    }

    body.push(line);
    context.index++;
  }

  context.index++;

  modules[namaFungsi] = async (tokens, modules, parentContext) => {
    const args = tokens.slice(1);
    const localContent = {
        index: 0,
        lines: [...body],
        vars: {},
        return: null,
        stopExecution: false,
        ...parentContext
    };

    while (localContent.index < localContext.lines.length) {
      const line = localContext.lines[localContext.index].trim();
      const innerTokens = modules.tokenize(line);

      if (!innerTokens || innerTokens.length === 0) {
          localContent.index++;
          continue;
      }

      const cmd =  innerTokens[0];

      if (modules[cmd]) {
        try {
            await modules[cmd](innerTokens, modules, localContext);
          } catch (err) {
            console.error(`Kesalahan dalam fungsi '${namaFungsi}':`, err.message);
          }
        } else {
            console.error(`Perintah '${cmd}' tidak dikenali dalam fungsi '${namaFungsi}'`);
        }
        if (localContext.stopExecution) break;
        localContext.index++;
    }
    return localContext.return;
  };
}

module.exports = { fungsi };
