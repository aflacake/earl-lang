// modules/http.js

const https = require('https');
const querystring = require('querystring');
const { memory } = require('../memory');

async function ambildata(tokens, modules, context) {
    const url = tokens[1].replace(/"/g, '');

    https.get(url, (res) => {
        let data = '';

        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            const indexKe = tokens.indexOf('ke');
            if (indexKe !== -1 && tokens[indexKe + 1]?.startsWith(':')) {
                const varName = tokens[indexKe + 1].slice(1, -1);
                memory[varName] = data;
                console.log('Data disimpan ke :${varName}:');
            } else {
                console.log(data);
            }
        });
    }).on('error', (err) => {
        console.error('Gagal ambil data:', err.message);
    });
}

async function kirimdata(tokens, modules, context) {
    const url = tokens[1].replace(/"/g, '');
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
            if (indexKe !== -1 && tokens[indexKe + 1]?.startsWith(':')) {
                const varName = tokens[indexKe + 1].slice(1, -1);
                memory[varName] = data;
                console.log(`Respon disimpan ke :${varName}:`);
            } else {
                console.log(data);
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
