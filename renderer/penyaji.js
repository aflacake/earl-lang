// renderer/penyaji.js

const stopListening = window.apiElectron.terimaPesan((data) => {
  console.log('Pesan dari utama', data);
});
