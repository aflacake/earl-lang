<p align="right">Bahasa: Indonesia</p>
<img src="https://raw.githubusercontent.com/aflacake/earl-lang/main/img/Earl (1).png" width="150px" height="150px" alt="Earl" />

# Earl - Bahasa Pemrograman Alur Kerja
Earl adalah bahasa pemrograman scripting domain-spesifik (DSL) yang dirancang untuk **otomasi, pengaturan logika, konfigurasi dinamis** dalam sistem modern. Dengan sintaks yang sederhana dan modular, Earl memungkinkan pengguna untuk membuat alur kerja, memanipulasi data, dan kontrol sistem secara ekspresif namun terstruktur.

Menjadikan jembatan _konfigurasi statis_ (seperti YAML/JSON) dan _scripting dinamis_, dengan menawarkan bahasa ringan, terbaca manusia dan cukup kuat untuk menyusun logika kompleks dalam sistem modern.

> Proses pengembangan ini juga beberapa dibuat generative oleh AI seperti pembuatan, _debug_, dan pembenahan kode.

Kenapa Earl?
- Sintaks ekpresif, mirip _natural language logic_.
- Mendukung fungsi, kondisi, dan perulangan.
- Bisa dipakai sebagai CLI, REPL, atau embedded engine.
- Mudah dipelajari, bisa digunakan oleh non-programmer teknis (ops, devops, analis).
- Lebih fleksibel dari YAML, lebih ringan dari Python untuk _task-task_ kecil.

Contoh bahasa Earl sederhana:
```earl
masukkan :nama: sebagai earl
tampikan :nama:
```

# Dokumentasi
Menyajikan berbagai tutorial terkini seputar topik Earl. 
- Blog: [Nazwa Blogger](https://postnazwablogger.blogspot.com/search/label/Earl), Topik hangat Earl disajikan di Blog ini, Mari merapat!
- Repositori: [Earl Docs](https://github.com/aflacake/earl-docs), Tutorial aturan penulisan kode dan informasi modul beserta penjelasan terlengkap.

# Instalasi
## Dengan Node.js
Pastikan Node.js sudah terinstal, jika belum instal Node.js versi terbaru di situs resminya. Arahkan ke file tempat dimana index.js berada. Lalu ketikan:
```bash
node index.js
```
> Perintah ini bermanfaat untuk mencoba versi sebelum dirilis secara publik, jadi Anda bisa memanfatkan program alpha atau betanya.

### Bahan dari Pihak Ketiga
- Menginstal paket tambahan di Node.js untuk keperluan merender visual atas perintah aturan 'gambar' dengan
  ``` bash
  npm install canvas
  ```
- Menginstal `chalk` pustaka untuk memberi warna pada teks terminal.
  ```bash
  npm install chalk@4
  ```
- Menginstal `form-data` untuk memuat _request_ HTTP yang mengandung form data, biasanya untuk `multipart/formdata`, misalnya kirim file lewat `fetch`, `axios`, atau `http.request`.
  ```bash
  npm install form-data
  ```

## Dengan CLI
### Pengguna Windows
File CLI bernama: `earl.cmd`.
File `package.json` dan `earl.cmd` sudah disiapkan maka langsung arahkan ke folder, lalu jalankan:
```bash
npm link
```

#### Tambahkan ke PATH
1. Salin semua file atau download semua file ini dengan keterangan versi terbaru (rekomendasi) atau pada saat proses pengembangan juga terbaik (perlu perbaikan).
   > Misalnya di C:\Users\KAMU\earl
2. Tambahkan folder tersebut ke PATH:
   - Tekan `Win + R`, ketik _Edit the system environment variables_ lalu _Enter_
   - Tab _**Advanced**_ > _Environment Variables_
   - Dibagian _User variables_, pilih Path lalu
   - **New** > masukkan
     > Misalnya di C:\Users\KAMU\earl
   - **OK** dan restart terminal

Jalankan dengan menggunakan perintah:
```bash
earl contoh.earl
```

### Pengguna Linux dan MacOS
File CLI bernama: `earl`
#### Tambahkan ke PATH
Dengan menjalankan folder langsung atau saat ini:
```bash
./earl contoh.earl
```
atau
Berikan hak akses eksekusi:
```bash
chmod +x bin/earl
```
link ke global:
``` bash
npm link
```

## Dengan npm
```bash
npm install github:aflacake/earl-lang
```

## Unduh versi
Download versi memungkinkan Anda menggunakan tautan eksternal. Versi ini seutuhnya stabil dari berbagai uji coba rata-rata, versi tidak stabil saat ini belum memungkinkan untuk dirilis, sehingga masih dalam bentuk instalasi berlangsung, untuk versi download sesuaikan perangkat yang Anda gunakan. Silahkan coba versi stabil:
- [Versi 2.0.2](https://www.dropbox.com/scl/fo/4xhi8bl739h9ekvoi8v8g/AMTP_jDgAJYkCq59pgYXhb0?rlkey=66b2w5oy6bhynpe8w4tvvym61&st=ngyngz75&dl=0)
- [Versi 2.0.0](https://www.dropbox.com/scl/fo/zbb12ru3lomywj1jgbgpd/ANs9qHu8ZD8Li3kJ0o9qSSs?rlkey=94ig1gxrgrs3akop9557gwuqr&st=dytdlwqw&dl=0)
- [Versi 1.0.3](https://www.dropbox.com/scl/fo/tx28twsekamv4r7ijjmd3/AJNeWSaor3yBgXDp803y1Fs?rlkey=7nyjdjt26lk4jjdq57jif3fw9&st=du30wcw5&dl=0)
- [Versi 1.0.0](https://www.dropbox.com/scl/fo/92zqglhfbdlteyrzfg5el/AMJTipi0hB7207rwC5lQsC8?rlkey=q9p8jspq3xfztz3q79w0f263p&st=qksjuol9&dl=0)

# Berkontribusi
Earl masih dalam pengembangan dan terbuka untuk:
- Saran fitur
- Perbaikan bug
- Kolaborasi desain sintaks
- _Pull request_ modul baru

Bagaimana cara memulainya?\
Fork kode ini dan bangun aturan apa yang diusul atau menambahkan "bagian kecil" seperti pembenahan kata atau typo dalam teks tidaklah masalah, aturan berkontribusi tidak memberatkan.

Kalau kamu tertarik dengan bahasa, sistem interpreter, atau mengajar pemorgraman lokal, saya dengan senang hati berdiskusi denganmu.

# Lisensi
[Apache-2.0 license](https://github.com/aflacake/earl-lang?tab=Apache-2.0-1-ov-file)
