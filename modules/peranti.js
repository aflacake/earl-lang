// modules/peranti.js

const { exec } = require('child_process');
const os = require('os');

function toGB(bytes) {
    return (bytes / 1024 / 1024 / 1024).toFixed(2);
}

async function peranti(tokens, modules, context) {
    const panggung = os.platform();

    if (panggung === 'win32') {
        exec('wmic logicaldisk get Caption,Size,FreeSpace', (error, stdout, stderr) => {
            if (error) {
                console.error('Gagal mendapatkan info disk di Windows.');
                return;
            }
            const garisGaris = stdout.trim().split('\n').slice(1);
            console.log('Informasi Disk (Windows):');
            garisGaris.forEach(garis => {
                const bagianBagian = garis.trim().split(/\s+/);
                if (bagianBagian.length === 3) {
                    const [drive, sisa, ukuran] = bagianBagian;
                    const digunakan = ukuran - sisa;
                    const persenDigunakan = (digunakan / ukuran) * 100;
                    console.log(`Drive ${drive}: Terpakai ${toGB(digunakan)} GB / ${toGB(ukuran)} GB (${persenDigunakan.toFixed(1)}%)`);
                }
            });
        });
    } else if (panggung === 'linux' || panggung === 'darwin') {
        exec('df -k /', (error, stdout, stderr) => {
            if (error) {
                console.error('Gagal mendapatkan info disk di Unix-like OS.');
                return;
            }
            const barisBaris = stdout.trim().split('\n');
            const data = barisBaris[1].split(/\s+/);

            const total = parseInt(data[1]) * 1024;
            const digunakan = parseInt(data[2]) * 1024;
            const tersedia = parseInt(data[3]) * 1024;
            const persenDigunakan = (digunakan / total) * 100;

            console.log('Informasi Disk (Unix-like):');
            console.log(`Root /: Terpakai ${toGB(digunakan)} GB / ${toGB(total)} GB (${persenDigunakan.toFixed(1)}%)`);
        });
    } else {
        console.error(`Sistem operasi '${panggung}' tidak dikenali atau tidak didukung.`);
    }
}
module.exports = { peranti };
