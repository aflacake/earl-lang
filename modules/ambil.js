// ambil.js

function ambil(tokens, modules, context) {
    if (!tokens || tokens.length < 4 || tokens[2] !== 'dari') {
        console.error("Format salah. Gunakan: ambil :var: dari sumber");
        return;
    }

    if (!context.lingkup || context.lingkup.length === 0) {
        context.lingkup = [{}];
    }

    const targetToken = tokens[1];
    const sumberToken = tokens[3];

    if (!targetToken.startsWith(':') || !targetToken.endsWith(':')) {
        console.error("Variabel tujuan harus dalam format :nama:");
        return;
    }

    const targetNama = targetToken.slice(1, -1);
    const sumberNama = sumberToken.slice(1, -1);

    function cariDariLingkup(nama) {
        for (let i = context.lingkup.length - 1; i >= 0; i--) {
            if (nama in context.lingkup[i]) {
                return context.lingkup[i][nama];
            }
        }
        return undefined;
    }

    const nilai = cariDariLingkup(sumberNama);
    if (nilai === undefined) {
        console.error(`Variabel '${sumberNama}' tidak ditemukan.`);
        return;
    }

    context.lingkup[context.lingkup.length - 1][targetNama] = nilai;
    console.log(`Variabel '${targetNama}' diisi dari '${sumberNama}':`, nilai);
}

module.exports = { ambil };
