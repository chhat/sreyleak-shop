@echo off
chcp 65001 > nul
title 🌸 ដំណើរការហាង និង Telegram Bot ទាំងអស់
color 0A

echo ===================================================================
echo   🌸 ហាង ស្រីល័ក្ខ គ្រឿងក្រអូប - ដំណើរការប្រព័ន្ធទាំងអស់លើ PC
echo ===================================================================
echo.
echo  [1/3] កំពុងបើក Telegram Bot ក្នុងផ្ទាំងដាច់ដោយឡែក...
start "Telegram Bot - ស្រីល័ក្ខ" cmd /k "node bot/bot.js"

echo  [2/3] កំពុងបើក Admin Dashboard ក្នុង Browser...
start http://localhost:3000/admin.html

echo  [3/3] កំពុងដំណើរការ Web Server...
echo.
node server.js
pause
