// modules/jikaLainnya.js

const { memory } = require('../memory.js');

async function jikaLainnya(tokens, modules, context) {
    const lines = context.lines;
    let i = context.index;
    let kondisiTerpenuhi = false;

    while (i < lines.length) {
        const baris = lines[i].trim();
        const tokensBaris = baris.match(/"[^"]*"|\S+/g) || [];

        if (tokenBaris.length === 0) {
            i++;
            continue;
        }

        const kataKunci = tokenBaris[0];
        if (kataKunci === 'jika' && !kondisiTerpenuhi) {
            kondisiTerpenuhi = true;
            i++;
            while (i < lines.length) {
                const ln = lines[i].trim();
                if (ln.startsWith('jika-lainnya' || ln === 'lain' || ln === 'selesai-jika') break;
                await modules.tampilkan(ln.match(/"[^"]*"|\S+/g), modules, {index:0, lines:[]});
                i++;
            }
        } else if (katakunci === 'jika-lainnya' && !kondisiTerpenuhi) {
            kondisiTerpenuhi = true;
            i++;
            while (i < lines.length) {
                const ln = lines[i].trim();
                if (ln === 'lain' || ln === 'selesai jika') break;
                await modules.tampilkan(ln.match(/"[^"]*"|\S+/g), modules, {index:0, lines:[]});
                i++;
            }
        } else if (kataKunci === 'lain' && !kondisiTerpenuhi) {
            kondisiTerpenuhi = true;
            i++;
            while (i < lines.length) {
                const ln = lines[i].trim();
                if (ln === 'selesai-jika') break;
                await modules.tampilkan(ln.match(/"[^"]*"|\S+/g), modules, {index: 0, lines:[]});
                i++;
            }
        } else if (kataKunci === 'selesai-jika) {
            context.index = i;
            return;
        } else {
            i++;
        }
    }
}

module.exports = { jikaLainnya }
