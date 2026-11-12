/**
 * 🌸 Master Server & API for Sreyleak Cosmetics
 * Runs Web Server, REST API, Database Engine, and Telegram Bot in ONE unified process!
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const db = require('./server/db.js');
const bot = require('./server/bot.js');

const PORT = process.env.PORT || 3000;

// Initialize Database Seeding if first run
const { PRODUCTS, STORE_CONFIG } = require('./js/products.js');
db.initSeed(PRODUCTS, STORE_CONFIG);

// MIME Types
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

// Helper: Parse JSON Body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
  });
}

// Helper: JSON Response
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

// Master HTTP Request Handler
const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // ===================== REST API ROUTES =====================

  // 1. STATS OVERVIEW
  if (pathname === '/api/stats' && req.method === 'GET') {
    const orders = db.getOrders();
    const products = db.getProducts();
    const customers = Object.keys(db.getCustomers()).length;
    const chats = Object.keys(db.getChats()).length;

    const totalRevenueUSD = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.grandTotalUSD || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;

    return sendJson(res, 200, {
      ok: true,
      stats: {
        totalRevenueUSD,
        totalRevenueKHR: totalRevenueUSD * 4000,
        totalOrders: orders.length,
        pendingOrders,
        totalProducts: products.length,
        totalCustomers: customers,
        totalChats: chats
      },
      recentOrders: orders.slice(0, 5)
    });
  }

  // 2. PRODUCTS
  if (pathname === '/api/products' && req.method === 'GET') {
    return sendJson(res, 200, { ok: true, products: db.getProducts() });
  }

  if (pathname === '/api/products' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const saved = db.saveProduct(body);
      // Auto Git push in background
      exec('git add js/products.js && git commit -m "Update products from Admin" && git push');
      return sendJson(res, 200, { ok: true, product: saved });
    } catch (err) {
      return sendJson(res, 400, { ok: false, error: err.message });
    }
  }

  if (pathname.startsWith('/api/products/') && req.method === 'DELETE') {
    const id = pathname.replace('/api/products/', '');
    db.deleteProduct(id);
    exec('git add js/products.js && git commit -m "Delete product from Admin" && git push');
    return sendJson(res, 200, { ok: true, message: 'Deleted successfully' });
  }

  // Legacy save-products endpoint for backward compatibility
  if (pathname === '/api/save-products' && req.method === 'POST') {
    try {
      const { products, config } = await parseBody(req);
      if (products) {
        fs.writeFileSync(path.join(__dirname, 'data', 'products.json'), JSON.stringify(products, null, 2));
      }
      if (config) {
        fs.writeFileSync(path.join(__dirname, 'data', 'settings.json'), JSON.stringify(config, null, 2));
      }
      db.syncToPublicJs();
      exec('git add js/products.js && git commit -m "Sync products and config" && git push');
      return sendJson(res, 200, { ok: true, message: 'Saved and synced' });
    } catch (err) {
      return sendJson(res, 500, { ok: false, error: err.message });
    }
  }

  // 3. ORDERS
  if (pathname === '/api/orders' && req.method === 'GET') {
    return sendJson(res, 200, { ok: true, orders: db.getOrders() });
  }

  // Place Order from Mini App (Web)
  if (pathname === '/api/orders' && req.method === 'POST') {
    try {
      const orderData = await parseBody(req);
      const savedOrder = await bot.notifyNewOrder(orderData);
      return sendJson(res, 200, { ok: true, order: savedOrder });
    } catch (err) {
      return sendJson(res, 500, { ok: false, error: err.message });
    }
  }

  // Update Order Status
  if (pathname.match(/^\/api\/orders\/[^\/]+\/status$/) && req.method === 'PATCH') {
    try {
      const parts = pathname.split('/');
      const orderId = parts[3];
      const { status, note } = await parseBody(req);
      const updated = db.updateOrderStatus(orderId, status, note);
      return sendJson(res, 200, { ok: true, order: updated });
    } catch (err) {
      return sendJson(res, 400, { ok: false, error: err.message });
    }
  }

  // 4. CHATS WITH CUSTOMERS
  if (pathname === '/api/chats' && req.method === 'GET') {
    return sendJson(res, 200, { ok: true, chats: db.getChats() });
  }

  if (pathname.startsWith('/api/chats/') && !pathname.endsWith('/reply') && req.method === 'GET') {
    const chatId = pathname.replace('/api/chats/', '');
    db.markChatAsRead(chatId);
    return sendJson(res, 200, { ok: true, chat: db.getChatByUserId(chatId) });
  }

  // Admin Reply to Customer via Telegram Bot
  if (pathname.match(/^\/api\/chats\/[^\/]+\/reply$/) && req.method === 'POST') {
    try {
      const parts = pathname.split('/');
      const chatId = parts[3];
      const { text } = await parseBody(req);
      if (!text || !text.trim()) {
        return sendJson(res, 400, { ok: false, error: 'Text is required' });
      }
      const tgRes = await bot.sendAdminReply(chatId, text.trim());
      return sendJson(res, 200, { ok: true, result: tgRes, chat: db.getChatByUserId(chatId) });
    } catch (err) {
      return sendJson(res, 500, { ok: false, error: err.message });
    }
  }

  // 5. STORE SETTINGS
  if (pathname === '/api/settings' && req.method === 'GET') {
    return sendJson(res, 200, { ok: true, settings: db.getSettings() });
  }

  if (pathname === '/api/settings' && req.method === 'POST') {
    try {
      const newSettings = await parseBody(req);
      const saved = db.saveSettings(newSettings);
      exec('git add js/products.js && git commit -m "Update store settings" && git push');
      return sendJson(res, 200, { ok: true, settings: saved });
    } catch (err) {
      return sendJson(res, 400, { ok: false, error: err.message });
    }
  }

  // ===================== STATIC FILE SERVING =====================
  let safePath = path.normalize(decodeURI(pathname)).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') safePath = '/index.html';
  if (safePath === '/admin' || safePath === '/admin/') safePath = '/admin.html';

  const filePath = path.join(__dirname, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    });
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

// Start Master Server
server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🌸 ហាង ស្រីល័ក្ខ គ្រឿងក្រអូប - PC Master Server`);
  console.log(`🌐 ហាងទំនិញ (Shop):  http://localhost:${PORT}`);
  console.log(`⚙️ ផ្ទាំងគ្រប់គ្រង Admin: http://localhost:${PORT}/admin.html`);
  console.log(`📦 ទិន្នន័យ Database រក្សាទុកក្នុង folder: /data/`);
  console.log(`=======================================================`);

  // Start Telegram Bot Polling
  bot.startBot();
});
