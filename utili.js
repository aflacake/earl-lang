// utili.js
const { memory } = require('./memory');

function ambilDaftarJikaPerlu(token) {
    if (token.startsWith(':') && token.endsWith(':')) {
        const nama = token.slice(1, -1);
        const nilai = memory[nama];
        if (Array.isArray(nilai)) return nilai;
    }
    return null;
}
module exports = { ambilDaftarJikaPerlu };
