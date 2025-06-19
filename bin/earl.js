#!/usr/bin/env mode
const fs = require('fs');
const path = require('path');
const { runEarl } = require('../index');

const args = process.argv.slice(2);

if (args.length === 0) {
    console.log("Gunakan: earl file.earl");
    process.exit(1);
}

const filePath = path.resolve(process.cwd(), args[0]);

if (!fs.exitsSync(filePath)) {
    console.error(`File '${args[0]}' tidak ditemukan.`);
    process.exit(1);
}

const code = fs.readFileSync(filePath, 'utf8');
runEarl(code);
