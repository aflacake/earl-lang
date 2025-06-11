// tokenize.js

function tokenize(line) {
    if(line.trim().startsWith('--') && line.trim().endsWith('--')) {
        return [];
    }

    return line.trim().match(/"[^"]*"|:[^:\s\[\]]+\[\d+\]:|:[^:\s]+:|>=|<=|==|!=|[()[\],]|>|<|\S+/g);
}

module.exports = { tokenize };
