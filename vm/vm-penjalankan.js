// vm/vm-penjalankan.js

const fs = require('fs');
const path = require('path')
const vm = require('vm');
const { runEarl } = require('../index');

async function jalankanEarlDalamSandbox(kode, timeout = 1000) {
  const sandbox = {
    kode,
    runEarl,
    hasil: null,
    console: {
      log: (...args) => console.log('[kotakpasir]', ...args),
      error: (...args) => console.error('[kotakpasir]', ...args)
    }
  };

  const konteks = vm.createContext(sandbox);

  const skripsi = new vm.Script(`
    (async () => {
      hasil = await runEarl(kode);
    })();
  `);

  try {
    await skripsi.runInContext(konteks, { timeout });
    return sandbox.hasil;
  } catch (err) {
    console.error('Kesalahan saat menjalankan dalam kotakpasir:', err);
    throw err;
  }
}

if (require.main === module) {
  const inputArg = process.argv[2];

  if (!inputArg) {
    console.error('Harap masukkan kode Earl atau nama file .earl');
    console.log('\nContoh:');
    console.log('  node vm-penjalankan.js "atur :angka: = 42\\ntampilkan :angka:"');
    console.log('  node vm-penjalankan.js program.earl');
    process.exit(1);
  }

  let kode = '';

  if (inputArg.endsWith('.earl')) {
    const jalurPenuh = path.resolve(inputArg);
    if (!fs.existsSync(jalurPenuh)) {
      console.error(`File tidak ditemukan: ${jalurPenuh}`);
      process.exit(1);
    }

    kode = fs.readFileSync(jalurPenuh, 'utf8');
  } else {
    kode = inputArg.replace(/\\n/g, '\n');
  }

  jalankanEarlDalamSandbox(kode)
    .then(konteks => {
      console.log('Eksekusi selesai:', konteks);
    })
    .catch(err => {
      console.error('Eksekusi gagal:', err.message);
      process.exit(1);
    });
}

module.exports = { jalankanEarlDalamSandbox };
