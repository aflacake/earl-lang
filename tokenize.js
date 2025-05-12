// tokenize.js

export function tokenize(line) {
    return line.trim().match(/"[^"]*"|:[^:\s]+:|>=|<=|==|!=|>|<|\S+/g);
};