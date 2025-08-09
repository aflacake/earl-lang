// pramuat.js

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('apiElectron', {
  kirimPesan: (pesan) => ipcRenderer.send('pesan-dari-jendela', pesan),
  terimaBalasan: (callback) => ipcRenderer.on('balasan-dari-utama', (event, data) => callback(data))
});
