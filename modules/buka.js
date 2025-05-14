// modules/buka.js

export async function buka(tokens, modules, context) {
    const namaVariabel = tokens[1];

    return new Promise((resolve) => {
        const input = document.createElement("input");
        input.type = "file";

        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onload = () => {
                modules.memory[namaVariabel] = reader.result;
                resolve();
            };
            reader,readAsText(file);
        };
        input.click();
    });
}
