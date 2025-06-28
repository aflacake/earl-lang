// modules/berhenti.js

const raedline = require('readline');

function berhenti(tokens, modules, context) {
    return new Promise(resolve => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question('Diberhentikan. Tekan ENTER untuk melanjutkan...', () => {
            rl.close();
            resolve();
        });
    });
}

module.exports = { berhenti };
