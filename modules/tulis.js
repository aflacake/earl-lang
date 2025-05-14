// modules/tulis.js

export async function tulis(tokens, modules, context) {
    const namaVariabel = tokens[1];

    const isi = modules.memory[namaVariabel];
    const blob = new Blob([isi], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "output.txt";
    a.click();

    URL.revokeObjectURL(url);
}
