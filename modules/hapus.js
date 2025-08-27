async function hapus(tokens, modules, context) {
  if (!context.memory) context.memory = {};
  if (!context.lingkup) context.lingkup = [];

  if (tokens.length < 2) {
    console.error("Format salah. Gunakan: hapus :nama: atau hapus :objek.atribut:");
    return;
  }

  const namaVariabel = tokens[1];
  const pathRegex = /^:([a-zA-Z0-9_]+)((?:\.[a-zA-Z_][a-zA-Z0-9_]*|\[\d+\])+):$/;
  const pathMatch = namaVariabel.match(pathRegex);

  if (pathMatch) {
    const [, rootName, pathString] = pathMatch;

    const rootObj = context.memory[rootName];
    if (!rootObj) {
      console.error(`Objek '${rootName}' tidak ditemukan.`);
      return;
    }

    const pathParts = [];
    const regex = /\.([a-zA-Z_][a-zA-Z0-9_]*)|\[(\d+)\]/g;
    let match;
    while ((match = regex.exec(pathString)) !== null) {
      if (match[1]) pathParts.push(match[1]);
      else if (match[2]) pathParts.push(Number(match[2]));
    }

    let target = rootObj;
    for (let i = 0; i < pathParts.length - 1; i++) {
      target = target[pathParts[i]];
      if (target === undefined) {
        console.error(`Jalur tidak lengkap: bagian '${pathParts[i]}' tidak ditemukan.`);
        return;
      }
    }

    const key = pathParts[pathParts.length - 1];

    if (Array.isArray(target) && typeof key === 'number') {
      if (key < 0 || key >= target.length) {
        console.error(`Indeks ${key} di luar batas array.`);
        return;
      }
      target.splice(key, 1);
      console.log(`Elemen indeks ${key} pada '${rootName}' berhasil dihapus.`);
      return;
    } else if (key in target) {
      delete target[key];
      console.log(`Atribut '${key}' pada '${rootName}' berhasil dihapus.`);
      return;
    } else {
      console.error(`Kunci '${key}' tidak ditemukan.`);
      return;
    }
  }

  if (typeof namaVariabel === 'string' && namaVariabel.startsWith(':') && namaVariabel.endsWith(':')) {
    const nama = namaVariabel.slice(1, -1);

    let ditemukan = false;

    if (nama in context.memory) {
      delete context.memory[nama];
      console.log(`Variabel '${nama}' berhasil dihapus dari memori.`);
      ditemukan = true;
    }

    for (const scope of context.lingkup) {
      if (nama in scope) {
        delete scope[nama];
        console.log(`Variabel '${nama}' juga dihapus dari lingkup.`);
        ditemukan = true;
      }
    }

    if (!ditemukan) {
      console.error(`Variabel '${nama}' tidak ditemukan.`);
    }
    return;
  }

  console.error("Format salah. Gunakan: hapus :nama: atau hapus :objek.atribut:");
}

module.exports = { hapus };
