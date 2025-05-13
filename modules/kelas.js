// modules/kelas.js

import { memory } from '../memory.js';

export function kelas(tokens, modules, context); {
    const namaKelas = tokens[1].replace(/:/g, '');
    const atribut = tokens.slice(2);

    memory[namaKelas] = {
        __tipe: 'kelas',
        atribut: atribut,
        instance: {}
    };
    console.log(`Kelas ${namaKelas} didefinisikan dengan atribut:`, atribut);
}
