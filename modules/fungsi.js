const fungsi = async (tokens, modules, context) => {
  const namaFungsi = tokens[1].replace(/\(\)/g, '');
  const body = [];

  context.index++;
  while(context.index < context.lines.length) {
    const line = context.lines[context.index].trim();
    if (line === ')') break;
    body.push.(line);
    context.index++;
  }

  modules[namaFungsi] = async () => {
    for (let line of body) {
      const tokens = modules.tokenize(line);
      if (tokens.length === 0) continue;
      const cmd = tokens[0];

      if (modules[cmd]) {
        await modules[cmd](tokens, modules, context);
      }
    }
  }
}
