// modules/github.js

const axios = require('axios');

async function picuAlurKerja(tokens, modules,context) {
    const [_, repo, alurKerja_id, ref = 'main'] = tokens;
    const token = process.env.GITHUB_TOKEN;
    console.log("GITHUB_TOKEN =", token);

    if (!token || !repo || !alurKerja_id) {
        console.error("Gunakan format: picuAlurKerja pemilik/repo deploy.yml [ref]");
        return;
    }

    try {
      await axios.post(
       `https://api.github.com/repos/${repo}/actions/workflows/${alurKerja_id}/dispatches`,
        { ref },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github+json'
          }
        }
      );
      console.log(`Alur kerja ${alurKerja_id} berhasil dipicu di repo ${repo}`);
    } catch (err) {
      console.error('Gagal memicu alur kerja:', err.response?.data || err.message);
    }
}

picuAlurKerja.isBlock = false;
module.exports = { picuAlurKerja }
