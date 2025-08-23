#!/usr/bin/env node

// bin/earl.js
const fs = require('fs');
const path = require('path');
const { runEarl } = require('../index');

const args = process.argv.slice(2);

if (args.length === 0) {
    console.log("Gunakan: earl file.earl  atau  earl \"kode langsung\"");
    process.exit(1);
}

const input = args[0];

if (input.endsWith('.earl') && fs.existsSync(input)) {
    const code = fs.readFileSync(input, 'utf8');
    console.log('Kode yang akan dijalankan:', JSON.stringify(code));
    runEarl(code).then(() => process.exit(0));
} else {
    const code = input.replace(/\\n/g, '\n');
    console.log('Kode yang akan dijalankan:', JSON.stringify(code));
    runEarl(code).then(() => process.exit(0));
}
