@echo off
chcp 65001 > nul
title 🌸 ដំណើរការហាង និង Telegram Bot ទាំងអស់ - ស្រីល័ក្ខ គ្រឿងក្រអូប
color 0A

echo ===================================================================
echo   🌸 ហាង ស្រីល័ក្ខ គ្រឿងក្រអូប - ដំណើរការប្រព័ន្ធទាំងអស់លើ PC
echo   📞 096 236 4475
echo ===================================================================
echo.
echo  [1/2] កំពុងបើក Admin Dashboard ក្នុង Browser...
start http://localhost:3000/admin.html
echo.
echo  [2/2] កំពុងដំណើរការ Web Server, Database និង Telegram Bot ព្រមគ្នា...
echo.
echo  -------------------------------------------------------------------
echo  ✅ គ្រប់មុខងារទាំងអស់ដំណើរការក្នុងផ្ទាំងនេះ៖
echo     - Web Server & Admin API (port 3000)
echo     - Database រក្សាទុកក្នុង folder: /data/
echo     - Telegram Bot ទទួល Order & Live Chat ជាមួយអតិថិជន
echo.
echo     (សូមកុំបិទផ្ទាំងខ្មៅនេះ នៅពេលហាងកំពុងដំណើរការ)
echo  -------------------------------------------------------------------
echo.
node server.js
pause
