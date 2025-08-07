// modules/apg.js

const { app, BrowserWindow } = require('electron');

let jendela;

async function buatJendela(url) {
  if (!app.isReady()) {
    await app.whenReady();
  }

  jendela = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  jendela.once('ready-to-show', () => {
    jendela.show();
  });
  await jendela.loadURL(url);
}

async function apg(tokens, modules, context) {
  try {
    const perintah = tokens[1];
    if (perintah === 'buka') {
      const url = tokens[2] || 'https://example.com';
      await buatJendela(url);
      context.return = 'Jendela dibuka';
    } else if (perintah === 'tutup') {
      if (jendela) {
        jendela.close();
        jendela = null;
        context.return = 'Jendela ditutup';
      } else {
        context.return = 'Tidak ada jendela yang terbuka';
      }
    } else {
      context.return = 'Perintah Antarmuka Pengguna Grafis tidak dikenali';
    }
  } catch (err) {
    context.return = `Kesalahan: ${err.message}`;
  }
}

module.exports = { apg };
