// modules/ambil.js
import { memory } from '../memory.js';

export function ambil(tokens) {
    const varName = tokens[1].slice(1, -1);
    const value = tokens[3].replace(/"/g, "");
    memory[varName] = value;
};
