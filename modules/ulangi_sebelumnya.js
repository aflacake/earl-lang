// modules/ulangi_sebelumnya.js

async function ulangi_sebelumnya(tokens, modules, context) {
    context.index -= 2;

    if (context.index < 0) context.index = 0;

    context.berhenti = true;
}

module.exports = { ulangi_sebelumnya };
