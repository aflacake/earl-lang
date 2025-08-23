#!/usr/bin/env node

// bin/earl.js

const fs = require('fs');
const path = require('path');
const { jalankanEarlDalamSandbox } = require('../vm/vm-penjalankan');

const args = process.argv.slice(2);

async function main() {
  if (args.length === 0) {
    console.log("Gunakan: earl file.earl  atau  earl \"kode langsung\"");
    process.exit(1);
  }

  const input = args[0];
  let code = '';

  if (input.endsWith('.earl') && fs.existsSync(input)) {
      code = fs.readFileSync(input, 'utf8');
  } else {
      code = input.replace(/\\n/g, '\n');
  }

  console.log('Menjalankan kode dalam kotakpasir:\n', code);
  const hasil = await jalankanEarlDalamSandbox(code);
  console.log('Hasil kotakpasir:', hasil);
}

main().catch(err => {
  console.error('Gagal menjalankan Earl dalam kotakpasir:', err);
  process.exit(1);
});
