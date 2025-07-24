// modules/tutup.js

function tutup(tokens, modules, context) {
  if (context.memory) {
    context.memory = {};
    console.log("Memori direset (file ditutup).");
  } else {
    console.log("Tidak ada memori untuk direset.");
  }
}

module.exports = { tutup };
