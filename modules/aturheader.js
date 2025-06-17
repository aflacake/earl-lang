// modules/aturheader.js

const { memory } = require('../memory.js');

function aturheader(tokens) {
    if(tokens.length < 3) {
        console.error('Format: aturheader "Header-Nama" nilai');
        return;
    }

    const kunci = tokens[1].replace// modules/aturheader.js

const { memory } = require('../memory.js');

function aturheader(tokens) {
    if(tokens.length < 3) {
        console.error('Format: aturheader "Header-Nama" nilai');
        return;
    }

    const kunci = tokens[1].replace(/^"+|"+$/g, '');
    const nilai = tokens.slice(2).join(' ').replace(/^"+|"+$/g, '');

    if (!kunci) {
        console.error(`Header tidak boleh kosong`);
        return;
    }

    if (!memory.__headers || typeof memory.__headers !== 'object') {
        memory.__headers = {};
    }

    memory.__headers[kunci] = nilai;
    console.log(`Header diset: ${kunci} = ${nilai}`);
}

module.exports = { aturheader };
