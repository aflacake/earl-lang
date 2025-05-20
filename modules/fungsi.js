// modules/fungsi.js

function fungsi (tokens, modules, context) {
  const namaFungsi = tokens[1].replace(/\(\)/g, '');
  const body = [];

  context.index++;
  if (context.lines[context.index].trim() !== '(') {
    throw new Error("Fungsi harus diikuti blok kode tanda kurung ()");
  }
  
  let depth = 1;
  context.index++;


  while(context.index < context.lines.length) {
    const line = context.lines[context.index].trim();
    if (line === ')') {
        depth++;
    } else if (line === ')') {
        depth--;
        if (depth === 0) {
            break;
        }
    }

    body.push(line);
    context.index++;
  }

  modules[namaFungsi] = async (tokens, modules, parentContext) => {
    const args = tokens.slice(1);
    const localContent = {
        index: 0;
        lines: body,
        vars: {};
        return: null,
        stopExecution: false,
        ...parentContext,
    };

    params.forEach((param, i) => {
        localContext.vars[param] = args[i] || '';
    });

    while (localContent.index < localContext.lines.length) {
      const line = localContent.lines[localContent.index].trim();
      const tokens = modules.tokenize(line);
      if (!tokens || tokens.length === 0) {
          localContent.index++;
          continue;
      }

      const evaluatedTokens = tokens.map(t => {
        return localContext.vars[t] !== undefined ? localContext.vars[t] : t;
      });

      const cmd =  evaluatedTokens[0];

      if (modules[cmd]) {
        await modules[cmd]( evaluatedTokens, modules, localContext);
      } else {
        console.error('Perintah '${cmd}' tidak dikenali dalam fungsi '${namaFungsi}'`)
      }
      if (localContext.stopExecution) break;
      localContext.index++;
    }
    return localContext.return;
  };
}

module.exports = { fungsi };
