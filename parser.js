// parser.js

function parse(code) {
    const lines = code.trim().split('\n');
    const ast = [];
    const stack = [ast];

    for (let i = 0; i < lines.length; i++) {
        const raw = lines[i].trim();
        if (!raw || raw.startsWith('--')) continue;

        const tokens = raw.match(/"[^"]*"|:[^:\s]+:|[()[\],]|>=|<=|==|!=|>|<|\S+/g);
        const command = tokens[0];

        if (['jika', 'ulangi', 'fungsi', 'kelas'].includes(command)) {
            const node = {
                type: command,
                tokens,
                body: []
            };
            stack[stack.length - 1].push(node);
            stack.push(node.body);
        } else if (command === 'selesai') {
            if (stack.length > 1) {
                stack.pop();
            } else {
                throw new Error(`'selesai' tanpa pembuka di baris ${i + 1}`);
            }
        } else {
            stack[stack.length - 1].push({
                type: command,
                tokens
            });
        }
    }
    if (stack.length !== 1) {
        throw new Error('Blok tidak ditutup dengan benar');
    }
    return ast;
}

module.exports = { parse };
