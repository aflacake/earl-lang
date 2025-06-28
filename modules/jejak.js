// modules/jejak.js

function jejak(tokens, modules, context) {
    console.log('Konteks:');
    console.dir(context, { depth: 2, colors: true });

    console.log('\n Memori:');
    console.dir(modules.memory, { depth: 2, colors: true });
}

module.exports = { jejak };
