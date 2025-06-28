// penjalankan.js

const fs = require('fs');
const path = require('path');

const { memory } = require('./memory');
const { tokenize } = require('./tokenize.js');
const { runEarl } = require('./pemroses.js');

const modules = {};

const modulesPath = path.join(__dirname, 'modules');
fs.readdirSync(modulesPath).forEach(file => {
    if (file.endsWith('.js')) {
        const mod = require(`./modules/${file}`);
        for (const [key, val] of Object.entries(mod)) {
            if (modules[key]) {
                console.warn(`Peringatan: Modul '${file}' mencoba menimpa '${key}' yang sudah ada.`);
            } else {
                modules[key] = val;
            }
        }
    }
});

modules.memory = memory;
modules.tokenize = tokenize;
modules.runEarl = runEarl;

module.exports = { runEarl, modules };
