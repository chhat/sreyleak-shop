// Static HTTP Server with Admin Save API for Telegram Mini Shop
const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Endpoint: Save Products to js/products.js
  if (req.url === '/api/save-products' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { products, config } = JSON.parse(body);
        const fileContent = `// បញ្ជីទំនិញគ្រឿងក្រអូបហាង ស្រីល័ក្ខ (Sreyleak Beauty Store)
// កែសម្រួលចុងក្រោយ៖ ${new Date().toLocaleString('km-KH')}

const PRODUCTS = ${JSON.stringify(products, null, 2)};

const STORE_CONFIG = ${JSON.stringify(config, null, 2)};
`;

        const productsFilePath = path.join(__dirname, 'js', 'products.js');
        fs.writeFileSync(productsFilePath, fileContent, 'utf-8');
        console.log('✅ បានរក្សាទុកទិន្នន័យថ្មីចូលក្នុង js/products.js រួចរាល់!');

        // Optional: Auto git commit & push to GitHub Pages
        exec('git add js/products.js && git commit -m "Update products from Admin UI" && git push', (err, stdout, stderr) => {
          if (err) {
            console.log('Git auto-sync notice:', err.message);
          } else {
            console.log('🚀 បាន Push ទិន្នន័យថ្មីទៅកាន់ GitHub Pages ដោយស្វ័យប្រវត្តិ!');
          }
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, message: 'Saved successfully and synced!' }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: err.message }));
      }
    });
    return;
  }

  // Normalize URL for static files
  let safePath = path.normalize(decodeURI(req.url.split('?')[0])).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  const filePath = path.join(__dirname, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`🌸 ហាង ស្រីល័ក្ខ គ្រឿងក្រអូប កំពុងដំណើរការនៅលើ http://localhost:${PORT}`);
  console.log(`⚙️ ផ្ទាំងគ្រប់គ្រង Admin: http://localhost:${PORT}/admin.html`);
});
