// modules/ambil.js
const { memory } = require('../memory.js');

function ambil(tokens) {
    const varName = tokens[1].slice(1, -1);
    const value = tokens[3].replace(/"/g, "");
    memory[varName] = value;
};

module.exports = { ambil };
