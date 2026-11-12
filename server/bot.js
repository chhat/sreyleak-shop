/**
 * 🤖 Sreyleak Cosmetics Telegram Bot Engine
 * Handles Telegram long-polling, customer chat recording, order notifications with REAL photos
 */

const db = require('./db.js');

const BOT_TOKEN = process.env.BOT_TOKEN || "9100764037:AAHZBS0LYrpjfqnOiYg-nIU9azgTcOvgqJE";
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID || "751196809";
const WEB_APP_URL = process.env.WEB_APP_URL || "https://chhat.github.io/sreyleak-shop/";

const API_BASE = `https://api.telegram.org/bot${BOT_TOKEN}`;

// Base API Call
async function tgApi(method, body = {}) {
  try {
    const res = await fetch(`${API_BASE}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return await res.json();
  } catch (err) {
    console.error(`Telegram API Error (${method}):`, err.message);
    return { ok: false, error: err.message };
  }
}

// Send Text Message
async function sendMessage(chatId, text, extra = {}) {
  return await tgApi('sendMessage', {
    chat_id: chatId,
    text: text,
    parse_mode: 'HTML',
    ...extra
  });
}

// Send Real Photo (via multipart FormData with binary buffer)
async function sendRealPhoto(chatId, photoUrl, caption = '', extra = {}) {
  try {
    // Download the image binary buffer
    const imgRes = await fetch(photoUrl);
    if (!imgRes.ok) throw new Error(`HTTP ${imgRes.status}`);
    const blob = await imgRes.blob();

    const form = new FormData();
    form.append('chat_id', chatId);
    form.append('photo', blob, 'product.jpg');
    if (caption) form.append('caption', caption);
    form.append('parse_mode', 'HTML');

    const res = await fetch(`${API_BASE}/sendPhoto`, {
      method: 'POST',
      body: form
    });
    return await res.json();
  } catch (err) {
    console.log(`Fallback URL sendPhoto for ${photoUrl}:`, err.message);
    // Fallback to sending URL directly if buffer fetch fails
    return await tgApi('sendPhoto', {
      chat_id: chatId,
      photo: photoUrl,
      caption: caption,
      parse_mode: 'HTML',
      ...extra
    });
  }
}

// Handle Order Event (Called from Telegram WebApp or from Web API)
async function notifyNewOrder(order, user = null) {
  // 1. Save into PC Database
  const savedOrder = db.addOrder(order);
  console.log(`📦 Order ${savedOrder.orderId} បានរក្សាទុកក្នុង PC Database រួចរាល់!`);

  const chatId = user?.id || (order.customer?.telegramId) || null;

  // 2. Send Customer Receipt
  if (chatId) {
    let customerReceipt = `🎉 <b>ការកុម្ម៉ង់របស់លោកអ្នកទទួលបានជោគជ័យ!</b> 🎉\n` +
      `----------------------------------------\n` +
      `🔖 <b>លេខកូដបញ្ជាទិញ:</b> <code>${order.orderId}</code>\n` +
      `📅 <b>កាលបរិច្ឆេទ:</b> ${order.date}\n\n` +
      `👤 <b>អ្នកទទួល:</b> ${order.customer.name}\n` +
      `📞 <b>លេខទូរស័ព្ទ:</b> ${order.customer.phone}\n` +
      `📍 <b>ទីតាំង:</b> ${order.customer.location} (${order.deliveryType})\n` +
      (order.customer.notes ? `📝 <b>ចំណាំ:</b> ${order.customer.notes}\n` : '') +
      `----------------------------------------\n` +
      `🛍️ <b>បញ្ជីទំនិញ:</b>\n`;

    order.items.forEach((it, idx) => {
      customerReceipt += `  ${idx + 1}. <b>${it.name}</b>\n     ចំនួន: ${it.qty} x $${it.priceUSD.toFixed(2)} = $${it.totalUSD.toFixed(2)}\n`;
    });

    customerReceipt += `----------------------------------------\n` +
      `🚚 <b>ថ្លៃដឹកជញ្ជូន:</b> $${order.deliveryFeeUSD.toFixed(2)}\n` +
      `💵 <b>សរុបទឹកប្រាក់:</b> <b>$${order.grandTotalUSD.toFixed(2)}</b> (${order.grandTotalKHR.toLocaleString()} ៛)\n` +
      `💳 <b>វិធីទូទាត់:</b> ${order.paymentMethod}\n\n` +
      `🙏 <i>ខាងហាង ស្រីល័ក្ខ នឹងទាក់ទងរៀបចំដឹកជញ្ជូនជូនលោកអ្នកឆាប់ៗនេះ!</i>\n` +
      `📞 ទំនាក់ទំនងសាកសួរ: <b>096 236 4475</b>`;

    const customerButtons = [];
    if (order.abaPayLink) {
      customerButtons.push([{ text: "📲 ចុចបង់ប្រាក់តាម ABA PAY", url: order.abaPayLink }]);
    }
    customerButtons.push([
      { text: "📞 តេទៅអ្នកលក់: 096 236 4475", url: "tel:0962364475" },
      { text: "💬 ឆាតសាកសួរ", url: "https://t.me/+855962364475" }
    ]);

    await sendMessage(chatId, customerReceipt, { reply_markup: { inline_keyboard: customerButtons } });
  }

  // 3. Notify Shop Owner (ADMIN) with Text & REAL PHOTOS
  if (ADMIN_CHAT_ID) {
    let adminNotice = `🚨 <b>មានការកុម្ម៉ង់ទំនិញថ្មី! (New Order)</b> 🚨\n` +
      `----------------------------------------\n` +
      `🔖 <b>កូដបញ្ជាទិញ:</b> <code>${order.orderId}</code>\n` +
      `📅 <b>កាលបរិច្ឆេទ:</b> ${order.date}\n\n` +
      `👤 <b>អតិថិជន:</b> <b>${order.customer.name}</b> (@${user?.username || 'no_user'})\n` +
      `📞 <b>លេខទូរស័ព្ទ:</b> <code>${order.customer.phone}</code>\n` +
      `📍 <b>ទីតាំងដឹក:</b> ${order.customer.location} (${order.deliveryType})\n` +
      (order.customer.notes ? `📝 <b>ចំណាំ:</b> ${order.customer.notes}\n` : '') +
      `----------------------------------------\n` +
      `🛍️ <b>បញ្ជីទំនិញ (${order.items.length} មុខ):</b>\n`;

    order.items.forEach((it, idx) => {
      adminNotice += `  ${idx + 1}. <b>${it.name}</b>\n     ចំនួន: <b>${it.qty}</b> ${it.size ? `(${it.size})` : ''} | តម្លៃរាយ: $${it.priceUSD.toFixed(2)} | សរុប: <b>$${it.totalUSD.toFixed(2)}</b>\n`;
    });

    adminNotice += `----------------------------------------\n` +
      `🚚 <b>ថ្លៃដឹកជញ្ជូន:</b> $${order.deliveryFeeUSD.toFixed(2)}\n` +
      `💵 <b>សរុបទឹកប្រាក់ត្រូវទារ:</b> <b>$${order.grandTotalUSD.toFixed(2)}</b> (${order.grandTotalKHR.toLocaleString()} ៛)\n` +
      `💳 <b>វិធីទូទាត់:</b> ${order.paymentMethod}\n` +
      (order.abaPayLink ? `📲 <b>ABA Link:</b> ${order.abaPayLink}\n` : '') +
      `\n👇 <i>(រូបភាពផលិតផលពិតប្រាកដនីមួយៗ និងតម្លៃត្រូវបានផ្ញើជូនខាងក្រោម)</i>`;

    const adminKeyboard = {
      inline_keyboard: [
        [
          { text: `📞 Call: ${order.customer.phone}`, url: `tel:${order.customer.phone}` },
          { text: `💬 Chat អតិថិជន`, url: chatId ? `tg://user?id=${chatId}` : `https://t.me/+855962364475` }
        ]
      ]
    };

    // Send summary notice
    await sendMessage(ADMIN_CHAT_ID, adminNotice, { reply_markup: adminKeyboard });

    // Send REAL PHOTO for each ordered product
    for (const item of order.items) {
      if (item.image) {
        const photoCaption = `🛍️ <b>${item.name}</b>\n` +
          `🔢 ចំនួនកុម្ម៉ង់: <b>${item.qty}</b> ${item.size ? `(${item.size})` : ''}\n` +
          `💵 តម្លៃរាយ: <b>$${item.priceUSD.toFixed(2)}</b>\n` +
          `💰 សរុបមុខនេះ: <b>$${item.totalUSD.toFixed(2)}</b> (${(item.totalUSD * 4000).toLocaleString()} ៛)\n` +
          `🔖 សម្រាប់កូដ: <code>${order.orderId}</code>`;

        await sendRealPhoto(ADMIN_CHAT_ID, item.image, photoCaption);
      }
    }
  }

  return savedOrder;
}

// Send Admin Reply to Customer from PC Dashboard
async function sendAdminReply(chatId, text) {
  const res = await sendMessage(chatId, `🌸 <b>ឆ្លើយតបពីហាង ស្រីល័ក្ខ គ្រឿងក្រអូប:</b>\n\n${text}`);
  if (res.ok) {
    db.recordChatMessage(chatId, null, text, true);
  }
  return res;
}

// Start Telegram Polling Loop
let isPolling = false;

async function startBot() {
  if (isPolling) return;
  isPolling = true;

  console.log("🚀 Sreyleak Telegram Bot Engine កំពុងដំណើរការ Long Polling...");
  let offset = 0;

  // Set Default Menu Button
  await tgApi('setChatMenuButton', {
    menu_button: {
      type: 'web_app',
      text: '🛒 បើកហាងទំនិញ',
      web_app: { url: WEB_APP_URL }
    }
  });

  while (isPolling) {
    try {
      const res = await fetch(`${API_BASE}/getUpdates?offset=${offset}&timeout=30`);
      const data = await res.json();

      if (data.ok && data.result && data.result.length > 0) {
        for (const update of data.result) {
          offset = update.update_id + 1;
          const msg = update.message;
          if (!msg) continue;

          const chatId = msg.chat.id;
          const user = msg.from;
          const text = msg.text || '';

          // Record ALL incoming customer messages in local PC database!
          if (text) {
            db.recordChatMessage(chatId, user, text, false);
          }

          // Case 1: Web App Data (Order submitted)
          if (msg.web_app_data && msg.web_app_data.data) {
            try {
              const orderData = JSON.parse(msg.web_app_data.data);
              await notifyNewOrder(orderData, user);
            } catch (e) {
              console.error("Order parse error:", e);
            }
          }
          // Case 2: /admin command
          else if (text.startsWith('/admin')) {
            const adminUrl = WEB_APP_URL.endsWith('/') ? `${WEB_APP_URL}admin.html` : `${WEB_APP_URL}/admin.html`;
            await sendMessage(chatId, `⚙️ <b>ផ្ទាំងគ្រប់គ្រង Admin (ស្រីល័ក្ខ គ្រឿងក្រអូប)</b>\n\nសូមចុចប៊ូតុងខាងក្រោមដើម្បីគ្រប់គ្រងទំនិញ និងមើល Chat អតិថិជន៖\n🔑 កូដ PIN: <code>2364</code>`, {
              reply_markup: {
                inline_keyboard: [
                  [{ text: "⚙️ បើក Admin Dashboard", web_app: { url: adminUrl } }]
                ]
              }
            });
          }
          // Case 3: /start or other commands
          else if (text.startsWith('/start')) {
            const isAdmin = String(chatId) === String(ADMIN_CHAT_ID);
            const welcomeText = `🌸 <b>សូមស្វាគមន៍មកកាន់ ហាង ស្រីល័ក្ខ គ្រឿងក្រអូប!</b> 🌸\n` +
              `<i>"មានលក់គ្រឿងក្រអូបគ្រប់មុខតម្លៃសមរម្យ គុណភាពល្អ"</i>\n\n` +
              `ជំរាបសួរ <b>${user.first_name || 'អតិថិជន'}</b>! ហាងយើងខ្ញុំមានលក់ផលិតផលថែរក្សាសម្រស់៖\n` +
              `• 🧴 <b>ថែរក្សាសក់</b> • 💆‍♀️ <b>ថែរក្សាផ្ទៃមុខ</b>\n` +
              `• ✨ <b>ថែរក្សាស្បែក</b> • 🌸 <b>ថែរក្សាដងខ្លួន</b>\n\n` +
              `🚚 ដឹកជញ្ជូនរហ័សទូទាំង ២៥ ខេត្ត-ក្រុង!\n` +
              `📞 ទំនាក់ទំនង: <b>096 236 4475</b>\n\n` +
              `👇 <b>សូមចុចប៊ូតុងខាងក្រោមដើម្បីចូលមើលទំនិញ និងកុម្ម៉ង់ភ្លាមៗ៖</b>`;

            const inlineButtons = [
              [{ text: "🛒 បើកហាងទំនិញ (Open Shop)", web_app: { url: WEB_APP_URL } }],
              [
                { text: "📞 តេផ្ទាល់: 096 236 4475", url: "https://t.me/+855962364475" },
                { text: "💬 ឆាតទៅអ្នកលក់", url: "https://t.me/+855962364475" }
              ]
            ];

            if (isAdmin) {
              const adminUrl = WEB_APP_URL.endsWith('/') ? `${WEB_APP_URL}admin.html` : `${WEB_APP_URL}/admin.html`;
              inlineButtons.push([
                { text: "⚙️ ផ្ទាំងគ្រប់គ្រង Admin", web_app: { url: adminUrl } }
              ]);
            }

            await sendMessage(chatId, welcomeText, { reply_markup: { inline_keyboard: inlineButtons } });
          }
          // Case 4: General Customer Inquiries (Chat)
          else {
            // Send automatic courteous reply and let customer know shop owner will answer
            const replyMsg = `🙏 <b>សូមអរគុណសម្រាប់សាររបស់លោកអ្នក!</b>\n\n` +
              `ខាងហាង <b>ស្រីល័ក្ខ គ្រឿងក្រអូប</b> បានទទួលសាររបស់លោកអ្នកហើយ។ ពួកយើងនឹងឆ្លើយតបជូនលោកអ្នកឆាប់ៗនេះ!\n\n` +
              `📞 ទំនាក់ទំនងបន្ទាន់: <b>096 236 4475</b>\n` +
              `🛒 ឬចុចប៊ូតុងខាងក្រោមដើម្បីចូលមើលទំនិញ៖`;

            await sendMessage(chatId, replyMsg, {
              reply_markup: {
                inline_keyboard: [
                  [{ text: "🛒 បើកហាងទំនិញ", web_app: { url: WEB_APP_URL } }]
                ]
              }
            });
          }
        }
      }
    } catch (err) {
      console.error("Polling error, retrying in 3s...", err.message);
      await new Promise(r => setTimeout(r, 3000));
    }
  }
}

module.exports = {
  startBot,
  notifyNewOrder,
  sendAdminReply,
  sendMessage,
  sendRealPhoto
};

if (require.main === module) {
  startBot();
}
