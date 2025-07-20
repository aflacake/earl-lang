// modules/membangun.js

const { memory } = require('../memory.js');

function membangun(tokens) {
    const varName = tokens[1].slice(1, -1);

    if (tokens[2] === '=' && tokens[3] === 'dari') {
        const dari = tokens[4].replace(/"/g, '');
        const sampai = tokens[6].replace(/"/g, '');

        if (!isNaN(dari) && !isNaN(sampai)) {
            let hasil = [];
            let start = parseInt(dari);
            let end = parseInt(sampai);

            if (start <= end) {
                for (let i = start; i <= end; i++) {
                    hasil.push(i);
                }
            } else {
                for (let i = start; i >= end; i--) {
                    hasil.push(i);
                }
            }

            memory[varName] = hasil;
        } else if (dari.length === 1 && sampai.length === 1) {
            let hasil = [];
            let start = dari.charCodeAt(0);
            let end = sampai.charCodeAt(0);

            if (start <= end) {
                for (let i = start; i <= end; i++) {
                    hasil.push(String.fromCharCode(i));
                }
            } else {
                for (let i = start; i >= end; i--) {
                    hasil.push(String.fromCharCode(i));
                }
            }

            memory[varName] = hasil;
        } else {
            console.error("Format rentang tidak dikenali.");
        }
    }
}

module.exports = { membangun };
