// modules/ekspor.js

const fs = require('fs');

async function ekspor(tokens) {
  if (tokens.length < 3) {
    throw new Error ("Perintah 'ekspor' membutuhkam nama file dan isi.");
  }
  const fileName = tokens[1].replace(/['"]/g, '');
  const isi = tokens.slice(2).join(' ').replace(/['"]/g, '');

  fs.writeFileSync(fileName, isi, 'utf-8");
}

module.exports = { ekspor };
