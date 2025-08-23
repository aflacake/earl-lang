#!/usr/bin/env node

const { jalankanEarlDalamSandbox } = require('../vm/vm-penjalankan');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log("Gunakan: earl \"kode\"");
  process.exit(1);
}

const rawInput = args.join(' ');
const kodeEarl = rawInput.replace(/\\n/g, '\n');

jalankanEarlDalamSandbox(kodeEarl)
  .then(() => {
  })
  .catch(err => {
    console.error('Kesalahan:', err.message);
    process.exit(1);
  });
