/**
 * 🤖 Sreyleak Cosmetics Telegram Bot (Zero Dependency - Node.js 18+)
 * ហាង ស្រីល័ក្ខ គ្រឿងក្រអូប (Call: 096 236 4475)
 * 
 * របៀបប្រើ៖
 * 1. ដាក់ BOT_TOKEN ដែលបានពី @BotFather
 * 2. ដាក់ WEB_APP_URL (Link Vercel / GitHub Pages ឬ Ngrok)
 * 3. ដំណើរការ: node bot/bot.js
 */

const fs = require('fs');
const path = require('path');

// អាន configuration ពី env ឬ default
const BOT_TOKEN = process.env.BOT_TOKEN || "9100764037:AAHZBS0LYrpjfqnOiYg-nIU9azgTcOvgqJE";
const WEB_APP_URL = process.env.WEB_APP_URL || "https://chhat.github.io/sreyleak-shop/";
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID || "751196809"; // Telegram Chat ID របស់ម្ចាស់ហាង (ឆុំ ឆាត - ស្រីល័ក្ខ)

const API_BASE = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function tgApi(method, body = {}) {
  try {
    const res = await fetch(`${API_BASE}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return await res.json();
  } catch (err) {
    console.error(`Error calling ${method}:`, err.message);
    return { ok: false, error: err.message };
  }
}

// ផ្ញើសារធម្មតា
async function sendMessage(chatId, text, extra = {}) {
  return await tgApi('sendMessage', {
    chat_id: chatId,
    text: text,
    parse_mode: 'HTML',
    ...extra
  });
}

// ឆ្លើយតបសារ /start
async function handleStart(chatId, firstName) {
  const welcomeText = `🌸 <b>សូមស្វាគមន៍មកកាន់ ហាង ស្រីល័ក្ខ គ្រឿងក្រអូប!</b> 🌸\n` +
    `<i>"មានលក់គ្រឿងក្រអូបគ្រប់មុខតម្លៃសមរម្យ គុណភាពល្អ"</i>\n\n` +
    `ជំរាបសួរ <b>${firstName || 'អតិថិជន'}</b>! ហាងយើងខ្ញុំមានលក់ផលិតផលថែរក្សាសម្រស់៖\n` +
    `• 🧴 <b>ថែរក្សាសក់</b> (សាប៊ូកក់, សេរ៉ូមបណ្តុះសក់, ម៉ាស់អប់សក់)\n` +
    `• 💆‍♀️ <b>ថែរក្សាផ្ទៃមុខ</b> (ហ្វូម, សេរ៉ូមបំបាត់ជាំ, ឡេការពារកម្តៅថ្ងៃ)\n` +
    `• ✨ <b>ថែរក្សាស្បែក</b> (វីតាមីន C, ទឹកជូតសម្អាត Toner, ម៉ាស់បិទមុខ)\n` +
    `• 🌸 <b>ថែរក្សាដងខ្លួន</b> (ឡេលាបខ្លួនស, ស្ក្រាប់ខាត់ស្បែក, ទឹកអប់)\n\n` +
    `🚚 ដឹកជញ្ជូនរហ័សទូទាំង ២៥ ខេត្ត-ក្រុង!\n` +
    `📞 ទំនាក់ទំនង: <b>096 236 4475</b>\n\n` +
    `👇 <b>សូមចុចប៊ូតុងខាងក្រោមដើម្បីចូលមើលទំនិញ និងកុម្ម៉ង់ភ្លាមៗ៖</b>`;

  const keyboard = {
    inline_keyboard: [
      [
        {
          text: "🛒 បើកហាងទំនិញ (Open Shop)",
          web_app: { url: WEB_APP_URL }
        }
      ],
      [
        { text: "📞 តេផ្ទាល់: 096 236 4475", url: "https://t.me/+855962364475" },
        { text: "💬 ឆាតទៅអ្នកលក់", url: "https://t.me/+855962364475" }
      ]
    ]
  };

  await sendMessage(chatId, welcomeText, { reply_markup: keyboard });
}

// ឆ្លើយតបនៅពេលអតិថិជនកុម្ម៉ង់តាមរយៈ Mini App (web_app_data)
async function handleWebAppData(chatId, rawData, user) {
  try {
    const order = JSON.parse(rawData);
    
    // សារផ្ញើជូនអតិថិជន
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

    await sendMessage(chatId, customerReceipt);

    // ប្រសិនបើមានដាក់ ADMIN_CHAT_ID នោះវានឹងផ្ញើដំណឹងទៅកាន់ Telegram ម្ចាស់ហាងភ្លាមៗ
    if (ADMIN_CHAT_ID) {
      const adminNotice = `🚨 <b>មានការកុម្ម៉ង់ទំនិញថ្មី! (New Order)</b> 🚨\n` +
        `----------------------------------------\n` +
        `🔖 <b>កូដ:</b> <code>${order.orderId}</code>\n` +
        `👤 <b>អតិថិជន:</b> ${order.customer.name} (@${user.username || 'no_user'})\n` +
        `📞 <b>ទូរស័ព្ទ:</b> <code>${order.customer.phone}</code>\n` +
        `📍 <b>ទីតាំង:</b> ${order.customer.location} (${order.deliveryType})\n` +
        (order.customer.notes ? `📝 <b>ចំណាំ:</b> ${order.customer.notes}\n` : '') +
        `💵 <b>សរុប:</b> <b>$${order.grandTotalUSD.toFixed(2)}</b>\n` +
        `💳 <b>វិធីទូទាត់:</b> ${order.paymentMethod}\n` +
        `----------------------------------------\n` +
        `🛍️ <b>ទំនិញ:</b>\n` +
        order.items.map(i => `• ${i.name} (${i.qty} មុខ)`).join('\n');

      const adminKeyboard = {
        inline_keyboard: [
          [
            { text: `📞 Call: ${order.customer.phone}`, url: `tel:${order.customer.phone}` },
            { text: `💬 Chat User`, url: `tg://user?id=${chatId}` }
          ]
        ]
      };

      await sendMessage(ADMIN_CHAT_ID, adminNotice, { reply_markup: adminKeyboard });
    }

  } catch (err) {
    console.error("កំហុសក្នុងការ parse web_app_data:", err);
    await sendMessage(chatId, "⚠️ មានបញ្ហាក្នុងការទទួលទិន្នន័យ សូមទាក់ទងផ្ទាល់មកលេខ: 096 236 4475");
  }
}

// Long Polling Bot Loop
async function startPolling() {
  if (BOT_TOKEN === "YOUR_BOT_TOKEN_HERE") {
    console.log("==================================================");
    console.log("⚠️ សូមដាក់ BOT_TOKEN របស់អ្នកនៅក្នុង bot/bot.js ជាមុនសិន!");
    console.log("   - ទទួលបានពី Telegram @BotFather");
    console.log("   - របៀបបង្កើត៖ វាយ /newbot ក្នុង BotFather");
    console.log("==================================================");
    return;
  }

  console.log("🚀 Sreyleak Beauty Bot កំពុងដំណើរការ Long Polling...");
  let offset = 0;

  // Set Menu Button directly in Telegram
  await tgApi('setChatMenuButton', {
    menu_button: {
      type: 'web_app',
      text: '🛒 ហាងទំនិញ',
      web_app: { url: WEB_APP_URL }
    }
  });

  while (true) {
    try {
      const res = await fetch(`${API_BASE}/getUpdates?offset=${offset}&timeout=30`);
      const data = await res.json();

      if (data.ok && data.result.length > 0) {
        for (const update of data.result) {
          offset = update.update_id + 1;
          const msg = update.message;
          if (!msg) continue;

          const chatId = msg.chat.id;
          const text = msg.text || '';

          // Web App Data Received
          if (msg.web_app_data && msg.web_app_data.data) {
            await handleWebAppData(chatId, msg.web_app_data.data, msg.from);
          } else if (text.startsWith('/start')) {
            await handleStart(chatId, msg.from?.first_name);
          } else if (text.startsWith('/contact') || text.startsWith('/help')) {
            await sendMessage(chatId, `🌸 <b>ហាង ស្រីល័ក្ខ គ្រឿងក្រអូប</b> 🌸\n` +
              `📞 ទូរស័ព្ទ: <b>096 236 4475</b>\n` +
              `💬 Telegram: @sreyleak_cosmetics\n` +
              `🚚 ដឹកជញ្ជូនរហ័សទូទាំង ២៥ ខេត្ត-ក្រុង!`);
          } else {
            await handleStart(chatId, msg.from?.first_name);
          }
        }
      }
    } catch (err) {
      console.error("Polling error, retrying in 3s...", err.message);
      await new Promise(r => setTimeout(r, 3000));
    }
  }
}

startPolling();

