// modules/masukkan.js

import { memory } from '../memory.js';

export function masukkan(tokens) {
    const varName = tokens[1].slice(1, -1);
    const userInput = prompt(`Masukkan nilai untuk ${varName}:`);
    memory[varName] = userInput;
}
