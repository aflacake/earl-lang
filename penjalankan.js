// penjalankan.js

const fs = require('fs');
const path = require('path');

const { memory } = require('./memory');
const { tokenize } = require('./tokenize');
const { runEarl } = require('./pemroses');

const modules = { memory, tokenize, runEarl };

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

module.exports = { runEarl, modules };
