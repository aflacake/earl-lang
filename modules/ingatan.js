// modules/ingatan.js

const os = require('os');

async function ingatan(tokens, modules, context) {
    const total = os.totalmem() / 1024 / 1024;
    const sisa = os.freemem() /1024 / 1024;
    const digunakan = total - sisa;
    console.log(`Penggunaan memori saat ini: ${used.toFixed(2)} MB dari total ${total.toFixed(2)} MB`);
}

module.exports = { ingatan };
