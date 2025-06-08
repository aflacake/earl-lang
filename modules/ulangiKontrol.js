// modules/ulangiKontrol.js

function ulangiKontrol(tokens, modules, context) {
    const cmd = tokens[0];

    if (cmd === 'berhenti') {
        context.berhenti = true;
    }

    if (cmd === 'lanjutkan') {
        context.lanjutkan = true;
    }
}

module.exports = { ulangiKontrol };
