// tokenize.js

function tokenize(line) {
    return line.trim().match(/"[^"]*"|:[^:\s]+:|>=|<=|==|!=|>|<|\S+/g);
}

module.exports = { tokenize };
