// modules/apg.js

const { app, BrowserWindow, ipcMain } = require('electron');
const jalur = require('path');

const jendela = {};

async function buatJendela(url, opsi = {}, id = 'default') {
  if (!app.isReady()) {
    await app.whenReady();
  }

  if (!/^https?:\/\//.test(url) && !/^file:\/\//.test(url)) {
    throw new Error('URL tidak valid, harus diawali dengan http://, https://, atau file://');
  }

  if (jendela[id]) {
    jendela[id].close();
    jendela[id] = null;
  }

  const opsiWindow = Object.assign({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: jalur.resolve(__dirname, 'preload/pramuat.js'),
    }
  }, opsi);

  const win = new BrowserWindow(opsiWindow);

  jendela[id] = win;

  win.once('ready-to-show', () => {
    win.show();
  });

  win.on('closed', () => {
    jendela[id] = null;
  });

  await win.loadURL(url);

  return win;
}

if (!ipcMain.listenerCount('pesan-dari-jendela')) {
  ipcMain.on('pesan-dari-jendela', (event, arg) => {
    console.log('Dari jendela:', arg);
    const { pesan, saluranBalasan } = arg;

    if (saluranBalasan) {
      event.reply(saluranBalasan, `Pesan diterima: ${pesan}`);
    } else {
      event.reply('balasan-dari-utama', `Pesan diterima: ${pesan}`);
    }
  });
}

function kirimPesanDenganBalasan(id, saluran, pesan) {
  return new Promise((resolve, reject) => {
    if (!jendela[id]) {
      reject(new Error(`Jendela dengan id '${id}' tidak ditemukan`));
      return;
    }

    const webContents = jendela[id].webContents;

    const saluranBalasan = `${saluran}-balasan-${Date.now()}-${Math.random()}`;

    ipcMain.once(saluranBalasan, (event, data) => {
      resolve(data);
    });

    webContents.send(saluran, { pesan, saluranBalasan });
  });
}

async function apg(tokens, modules, context) {
  try {
    const perintah = tokens[1];
    const id = tokens.find(t => t.startsWith(':id='))?.slice(4) || 'default';

    if (perintah === 'buka') {
      const url = tokens[2] || 'https://example.com';

      const opsi = {};
      tokens.forEach(t => {
        if (t.startsWith(':width=')) opsi.width = parseInt(t.slice(7));
        else if (t.startsWith(':height=')) opsi.height = parseInt(t.slice(8));
        else if (t.startsWith(':title=')) opsi.title = t.slice(7);
        else if (t.startsWith(':fullscreen=')) opsi.fullscreen = t.slice(12) === 'true';
      });

      await buatJendela(url, opsi, id);
      context.return = `Jendela '${id}' dibuka dengan URL ${url}`;
      console.log(context.return);

    } else if (perintah === 'kirim') {
      if (!jendela[id]) {
        context.return = `Tidak ada jendela dengan id '${id}' yang terbuka`;
        console.warn(context.return);
      } else {
        const pesan = tokens.slice(2).join(' ');
        try {
          const balasan = await kirimPesanDenganBalasan(id, 'pesan-dari-utama', pesan);
          context.return = `Balasan dari jendela '${id}': ${balasan}`;
          console.log(context.return);
        } catch (err) {
          context.return = `Gagal kirim pesan ke jendela '${id}': ${err.message}`;
          console.error(context.return);
        }
      }
    } else if (perintah === 'tutup') {
      if (jendela[id]) {
        jendela[id].close();
        jendela[id] = null;
        context.return = `Jendela '${id}' ditutup`;
        console.log(context.return);
      } else {
        context.return = `Tidak ada jendela dengan id '${id}' yang terbuka`;
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
