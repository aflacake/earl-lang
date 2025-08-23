#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { jalankanEarlDalamSandbox } = require('../vm/vm-penjalankan');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log("Gunakan: earl file.earl  atau  earl \"atur :angka: = 42\\ntampilkan :angka:\"");
  process.exit(1);
}

let kode = '';
const masukkan = args[0];

if (masukkan.endsWith('.earl') && fs.existsSync(masukkan)) {
  kode = fs.readFileSync(masukkan, 'utf8');
} else {
  kode = masukkan.replace(/\\n/g, '\n');
}

jalankanEarlDalamSandbox(kode)
  .then(() => {
    console.log('Eksekusi selesai.');
  })
  .catch(err => {
    console.error('Eksekusi gagal:', err.message);
    process.exit(1);
  });
