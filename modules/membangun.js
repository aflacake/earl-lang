// modules/membangun.js

const { memory } = require('../memory.js');

function membangun(tokens) {
    const varName = tokens[1].slice(1, -1);

    if (tokens[2] === 'dari') {
        const dari = tokens[3].replace(/"/g, '');
        const sampai = tokens[5].replace(/"/g, '');

        if (!isNaN(dari) && !isNaN(sampai)) {
            const hasil = [];
            let start = parseInt(dari);
            let end = parseInt(sampai);

            if (start > end) {
                for (let i = start; i >= end; i--) {
                    hasil.push(i);
                }
            } else {
                for (let i = start; i <= end; i++) {
                    hasil.push(i);
                }
            }
            memory[varName] = hasil;
        } 
        else if (dari.length === 1 && sampai.length === 1) {
            const hasil = [];
            let start = dari.charCodeAt(0);
            let end = sampai.charCodeAt(0);

            if (start > end) {
                for (let i = start; i >= end; i--) {
                    hasil.push(String.fromCharCode(i));
                }
            } else {
                for (let i = start; i <= end; i++) {
                    hasil.push(String.fromCharCode(i));
                }
            }
            memory[varName] = hasil;
        }
        else {
            console.error("Format membangun tidak dikenali.");
        }
    }
}

module.exports = { membangun };
