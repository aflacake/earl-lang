// penjalankan.js

const { memory } = require('./memory');
const { tokenize } = require('./tokenize.js');
const { runEarl } = require('./pemroses.js');

const { ambil } = require('./modules/ambil.js');
const { tampilkan } = require('./modules/tampilkan.js');
const { masukkan } = require('./modules/masukkan.js');
const { hitung } = require('./modules/hitung.js');
const { jika } = require('./modules/jika.js');
const { ulangi } = require('./modules/ulangi.js');
const { membangun } = require('./modules/membangun.js');
const { kelas } = require('./modules/kelas.js');
const { atur } = require('./modules/atur.js');
const { waktu } = require('./modules/waktu.js');
const { buka } = require('./modules/buka.js');
const { tulis } = require('./modules/tulis.js');
const { tutup } = require('./modules/tutup.js');
const { periksa } = require('./modules/periksa.js');
const { lakukan } = require('./modules/lakukan.js');
const { fungsi } = require('./modules/fungsi.js');
const { kembalikan } = require('./modules/kembalikan.js');
const { daftar } = require('./modules/daftar.js');
const { dikta } = require('./modules/dikta.js');
const { melahirkan } = require('./modules/melahirkan.js');
const { gambar } = require('./modules/gambar.js');
const { ingatan } = require('./modules/ingatan.js');
const { prosesor } = require('./modules/prosesor.js');
const { peranti } = require('./modules/peranti.js');
const { jikaLainnya } = require('./modules/jikaLainnya.js');
const { ulangiKontrol } = require('./modules/ulangiKontrol.js');
const { teks } = require('./modules/teks.js');
const { matematika } = require('./modules/matematika.js');
const { ambildata, kirimdata } = require('./modules/http.js');
const { masuklingkup, keluarlingkup, periksalingkup } = require('./modules/lingkup.js');
const { impor } = require('./modules/impor.js');
const { buatFolder, hapusFolder, bacaFolder, gantiNamaFolder, periksaUkuranFolder } = require('./modules/folder.js');
const { aturheader } = require('./modules/aturheader.js');
const { evaluasi } = require('./modules/evaluasi.js');
const { cobaTangkap } = require('./modules/cobaTangkap.js');
const { panggilMetode } = require('./modules/panggilMetode.js');

const modules = {
    ambil,
    tampilkan,
    masukkan,
    hitung,
    jika: jikaLainnya,
    ulangi,
    ulangiKontrol,
    membangun,
    kelas,
    atur,
    waktu,
    buka,
    tulis,
    tutup,
    periksa,
    lakukan,
    fungsi,
    kembalikan,
    daftar,
    dikta,
    melahirkan,
    gambar,
    ingatan,
    prosesor,
    peranti,
    teks,
    matematika,
    ambildata,
    kirimdata,
    masuklingkup,
    keluarlingkup,
    periksalingkup,
    impor,
    buatFolder,
    hapusFolder,
    bacaFolder,
    gantiNamaFolder,
    periksaUkuranFolder,
    aturheader,
    evaluasi,
    cobaTangkap,
    panggilMetode,
    memory,
    tokenize,
    runEarl
};

module.exports = { runEarl, modules };
