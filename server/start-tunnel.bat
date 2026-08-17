@echo off
chcp 65001 >nul
cd /d %~dp0
if not exist cloudflared.exe (
  echo 未找到公网隧道工具，请先运行 install-tunnel.bat
  pause
  exit /b
)
echo 正在启动公网隧道，请稍候...
echo 启动后会显示一个 https://xxxx.trycloudflare.com 地址，那就是本机后端的公网入口
cloudflared.exe tunnel --url http://127.0.0.1:8787
pause
