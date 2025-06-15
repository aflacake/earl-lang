<p align="right">Bahasa: Indonesia</p>
<img src="https://raw.githubusercontent.com/aflacake/pearl/main/img/Pearl.png" width="150px" height="150px" alt="Pearl" />

# Pearl - Bahasa Pemrograman Ekspresif
Pearl adalah bahasa pemrograman eksperimen prototipe interaksi teks yang mirip dengan bahasa manusia atau lebih dikenal _pseudocode_, menggunakan Bahasa Indonesia, modular yang mudah dipahami, dan fleksibel untuk skripsi. Bahasa yang modulnya mudah diperluas serta mirip _command handler_. Cocok untuk otomasi alur kerja, cocok juga untuk programmer baru belajar.

Proses pengembangan ini juga beberapa dibuat generative oleh AI seperti pembuatan, debug, dan pembenahan kode.

Tujuan Pearl:
- Menyederhanakan logika program
- Bagus untuk pemula
- Pendekatan bahasa manusia dengan interaksi teks

Contoh bahasa Peal sederhana:
```pearl
masukkan :nama: sebagai pearl
tampikan :nama:
```

# Dokumentasi
Menyajikan berbagai tutorial terkini seputar topik Pearl. 
- Video, playlist: [YouTube](https://youtube.com/playlist?list=PLrTR7gicdSNSA3hbOD4XjBYI8akVo9nRf&si=RAVVEgfExJexSIM7), Video bagaimana cara penyetupan Pearl hingga tutorial penulisan kodenya sesuai aturan.
- Blog: [Nazwa Blogger](https://postnazwablogger.blogspot.com/search/label/Pearl), Topik hangat Pearl disajikan di Blog ini, Mari merapat!
- Repositori: [Pearl Docs](https://github.com/aflacake/pearl-docs), Tutorial aturan penulisan kode dan informasi modul beserta penjelasan terlengkap.

# Instalasi
## Dengan Node.js
Pastikan Node.js sudah terinstal, jika belum instal Node.js versi terbaru di situs resminya. Arahkan ke file tempat dimana index.js berada. Lalu ketikan:
```bash
node index.js
```
> Perintah ini bermanfaat untuk mencoba versi sebelum dirilis secara publik, jadi Anda bisa memanfatkan program alpha atau betanya.

### Bahan
- Menginstal paket tambahan di Node.js untuk keperluan merender visual atas perintah aturan 'gambar' dengan
  ``` bash
  npm install canvas
  ```
## Dengan CLI
### Pengguna Windows
File CLI bernama: `pearl.cmd`.
File `package.json` dan `pearl.cmd` sudah disiapkan maka langsung arahkan ke folder, lalu jalankan:
```bash
npm link
```

#### Tambahkan ke PATH
1. Salin semua file atau download semua file ini dengan keterangan versi terbaru (rekomendasi) atau pada saat proses pengembangan juga terbaik (perlu perbaikan).
   > Misalnya di C:\Users\KAMU\pearl
2. Tambahkan folder tersebut ke PATH:
   - Tekan `Win + R`, ketik _Edit the system environment variables_ lalu _Enter_
   - Tab _**Advanced**_ > _Environment Variables_
   - Dibagian _User variables_, pilih Path lalu
   - **New** > masukkan
     > Misalnya di C:\Users\KAMU\pearl
   - **OK** dan restart terminal

Jalankan dengan menggunakan perintah:
```bash
pearl contoh.pearl
```

### Pengguna Linux dan MacOS
File CLI bernama: `pearl`
#### Tambahkan ke PATH
Dengan menjalankan folder langsung atau saat ini:
```bash
./pearl contoh.pearl
```
atau
Berikan hak akses eksekusi:
```bash
chmod +x bin/pearl
```
link ke global:
``` bash
npm link
```

## Unduh versi
Download versi memungkinkan Anda menggunakan tautan eksternal. Versi ini seutuhnya stabil dari berbagai uji coba rata-rata, versi tidak stabil saat ini belum memungkinkan untuk dirilis, sehingga masih dalam bentuk instalasi berlangsung, untuk versi download sesuaikan perangkat yang Anda gunakan. Silahkan coba versi stabil:
- [Versi 2.0.0](https://www.dropbox.com/scl/fo/zbb12ru3lomywj1jgbgpd/ANs9qHu8ZD8Li3kJ0o9qSSs?rlkey=94ig1gxrgrs3akop9557gwuqr&st=j49xw59f&dl=0)
- [Versi 1.0.3](https://www.dropbox.com/scl/fo/tx28twsekamv4r7ijjmd3/AJNeWSaor3yBgXDp803y1Fs?rlkey=7nyjdjt26lk4jjdq57jif3fw9&st=zcxzbqr1&dl=0)
- [Versi 1.0.0](https://www.dropbox.com/scl/fo/92zqglhfbdlteyrzfg5el/AMJTipi0hB7207rwC5lQsC8?rlkey=q9p8jspq3xfztz3q79w0f263p&st=xu169lsy&dl=0)

# Berkontribusi
Fork kode ini dan bangun aturan apa yang diusul atau menambahkan "bagian kecil" seperti pembenahan kata atau typo dalam teks tidaklah masalah, aturan berkontribusi tidak memberatkan.
