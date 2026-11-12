# -*- coding: utf-8 -*-
"""
🤖 Sreyleak Cosmetics Telegram Bot (Python 3)
ហាង ស្រីល័ក្ខ គ្រឿងក្រអូប (Call: 096 236 4475)

របៀបប្រើ៖
1. ប្តូរ BOT_TOKEN និង WEB_APP_URL
2. ដំណើរការ: python bot/bot.py
"""

import os
import json
import time
import urllib.request
import urllib.parse

BOT_TOKEN = os.getenv("BOT_TOKEN", "9100764037:AAHZBS0LYrpjfqnOiYg-nIU9azgTcOvgqJE")
WEB_APP_URL = os.getenv("WEB_APP_URL", "https://chhat.github.io/sreyleak-shop/")
ADMIN_CHAT_ID = os.getenv("ADMIN_CHAT_ID", "")

API_BASE = f"https://api.telegram.org/bot{BOT_TOKEN}"

def tg_api(method, payload=None):
    url = f"{API_BASE}/{method}"
    try:
        if payload:
            data = json.dumps(payload).encode('utf-8')
            req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
        else:
            req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=35) as resp:
            return json.loads(resp.read().decode('utf-8'))
    except Exception as e:
        print(f"API Error ({method}): {e}")
        return {"ok": False, "error": str(e)}

def send_message(chat_id, text, reply_markup=None):
    body = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "HTML"
    }
    if reply_markup:
        body["reply_markup"] = reply_markup
    return tg_api("sendMessage", body)

def send_photo(chat_id, photo, caption=None):
    body = {
        "chat_id": chat_id,
        "photo": photo,
        "caption": caption or "",
        "parse_mode": "HTML"
    }
    return tg_api("sendPhoto", body)

def handle_start(chat_id, first_name):
    welcome = (
        f"🌸 <b>សូមស្វាគមន៍មកកាន់ ហាង ស្រីល័ក្ខ គ្រឿងក្រអូប!</b> 🌸\n"
        f"<i>\"មានលក់គ្រឿងក្រអូបគ្រប់មុខតម្លៃសមរម្យ គុណភាពល្អ\"</i>\n\n"
        f"ជំរាបសួរ <b>{first_name or 'អតិថិជន'}</b>! ហាងយើងខ្ញុំមានលក់ផលិតផលថែរក្សាសម្រស់៖\n"
        f"• 🧴 <b>ថែរក្សាសក់</b>\n"
        f"• 💆‍♀️ <b>ថែរក្សាផ្ទៃមុខ</b>\n"
        f"• ✨ <b>ថែរក្សាស្បែក</b>\n"
        f"• 🌸 <b>ថែរក្សាដងខ្លួន</b>\n\n"
        f"🚚 ដឹកជញ្ជូនរហ័សទូទាំង ២៥ ខេត្ត-ក្រុង!\n"
        f"📞 ទំនាក់ទំនង: <b>096 236 4475</b>\n\n"
        f"👇 <b>សូមចុចប៊ូតុងខាងក្រោមដើម្បីចូលមើលទំនិញ និងកុម្ម៉ង់ភ្លាមៗ៖</b>"
    )
    keyboard = {
        "inline_keyboard": [
            [
                {
                    "text": "🛒 បើកហាងទំនិញ (Open Shop)",
                    "web_app": {"url": WEB_APP_URL}
                }
            ],
            [
                {"text": "📞 Call: 096 236 4475", "url": "https://t.me/+855962364475"},
                {"text": "💬 ឆាតទៅអ្នកលក់", "url": "https://t.me/+855962364475"}
            ]
        ]
    }
    send_message(chat_id, welcome, keyboard)

def handle_web_app_data(chat_id, raw_data):
    try:
        order = json.loads(raw_data)
        receipt = (
            f"🎉 <b>ការកុម្ម៉ង់របស់លោកអ្នកទទួលបានជោគជ័យ!</b> 🎉\n"
            f"----------------------------------------\n"
            f"🔖 <b>លេខកូដបញ្ជាទិញ:</b> <code>{order.get('orderId')}</code>\n"
            f"📅 <b>កាលបរិច្ឆេទ:</b> {order.get('date')}\n\n"
            f"👤 <b>អ្នកទទួល:</b> {order['customer']['name']}\n"
            f"📞 <b>ទូរស័ព្ទ:</b> {order['customer']['phone']}\n"
            f"📍 <b>ទីតាំង:</b> {order['customer']['location']} ({order.get('deliveryType')})\n"
            f"----------------------------------------\n"
            f"🛍️ <b>បញ្ជីទំនិញ:</b>\n"
        )
        for idx, item in enumerate(order.get('items', []), 1):
            receipt += f"  {idx}. <b>{item['name']}</b> x {item['qty']} = ${item['totalUSD']:.2f}\n"

        receipt += (
            f"----------------------------------------\n"
            f"🚚 <b>ថ្លៃដឹកជញ្ជូន:</b> ${order.get('deliveryFeeUSD', 0):.2f}\n"
            f"💵 <b>សរុប:</b> <b>${order.get('grandTotalUSD', 0):.2f}</b> ({order.get('grandTotalKHR', 0):,} ៛)\n"
            f"💳 <b>ទូទាត់:</b> {order.get('paymentMethod')}\n\n"
            f"📞 ទំនាក់ទំនងសាកសួរ: <b>096 236 4475</b>"
        )
        send_message(chat_id, receipt)

        # Notify Admin with photos
        if ADMIN_CHAT_ID:
            admin_msg = (
                f"🚨 <b>មានការកុម្ម៉ង់ទំនិញថ្មី! (New Order)</b> 🚨\n"
                f"----------------------------------------\n"
                f"🔖 <b>កូដ:</b> <code>{order.get('orderId')}</code>\n"
                f"👤 <b>អតិថិជន:</b> {order['customer']['name']}\n"
                f"📞 <b>ទូរស័ព្ទ:</b> <code>{order['customer']['phone']}</code>\n"
                f"📍 <b>ទីតាំង:</b> {order['customer']['location']} ({order.get('deliveryType')})\n"
                f"💵 <b>សរុប:</b> <b>${order.get('grandTotalUSD', 0):.2f}</b>\n"
                f"💳 <b>ទូទាត់:</b> {order.get('paymentMethod')}\n"
                f"----------------------------------------\n"
                f"🛍️ <b>បញ្ជីទំនិញ:</b>\n"
            )
            for idx, item in enumerate(order.get('items', []), 1):
                admin_msg += f"  {idx}. <b>{item['name']}</b> ({item.get('size','')})\n     ចំនួន: {item['qty']} x ${item['priceUSD']:.2f} = ${item['totalUSD']:.2f}\n"

            admin_kb = {
                "inline_keyboard": [
                    [
                        {"text": f"📞 Call: {order['customer']['phone']}", "url": f"tel:{order['customer']['phone']}"},
                        {"text": "💬 Chat", "url": f"tg://user?id={chat_id}"}
                    ]
                ]
            }
            send_message(ADMIN_CHAT_ID, admin_msg, admin_kb)

            # Send photos of products to Admin
            for item in order.get('items', []):
                if item.get('image'):
                    caption = (
                        f"🛍️ <b>{item['name']}</b>\n"
                        f"🔢 ចំនួនកុម្ម៉ង់: <b>{item['qty']}</b> {item.get('size','')}\n"
                        f"💵 តម្លៃរាយ: <b>${item['priceUSD']:.2f}</b>\n"
                        f"💰 សរុបមុខនេះ: <b>${item['totalUSD']:.2f}</b>\n"
                        f"🔖 សម្រាប់កូដ: <code>{order.get('orderId')}</code>"
                    )
                    send_photo(ADMIN_CHAT_ID, item['image'], caption)
    except Exception as e:
        print("Error handling order:", e)

def main():
    if BOT_TOKEN == "YOUR_BOT_TOKEN_HERE":
        print("⚠️ សូមដាក់ BOT_TOKEN របស់អ្នកនៅក្នុង bot/bot.py ជាមុនសិន!")
        return

    print("🚀 Python Bot កំពុងដំណើរការ...")
    offset = 0
    while True:
        try:
            res = tg_api(f"getUpdates?offset={offset}&timeout=30")
            if res.get("ok") and res.get("result"):
                for upd in res["result"]:
                    offset = upd["update_id"] + 1
                    msg = upd.get("message")
                    if not msg:
                        continue
                    chat_id = msg["chat"]["id"]
                    text = msg.get("text", "")

                    if "web_app_data" in msg:
                        handle_web_app_data(chat_id, msg["web_app_data"]["data"])
                    elif text.startswith("/start"):
                        handle_start(chat_id, msg.get("from", {}).get("first_name"))
                    else:
                        handle_start(chat_id, msg.get("from", {}).get("first_name"))
        except Exception as e:
            print("Loop error:", e)
            time.sleep(3)

if __name__ == "__main__":
    main()

