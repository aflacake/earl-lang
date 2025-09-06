// modules/berhenti.js

const readline = require('readline');

function berhenti(tokens, modules, context) {
    context.berhenti = true;

    return new Promise(resolve => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('Diberhentikan. Tekan ENTER untuk melanjutkan...', () => {
            rl.close();
            context.berhenti = false;
            resolve();
        });
    });
}

module.exports = { berhenti };
