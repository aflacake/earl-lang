// modules/berhenti.js

async function berhenti(tokens, modules, context) {
  return new Promise(resolve => {
    const rl = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('Diberhentikan. Tekan ENTER untuk melanjutkan...', () => {
      rl.close();
      context.berhenti = true;
      resolve();
    });
  });
}


module.exports = { berhenti };
