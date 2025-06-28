// modules/fungsi.js

function fungsi (tokens, modules, context) {
  const header = tokens[1];
  const match = header.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\(([^)]*)\)$/);

  if (!match) {
     throw new Error("Format fungsi tidak valid. Gunakan: fungsi nama(param1, param2)");
  }

  const namaFungsi = match[1];
  const paramString = match[2].trim();
  const params = paramString ? paramString.split(',').map(p => p.trim()) : [];

  context.index++;

  if (context.lines[context.index].trim() !== '(') {
    throw new Error("Fungsi harus diikuti blok kode dengan tanda kurung buka '('");
  }
  
  let depth = 1;
  const body = [];

  context.index++;

  while(context.index < context.lines.length) {
    const line = context.lines[context.index].trim();

    if (line === '(') {
        depth++;
    } else if (line === ')') {
        depth--;
        if (depth === 0) break;
    }

    body.push(context.lines[context.index]);
    context.index++;
  }

  if (context.index >= context.lines.length && depth !== 0) {
      throw new Error(`Fungsi '${namaFungsi}' tidak ditutup dengan ')'`);
  }

  context.index++;

  const fungsiAST = {
      tipe: "fungsi",
      nama: namaFungsi,
      parameter: params,
      body: [...body],
      lokasi: context.lingkup.length === 1 ? 'global' : 'lokal'
  };

  modules.memory.__fungsi_ast__ = modules.memory.__fungsi_ast__ || {};
  modules.memory.__fungsi_ast__[namaFungsi] = fungsiAST;

  const fungsiBaru = async (tokens, modules, parentContext) => {
    const resolveToken = modules.resolveToken || (t => t);

    const args = await Promise.all(
        tokens.slice(1).map(async (tok) => {
            if (typeof tok === 'string' && tok.startsWith(':') && tok.endsWith(':')) {
                return await resolveToken(tok, parentContext);
            }
            return tok;
        })
    );

    const lokalLingkup = {};

    params.forEach((param, index) => {
        lokalLingkup[param] = args[index] ?? null;
    });

    const localContext = {
        index: 0,
        lines: [...body],
        lingkup: [...parentContext.lingkup, lokalLingkup],
        return: null,
        stopExecution: false,
    };

    while (localContext.index < localContext.lines.length) {
      const line = localContext.lines[localContext.index].trim();
      const innerTokens = modules.tokenize(line);

      if (!innerTokens || innerTokens.length === 0) {
          localContext.index++;
          continue;
      }

      const cmd =  innerTokens[0];

      const func =
          modules[cmd] ||
          localContext.lingkup
              .slice()
              .reverse()
              .map(scope => scope[cmd])
              .find(f => typeof f === 'function');

      if (func) {
          try {
              if (typeof func === 'function') {
                  await func(innerTokens, modules, localContext);
              } else {
                  console.error(`Modul '${cmd}' tidak valid di dalam fungsi '${namaFungsi}'`);
              }
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

  const scopeNow = context.lingkup[context.lingkup.length -1];
  scopeNow[namaFungsi] = fungsiBaru;

  if (context.lingkup.length === 1) {
      modules[namaFungsi] = fungsiBaru;
  }
}

module.exports = { fungsi };
