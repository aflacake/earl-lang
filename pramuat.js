// pramuat.js

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('apiElectron', {
  kirimPesan: (pesan, saluranBalasan) => {
  ipcRenderer.send('pesan-dari-jendela', { pesan, saluranBalasan });
  },

  terimaPesan: (callback) => {
    const listener = (acara, data) => callback(data);
    ipcRenderer.on('pesan-dari-utama', listener);

    return () => {
      ipcRenderer.removeListener('pesan-dari-utama', listener);
    };
  },

  kirimBalasan: (saluranBalasan, data) => {
    ipcRenderer.send(saluranBalasan, data);
  }
});
