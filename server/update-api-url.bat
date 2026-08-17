@echo off
chcp 65001 >nul
cd /d %~dp0\..
set /p APIURL=请输入新的公网地址（形如 https://xxxx.trycloudflare.com）:
powershell -NoProfile -Command "$p='assets\voice.js'; $c=[System.IO.File]::ReadAllText($p); $c=[regex]::Replace($c, 'DEMO_API = ''[^'']*''', 'DEMO_API = '''+$env:APIURL+''''); [System.IO.File]::WriteAllText($p, $c, (New-Object System.Text.UTF8Encoding $false))"
echo 已更新本地前端提交地址，正在推送到线上...
git add assets/voice.js
git commit -m "更新预约表单后端地址"
git push origin main
echo 推送完成，线上约 1-2 分钟后生效
pause
