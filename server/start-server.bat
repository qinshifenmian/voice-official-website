@echo off
chcp 65001 >nul
cd /d %~dp0
echo 正在启动 Voice 预约演示后端...
where node >nul 2>nul
if %errorlevel%==0 (
  node server.js
) else (
  "C:\Users\seven\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" server.js
)
pause
