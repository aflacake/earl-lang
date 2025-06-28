// pemroses.js

const { parse } = require('./parser');
const { laksanakanAST } = require('./pelaksana-ast')

async function runEarl(code, customModules = modules, parentContext) {
    const lines = code.trim().split('\n');
    const ast = parse(code);

    const context = parentContext ?? {
        index: 0,
        lines: [],
        lingkup: [{}],
        berhenti: false,
        lanjutkan: false
    };

    if (!parentContext) context.lines = lines;

    await laksanakanAST(ast, customModules, context);

    return context;
}

module.exports = { runEarl };
