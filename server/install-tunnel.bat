@echo off
chcp 65001 >nul
cd /d %~dp0
echo 正在下载公网隧道工具（Cloudflare Tunnel）...
powershell -NoProfile -Command "Invoke-WebRequest -Uri 'https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe' -OutFile 'cloudflared.exe'"
if exist cloudflared.exe (
  echo 下载完成
) else (
  echo 下载失败，请手动下载 cloudflared-windows-amd64.exe 后放到本目录
)
pause
