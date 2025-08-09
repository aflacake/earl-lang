// modules/apg.js

const { app, BrowserWindow, ipcMain } = require('electron');
const jalur = require('path');

let jendela;

async function buatJendela(url) {
  if (!app.isReady()) {
    await app.whenReady();
  }

  if (!/^https?:\/\//.test(url)) {
    throw new Error('URL tidak valid, harus diawali dengan http:// atau https://');
  }

  if (jendela) {
    jendela.close();
    jendela = null;
  }

  jendela = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: jalur.join(__dirname, 'pramuat.js'),
    }
  });

  jendela.once('ready-to-show', () => {
    jendela.show();
  });

  jendela.on('closed', () => {
    jendela = null;
  });

  if (!ipcMain.listenerCount('pesan-dari-jendela')) {
    ipcMain.on('pesan-dari-jendela', (event, arg) => {
      console.log('Dari jendela:', arg);
      if (jendela && jendela.webContents) {
        event.reply('balasan-dari-utama', `Pesan diterima: ${arg}`);
      }
    });
  }

  await jendela.loadURL(url);
}

async function apg(tokens, modules, context) {
  try {
    const perintah = tokens[1];
    if (perintah === 'buka') {
      const url = tokens[2] || 'https://example.com';
      await buatJendela(url);
      context.return = 'Jendela dibuka';
      console.log(context.return);
    } else if (perintah === 'kirim') {
      if (jendela) {
        const pesan = tokens.slice(2).join(' ');
        jendela.webContents.send('pesan-dari-utama', pesan);
        context.return = `Pesan dikirim ke jendela: ${pesan}`;
        console.log(context.return);
      } else {
        context.return = 'Tidak ada jendela yang terbuka';
        console.warn(context.return);
      }
    } else if (perintah === 'tutup') {
      if (jendela) {
        jendela.close();
        jendela = null;
        context.return = 'Jendela ditutup';
        console.log(context.return);
      } else {
        context.return = 'Tidak ada jendela yang terbuka';
        console.warn(context.return);
      }
    } else {
      context.return = 'Perintah Antarmuka Pengguna Grafis tidak dikenali';
      console.warn(context.return);
    }
  } catch (err) {
    context.return = `Kesalahan: ${err.message}`;
    console.error(context.return);
  }
}

apg.isBlock = false;

module.exports = { apg };
