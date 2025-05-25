// modules/kembalikan.js

async function kembalikan(tokens, modules, context) {
    const hasil = tokens.slice(1).join('');
    context.return = hasil;
    context.stopExecution = true;
}

module.exports = { kembalikan };
