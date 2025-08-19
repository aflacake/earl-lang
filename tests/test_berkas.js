// tests/test_berkas.js

const berkas = require('../modules/berkas.js');
const { memory } = require('../memory');
const fs = require('fs');
const assert = require('assert');

async function testBerkas() {
    console.log('=== Memulai pengujian berkas.js ===\n');
    
    let context = { 
        index: 0, 
        lines: [], 
        lingkup: [{}],
        memory: memory 
    };
    
    const modules = {
        tokenize: (l) => l.split(/\s+/)
    };

    try {
        // Test 1: tulisBerkas - Menulis berkas sederhana
        console.log('Test 1: tulisBerkas - Menulis berkas');
        await berkas.tulisBerkas(['tulisBerkas', '"test1.txt"', '"Hello Earl!"'], modules, context);
        assert(fs.existsSync('test1.txt'), 'Berkas test1.txt harus ada');
        console.log('✅ Test 1 berhasil\n');

        // Test 2: bacaBerkas - Membaca berkas
        console.log('Test 2: bacaBerkas - Membaca berkas');
        await berkas.bacaBerkas(['bacaBerkas', '"test1.txt"'], modules, context);
        console.log('✅ Test 2 berhasil\n');

        // Test 3: bacaBerkas ke variabel
        console.log('Test 3: bacaBerkas ke variabel');
        await berkas.bacaBerkas(['bacaBerkas', '"test1.txt"', 'ke', ':isi:'], modules, context);
        assert.strictEqual(memory['isi'], 'Hello Earl!', 'Isi variabel harus sesuai');
        console.log('✅ Test 3 berhasil\n');

        // Test 4: infoBerkas
        console.log('Test 4: infoBerkas - Informasi berkas');
        await berkas.infoBerkas(['infoBerkas', '"test1.txt"'], modules, context);
        console.log('✅ Test 4 berhasil\n');

        // Test 5: salinBerkas
        console.log('Test 5: salinBerkas - Menyalin berkas');
        await berkas.salinBerkas(['salinBerkas', '"test1.txt"', '"test1_copy.txt"'], modules, context);
        assert(fs.existsSync('test1_copy.txt'), 'Berkas salinan harus ada');
        console.log('✅ Test 5 berhasil\n');

        // Test 6: periksaTipe
        console.log('Test 6: periksaTipe - Memeriksa jenis berkas');
        await berkas.periksaTipe(['periksaTipe', '"test1.txt"'], modules, context);
        console.log('✅ Test 6 berhasil\n');

        // Test 7: tulisBerkas dengan mode tambah
        console.log('Test 7: tulisBerkas mode tambah');
        await berkas.tulisBerkas(['tulisBerkas', '"test1.txt"', '"Baris kedua"', 'tambah'], modules, context);
        console.log('✅ Test 7 berhasil\n');

        // Test 8: bacaBarisPerBaris
        console.log('Test 8: bacaBarisPerBaris');
        await berkas.bacaBarisPerBaris(['bacaBarisPerBaris', '"test1.txt"', 'ke', ':baris:'], modules, context);
        assert(Array.isArray(memory['baris']), 'Hasil harus berupa array baris');
        console.log('✅ Test 8 berhasil\n');

        // Test 9: gabungBerkas
        console.log('Test 9: gabungBerkas - Menggabung berkas');
        await berkas.gabungBerkas(['gabungBerkas', '"test1.txt"', '"test1_copy.txt"', '"gabungan.txt"'], modules, context);
        assert(fs.existsSync('gabungan.txt'), 'Berkas gabungan harus ada');
        console.log('✅ Test 9 berhasil\n');

        // Test 10: cariBerkas
        console.log('Test 10: cariBerkas - Mencari berkas');
        await berkas.cariBerkas(['cariBerkas', '"."', '"test"', 'ke', ':hasil:'], modules, context);
        // cariBerkas mungkin tidak menemukan apa-apa jika berkas sudah dibersihkan, itu normal
        console.log('✅ Test 10 berhasil\n');

        // Test Error: Berkas tidak ada
        console.log('Test Error: Membaca berkas yang tidak ada');
        await berkas.bacaBerkas(['bacaBerkas', '"tidakada.txt"'], modules, context);
        console.log('✅ Test Error berhasil\n');

        // Test Error: Sintaks salah
        console.log('Test Error: Sintaks salah');
        await berkas.bacaBerkas(['bacaBerkas'], modules, context);
        console.log('✅ Test Error sintaks berhasil\n');

        console.log('=== Semua test berhasil! ===\n');

    } catch (error) {
        console.error('❌ Test gagal:', error.message);
        throw error;
    } finally {
        // Bersihkan berkas test
        console.log('Membersihkan berkas test...');
        const testFiles = ['test1.txt', 'test1_copy.txt', 'gabungan.txt'];
        testFiles.forEach(file => {
            if (fs.existsSync(file)) {
                fs.unlinkSync(file);
                console.log(`Berkas ${file} dihapus`);
            }
        });
        console.log('Pembersihan selesai');
    }
}

// Test 11: pindahBerkas dan hapusBerkas
async function testPindahHapus() {
    console.log('\n=== Test Pindah dan Hapus ===');
    
    let context = { 
        index: 0, 
        lines: [], 
        lingkup: [{}],
        memory: memory 
    };
    
    const modules = {
        tokenize: (l) => l.split(/\s+/)
    };

    try {
        // Buat berkas untuk test
        await berkas.tulisBerkas(['tulisBerkas', '"pindah_test.txt"', '"Test pindah"'], modules, context);
        
        // Test pindahBerkas
        console.log('Test: pindahBerkas');
        await berkas.pindahBerkas(['pindahBerkas', '"pindah_test.txt"', '"dipindah.txt"'], modules, context);
        assert(fs.existsSync('dipindah.txt'), 'Berkas harus ada di lokasi baru');
        assert(!fs.existsSync('pindah_test.txt'), 'Berkas lama harus hilang');
        console.log('✅ Test pindahBerkas berhasil');

        // Test hapusBerkas
        console.log('Test: hapusBerkas');
        await berkas.hapusBerkas(['hapusBerkas', '"dipindah.txt"'], modules, context);
        assert(!fs.existsSync('dipindah.txt'), 'Berkas harus terhapus');
        console.log('✅ Test hapusBerkas berhasil');

    } catch (error) {
        console.error('❌ Test pindah/hapus gagal:', error.message);
        // Bersihkan jika ada error
        ['pindah_test.txt', 'dipindah.txt'].forEach(file => {
            if (fs.existsSync(file)) fs.unlinkSync(file);
        });
        throw error;
    }
}

// Jalankan semua test
async function runAllTests() {
    try {
        await testBerkas();
        await testPindahHapus();
        console.log('\n🎉 SEMUA TEST BERKAS.JS BERHASIL! 🎉');
    } catch (error) {
        console.error('\n💥 ADA TEST YANG GAGAL:', error.message);
        process.exit(1);
    }
}

runAllTests();