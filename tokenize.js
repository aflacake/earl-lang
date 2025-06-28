// tokenize.js

let sedangDalamKomentarMultibaris = false;

function tokenize(line) {
    const dipangkas = line.trim();

    if (dipangkas.startsWith('/--')) {
        sedangDalamKomentarMultibaris = true;
        return [];
    }

    if (sedangDalamKomentarMultibaris) {
        if (dipangkas.endsWith('--/')) {
            sedangDalamKomentarMultibaris = false;
        }
        return [];
    }

    if (dipangkas.startsWith('--') && dipangkas.endsWith('--')) {
        return [];
    }

    return dipangkas
        .replace(/([\[\](),])/g, ' $1 ')
        .replace(/:/g, ' : ')
        .match(/"[^"]*"|\S+/g);
}

module.exports = { tokenize };
