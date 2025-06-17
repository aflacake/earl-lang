// modules/http.js

const https = require('https');
const fs = require('fs');
const querystring = require('querystring');
const FormData = require('form-data');
const { memory } = require('../memory');

async function ambildata(tokens, modules, context) {
    const url = tokens[1].replace(/"/g, '');

    if (!url || !url.startsWith('https://')) {
        console.error('URL tidak valid atau harus diawali dengan https://');
        return;
    }

    const indexTimeout = tokens.indexOf('bataswaktu');
    const indexRetry = tokens.indexOf('coba');
    const timeout = indexTimeout !== -1 ? parseInt(tokens[indexTimeout + 1]) : 5000;
    const maxRetry = indexRetry !== -1 ? parseInt(tokens[indexRetry + 1]) : 1;

    const indexKe = tokens.indexOf('ke');
    let varName = null;
    if (indexKe !== -1) {
        const varToken = tokens[indexKe + 1];
        if (varToken?.startsWith(':')) {
            varName = varToken.slice(1, -1);
        };
    }

    let headers = { ...memory.__headers };
    const headerIndex = tokens.indexOf('header');
    if (headerIndex !== -1 && tokens[headerIndex + 1]) {
        const headerStr = tokens[headerIndex + 1].replace(/"/g, '');
        const [key, ...rest] = headerStr.split(':');
        if (key && rest.length) {
            headers[key.trim()] = rest.join(':').trim();
        }
    }


    let percobaan = 0;
    let sukses = false;

    while (percobaan < maxRetry && !sukses) {
        percobaan++;
        try {
            await new Promise((resolve, reject) => {
                const permintaan = https.request(url, { method: 'GET', timeout, headers }, (res) => {
                    let data = '';
                    res.on('data', chunk => data += chunk);
                    res.on('end', () => {
                        let keluaran = data;
                        try {
                            keluaran = JSON.parse(data);
                        } catch { }

                        if (varName) {
                            memory[varName] = keluaran;
                            console.log(`Data disimpan ke :${varName}: (Status: ${res.statusCode}, Coba: ${percobaan})`);
                        } else {
                            console.log(`Status: ${res.statusCode}, Coba: ${percobaan}`);
                            console.log(keluaran);
                        }
                        sukses = true;
                        resolve();
                    });
                });
                permintaan.on('timeout', () => {
                    permintaan.destroy();
                    reject(new Error('Batas waktu'));
                });
                permintaan.on('error', reject);
                permintaan.end();
            });
        } catch (err) {
            console.error(`Percobaan ${percobaan} gagal:`, err.message);
            if (percobaan >= maxRetry) {
                console.error(`Gagal ambil data dari '${url}' setelah ${maxRetry} kali.`);
            }
        }
    }
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

    if (typeof dataObj !== 'object' || dataObj === null) {
        console.error('Data yang dikirm harus berupa objek');
        return
    }

    const sebagaiJson = tokens.includes('sebagai') && tokens[tokens.indexOf('sebagai') + 1] === '"json"';
    const methodIndex = tokens.indexOf('method');
    const method = (methodIndex !== -1 && tokens[methodIndex + 1])
        ? tokens[methodIndex +  1].toUpperCase()
        : 'POST';

    const urlObj = new URL(url);
    const headersGlobal = memory.__headers || {};

    const uploadIndex = tokens.indexOf('upload');
    if (uploadIndex !== -1) {
        const filePath = tokens[uploadIndex + 1]?.replace(/"/g, '');
        const fieldName = tokens[uploadIndex + 2] || 'file';

        if (!filePath) {
            console.error('Path file tidak valid');
            return;
        }

        const form = new FormData();
        for (const key in dataObj) {
            form.append(key, dataObj[key]);
        }

        try {
            const fileStream = fs.createReadStream(filePath);
            form.append(fieldName, fileStream);

            const options = {
                method,
                hostname: urlObj.hostname,
                port: urlObj.port || 443,
                path: urlObj.pathname + urlObj.search,
                headers: {
                    ...form.getHeaders(),
                    ...headersGlobal
                }
            };
            const permintaan = https.request(options, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    const indexKe = tokens.indexOf('ke');
                    const varToken = tokens[indexKe + 1];
                    let keluaran = data;
                    try { keluaran = JSON.parse(data); } catch (err) { }

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
            permintaan.on('error', err => console.error('Gagal upload:', err.message));
            form.pipe(permintaan);
            return;
        } catch (e) {
            console.error('Gagal membaca file:', e.message);
            return;
        }
    }

    const postData = sebagaiJson
        ? JSON.stringify(dataObj)
        : querystring.stringify(dataObj);

    const headers = {
        ...headersGlobal,
        'Content-Type': sebagaiJson
            ? 'application/json'
            : 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
    };

    const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || 443,
        path: urlObj.pathname + urlObj.search,
        method: 'POST',
        headers
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
            } catch (err) { }

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
    req.on('error', err => console.error('Gagal kirim data:', err.message));
    req.write(postData);
    req.end();
}

module.exports = { ambildata, kirimdata };
