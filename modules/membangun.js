// modules/membangun.js

import { memory } from '../memory.js';

export function membangun(tokens) {
    const varName = tokens[1].slice(1, -1);

    if (tokens[2] === 'dari') {
        const dari = tokens[3].replace(/"/g, '');
        const sampai = tokens[5].replace(/"/g, '');

        if (!isNaN(dari) && !isNaN(sampai)) {
            const hasil = [];
            for (let i = parseInt(dari); i <= parseInt(sampai); i++) {
                hasil.push(i);
            }
            memory[varName] = hasil;
        } 
        else if (dari.length === 1 && sampai.length === 1) {
            const hasil = [];
            let start = dari.charCodeAt(0);
            let end = sampai.charCodeAt(0);
            for (let i = start; i <= end; i++) {
                hasil.push(String.fromCharCode(i));
            }
            memory[varName] = hasil;
        }
        else {
            console.error("Format membangun tidak dikenali.")
        }
    }
}
