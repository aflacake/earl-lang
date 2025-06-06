// modules/prosesor.js

const os = require('os');

async function prosesor(tokens, modules, context) {
    const cpus = os.cpus();
    let menganggur = 0, total = 0;

    cpus.forEach(cpu => {
        for (const type in cpu.times) {
            total += cpu.times[type];
        }
        menganggur += cpu.times.idle;
    });

    const menganggurAvg = menganggur / cpus.length;
    const totalAvg = total /cpus.length;
    const penggunaan = 100 - (menganggurAvg / totalAvg) * 100;

    console.log(`Penggunaan CPU: ${penggunaan.toFixed(2)}%`);
}
module.exports = { prosesor };
