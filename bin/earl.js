#!/usr/bin/env node
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
    runEarl(code);
} else {
    const code = input.replace(/\\n/g, '\n');
    runEarl(code);
}
