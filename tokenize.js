// tokenize.js

function tokenize(line) {
    return line.trim().match(/"[^"]*"|:[^:\s\[\]]+\[\d+\]:|:[^:\s]+:|>=|<=|==|!=|[()[\],]|>|<|\S+/g);
}

module.exports = { tokenize };
