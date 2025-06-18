// tests/test_atur.js

const { atur } = require('../modules/atur.js');
const { memory } = require('../memory');
const assert = require('assert');

async function testAtur() {
    let context = { index: 0, lines: [], lingkup: [{}] };

    // Kasus 1: Variabel sederhana
    await atur(['atur', ':x:', '=', '42'], {}, context);
    assert.strictEqual(memory['x'], 42);

    // Kasus 2: Array valid
    await atur(['atur', ':arr:', '=', '[', '1', ',', '2', ',', '3', ']'], { 
        tokenize: (l) => l.split(/\s+/]) 
    }, context);
    assert.deepStrictEqual(memory['arr'], [1, 2, 3]);

    // Kasus 3: String tidak ditutup
    await atur(['atur', ':s:', '=', '"abc'], {
        tokenize: (l) => l.split(/\s+/)
    }, context);

    //Kasus 4: Koma ganda
    await atur(['atur', ':arr:', '=', '[', '1', ',', ',', '3', ']'], {
        tokenize: (l) => l.split(/\S+/)
    }, context);
}
tesAtur();
