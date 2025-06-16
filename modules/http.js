// modules/http.js

const https = require('https');
const querystring = require('querystring');
const { memory } = require('../memory');

async function ambildata(tokens, modules, context) {
    const url = tokens[1].replace(/"/g, '');

    if (!url || !url.startsWith('https://')) {
        console.error('URL tidak valid atau harus diawali dengan https://');
        return;
    }

    https.get(url, (res) => {
        let data = '';

        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            const indexKe = tokens.indexOf('ke');
            const varToken = tokens[indexKe + 1];

            let keluaran = data;

            try {
                keluaran = JSON.parse(data); 
            } catch { }
            if (indexKe !== -1 && varToken?.startsWith(':')) {
                const varName = varToken.slice(1, -1);
                memory[varName] = keluaran;
                console.log(`Data disimpan ke :${varName}: (Status: ${res.statusCode})`);
            } else {
                console.log(`Status: ${res.statusCode}`);
                console.log(keluaran);
            }
        });
    }).on('error', (err) => {
        console.error('Gagal ambil data:', err.message);
    });
}

async function kirimdata(tokens, modules, context) {
    const url = tokens[1].replace(/"/g, '');

    if (!url || !url.startsWith('https://')) {
        console.error('URL tidak valid atau harus diawali dengan https://');
        return;
    }

    const dataToken = tokens[2];
    const dataObj = (dataToken && dataToken.startsWith(':') && dataToken.endsWith(':'))
        ? memory[dataToken.slice(1, -1)] || {}
        : {};

    const postData = querystring.stringify(dataObj);
    const urlObj = new URL(url);

    const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || 443,
        path: urlObj.pathname + urlObj.search,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
        }
    };
    const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            const indexKe = tokens.indexOf('ke');
            const varToken = tokens[indexKe + 1];

            let keluaran = data;

            try {
                keluaran = JSON.parse(data);
            } catch { }
            if (indexKe !== -1 && varToken?.startsWith(':')) {
                const varName = varToken.slice(1, -1);
                memory[varName] = keluaran;
                console.log(`Respon disimpan ke ${varName}: (Status: ${res.statusCode})`);
            } else {
                console.log(`Status: ${res.statusCode}`);
                console.log(keluaran);
            }
        });
    });
    req.on('error', (err) => {
        console.error('Gagal kirim data:', err.message);
    });
    req.write(postData);
    req.end();
}

module.exports = { ambildata, kirimdata };
