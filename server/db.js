/**
 * 📦 Local Database Engine for PC (Sreyleak Beauty Store)
 * Stores and manages data/ products, orders, chats, customers, settings
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const FILES = {
  products: path.join(DATA_DIR, 'products.json'),
  orders: path.join(DATA_DIR, 'orders.json'),
  customers: path.join(DATA_DIR, 'customers.json'),
  chats: path.join(DATA_DIR, 'chats.json'),
  settings: path.join(DATA_DIR, 'settings.json')
};

// Safe Read & Write Helpers
function readJson(file, defaultVal = []) {
  try {
    if (!fs.existsSync(file)) {
      writeJson(file, defaultVal);
      return defaultVal;
    }
    const data = fs.readFileSync(file, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${file}:`, err.message);
    return defaultVal;
  }
}

function writeJson(file, data) {
  try {
    const tempFile = `${file}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, file);
    return true;
  } catch (err) {
    console.error(`Error writing ${file}:`, err.message);
    return false;
  }
}

// Initial Seeding
function initSeed(defaultProducts, defaultSettings) {
  if (!fs.existsSync(FILES.products) && defaultProducts) {
    writeJson(FILES.products, defaultProducts);
  }
  if (!fs.existsSync(FILES.settings) && defaultSettings) {
    writeJson(FILES.settings, defaultSettings);
  }
  if (!fs.existsSync(FILES.orders)) {
    writeJson(FILES.orders, []);
  }
  if (!fs.existsSync(FILES.customers)) {
    writeJson(FILES.customers, {});
  }
  if (!fs.existsSync(FILES.chats)) {
    writeJson(FILES.chats, {});
  }
}

// ==================== PRODUCTS ====================
function getProducts() {
  return readJson(FILES.products, []);
}

function saveProduct(product) {
  const products = getProducts();
  const index = products.findIndex(p => p.id === product.id);
  if (index > -1) {
    products[index] = { ...products[index], ...product, updatedAt: new Date().toISOString() };
  } else {
    products.unshift({ ...product, createdAt: new Date().toISOString() });
  }
  writeJson(FILES.products, products);
  syncToPublicJs();
  return product;
}

function deleteProduct(id) {
  let products = getProducts();
  products = products.filter(p => p.id !== id);
  writeJson(FILES.products, products);
  syncToPublicJs();
  return true;
}

// Sync back to js/products.js so client and GitHub Pages remain up to date
function syncToPublicJs() {
  try {
    const prods = getProducts();
    const settings = getSettings();
    const content = `// បញ្ជីទំនិញគ្រឿងក្រអូបហាង ស្រីល័ក្ខ (Sreyleak Beauty Store)
// Auto-synced from PC Database: ${new Date().toLocaleString('km-KH')}

const PRODUCTS = ${JSON.stringify(prods, null, 2)};

const STORE_CONFIG = ${JSON.stringify(settings, null, 2)};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRODUCTS, STORE_CONFIG };
}
`;
    const targetFile = path.join(__dirname, '..', 'js', 'products.js');
    fs.writeFileSync(targetFile, content, 'utf-8');
  } catch (err) {
    console.error("syncToPublicJs error:", err.message);
  }
}

// ==================== ORDERS ====================
function getOrders() {
  return readJson(FILES.orders, []);
}

function getOrderById(orderId) {
  return getOrders().find(o => o.orderId === orderId);
}

function addOrder(orderData) {
  const orders = getOrders();
  const order = {
    ...orderData,
    status: orderData.status || 'pending', // pending, confirmed, shipped, completed, cancelled
    createdAt: new Date().toISOString(),
    statusHistory: [
      { status: 'pending', time: new Date().toISOString(), note: 'បានកុម្ម៉ង់ថ្មី' }
    ]
  };
  orders.unshift(order);
  writeJson(FILES.orders, orders);

  // Update customer record
  if (order.customer && order.customer.phone) {
    updateCustomerFromOrder(order);
  }

  return order;
}

function updateOrderStatus(orderId, status, note = '') {
  const orders = getOrders();
  const index = orders.findIndex(o => o.orderId === orderId);
  if (index > -1) {
    orders[index].status = status;
    orders[index].updatedAt = new Date().toISOString();
    if (!orders[index].statusHistory) orders[index].statusHistory = [];
    orders[index].statusHistory.push({
      status,
      time: new Date().toISOString(),
      note: note || `ប្តូរស្ថានភាពទៅជា ${status}`
    });
    writeJson(FILES.orders, orders);
    return orders[index];
  }
  return null;
}

// ==================== CUSTOMERS ====================
function getCustomers() {
  return readJson(FILES.customers, {});
}

function updateCustomerFromOrder(order) {
  const customers = getCustomers();
  const key = order.customer.phone;
  if (!customers[key]) {
    customers[key] = {
      name: order.customer.name,
      phone: order.customer.phone,
      location: order.customer.location,
      firstOrderDate: order.date || new Date().toISOString(),
      lastOrderDate: order.date || new Date().toISOString(),
      totalOrders: 1,
      totalSpentUSD: order.grandTotalUSD || 0
    };
  } else {
    customers[key].name = order.customer.name;
    customers[key].location = order.customer.location;
    customers[key].lastOrderDate = order.date || new Date().toISOString();
    customers[key].totalOrders += 1;
    customers[key].totalSpentUSD += (order.grandTotalUSD || 0);
  }
  writeJson(FILES.customers, customers);
}

// ==================== LIVE CHATS ====================
function getChats() {
  return readJson(FILES.chats, {});
}

function getChatByUserId(userId) {
  const chats = getChats();
  return chats[String(userId)] || null;
}

function recordChatMessage(chatId, user, text, fromAdmin = false) {
  const chats = getChats();
  const key = String(chatId);
  const now = new Date().toISOString();

  if (!chats[key]) {
    chats[key] = {
      chatId: key,
      user: {
        id: user?.id || chatId,
        firstName: user?.first_name || user?.firstName || 'អតិថិជន',
        lastName: user?.last_name || user?.lastName || '',
        username: user?.username || ''
      },
      lastMessage: text,
      lastMessageTime: now,
      unreadCount: fromAdmin ? 0 : 1,
      messages: []
    };
  } else {
    chats[key].lastMessage = text;
    chats[key].lastMessageTime = now;
    if (!fromAdmin) {
      chats[key].unreadCount = (chats[key].unreadCount || 0) + 1;
    }
  }

  chats[key].messages.push({
    id: 'msg-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    sender: fromAdmin ? 'admin' : 'customer',
    text: text,
    time: now
  });

  writeJson(FILES.chats, chats);
  return chats[key];
}

function markChatAsRead(chatId) {
  const chats = getChats();
  const key = String(chatId);
  if (chats[key]) {
    chats[key].unreadCount = 0;
    writeJson(FILES.chats, chats);
  }
}

// ==================== SETTINGS ====================
function getSettings() {
  return readJson(FILES.settings, {
    shopName: "ស្រីល័ក្ខ គ្រឿងក្រអូប",
    slogan: "មានលក់គ្រឿងក្រអូបគ្រប់មុខតម្លៃសមរម្យ គុណភាពល្អ",
    phone: "0962364475",
    phoneDisplay: "096 236 4475",
    telegramDirectLink: "https://t.me/+855962364475",
    callLink: "tel:0962364475",
    currencySymbol: "$",
    exchangeRateKHR: 4000,
    deliveryFees: { phnompenh: 1.5, province: 2.5 },
    abaPayLink: "https://link.payway.com.kh/ABAPAYRz567848B",
    bakongQR: {
      merchantName: "SREYLEAK COSMETICS",
      accountNumber: "0962364475",
      bank: "ABA PayWay / Bakong / Wing"
    }
  });
}

function saveSettings(newSettings) {
  const current = getSettings();
  const updated = { ...current, ...newSettings };
  writeJson(FILES.settings, updated);
  syncToPublicJs();
  return updated;
}

// Export All
module.exports = {
  initSeed,
  getProducts,
  saveProduct,
  deleteProduct,
  getOrders,
  getOrderById,
  addOrder,
  updateOrderStatus,
  getCustomers,
  getChats,
  getChatByUserId,
  recordChatMessage,
  markChatAsRead,
  getSettings,
  saveSettings,
  syncToPublicJs
};
