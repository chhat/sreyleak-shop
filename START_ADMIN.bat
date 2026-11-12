@echo off
chcp 65001 > nul
title Sreyleak Cosmetics - Admin Panel
start http://localhost:3000/admin.html
node server.js
pause
