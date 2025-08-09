// electron.js

const { app } = require('electron');
const path = require('path');
const fs = require('fs');
const { runEarl } = require('./index');

app.whenReady().then(async () => {
  const args = process.argv.slice(2);
  if (args.length > 0) {
    const kode = fs.readFileSync(args[0], 'utf8');
    await runEarl(kode);
  }

  app.quit();
});
