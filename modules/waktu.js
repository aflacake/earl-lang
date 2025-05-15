// modules/waktu.js

async function waktu(tokens, modules, context) {
  const subcommand = tokens[1];

  switch (subcommand) {
    case "sekarang":
      console.log("Waktu sekarang", new Date().toLocaleString());
      break;

    case "tunda":
      const miliseconds = parseInt(tokens[2], 10);
      if (isNaN(miliseconds)) {
        console.error("Argumen tunda harus berupa angka (milidetik).");
        break;
      }
      await new Promise(resolve => setTimeout(resolve, miliseconds));
      break;

    default:
      console.log(`Subperintah waktu tidak dikenali: ${subcommand}`);
  }
}

module.exports = { waktu };
