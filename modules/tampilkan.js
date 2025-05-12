// modules/tampilkan.js

import { memory } from '../memory.js';

export function tampilkan(tokens) {
    const target = tokens[1];
    if (target.startsWith(":")) {
        const varName = target.slice(1, -1);
        console.log(memory[varName] || "tidak dikenali");
    } else {
        console.log(target.replace(/"/g, ""));
    }
}
