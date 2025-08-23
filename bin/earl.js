#!/usr/bin/env node

// bin/earl.js

const fs = require('fs');
const path = require('path');
const { runEarl } = require('../index');

async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log("Gunakan: earl file.earl  atau  earl \"kode langsung\"");
        process.exit(1);
    }

    const input = args[0];

    if (input.endsWith('.earl') && fs.existsSync(input)) {
        const code = fs.readFileSync(input, 'utf8');
        await runEarl(code);
    } else {
        const code = input.replace(/\\n/g, '\n');
        await runEarl(code);
    }
}

main();
