// modules/fungsi.js

const { validasiNumerik } = require('../utili');

async function fungsi(tokens, modules, context) {
  const header = tokens[1];
  const match = header.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\(([^)]*)\)$/);

  if (!match) {
    console.error("Format fungsi tidak valid. Gunakan: fungsi nama(param1, param2)");
    return;
  }

  const namaFungsi = match[1];
  const paramString = match[2].trim();
  const params = paramString ? paramString.split(',').map(p => p.trim()) : [];

  let body = [];

  if (context.repl === true) {
    console.log(`Masukkan isi fungsi '${namaFungsi}'. Ketik 'selesai' untuk mengakhiri.`);
    while (true) {
      const line = await modules.bacaBaris("earl> ");
      if (line.trim().toLowerCase() === 'selesai') break;
      body.push(line);
    }
  }
  else {
    context.index++;
    if (context.lines[context.index]?.trim() !== '(') {
      console.error("Fungsi harus diikuti blok kode dengan tanda kurung buka '('");
      return;
    }

    let depth = 1;
    context.index++;

    while (context.index < context.lines.length) {
      const line = context.lines[context.index].trim();
      if (line === '(') depth++;
      else if (line === ')') {
        depth--;
        if (depth === 0) break;
      }
      body.push(context.lines[context.index]);
      context.index++;
    }

    if (depth !== 0) {
      console.error(`Fungsi '${namaFungsi}' tidak ditutup dengan ')'`);
      return;
    }
    context.index++;
  }

  modules.memory.__fungsi_ast__ = modules.memory.__fungsi_ast__ || {};
  modules.memory.__fungsi_ast__[namaFungsi] = {
    tipe: "fungsi",
    nama: namaFungsi,
    parameter: params,
    body: [...body],
    lokasi: context.lingkup.length === 1 ? 'global' : 'lokal'
  };

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
      const nilai = args[index] ?? null;
      if (typeof nilai === 'number' && !validasiNumerik(nilai)) {
        throw new Error(`Parameter '${param}' memiliki nilai numerik yang melampaui batas (underflow/overflow).`);
      }
      lokalLingkup[param] = nilai;
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

      const cmd = innerTokens[0];
      const func =
        modules[cmd] ||
        localContext.lingkup
          .slice()
          .reverse()
          .map(scope => scope[cmd])
          .find(f => typeof f === 'function');

      if (func) {
        try {
          await func(innerTokens, modules, localContext);
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

  const scopeNow = context.lingkup[context.lingkup.length - 1];
  scopeNow[namaFungsi] = fungsiBaru;

  if (context.repl === true || context.lingkup.length === 1) {
    modules[namaFungsi] = fungsiBaru;
  }

  console.log(`Fungsi '${namaFungsi}' telah didefinisikan.`);
}

module.exports = { fungsi };
