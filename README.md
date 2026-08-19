# Voice 智能医美 · 官网（营销落地页）

面向医美机构客户的多页营销官网（科技蓝设计系统），基于《Teleagent智能医美-四端功能详细规划v4》功能清单制作，品牌名为 Voice 智能医美。

## 文件

- `index.html` —— 首页（产品总览）
- `product-badge.html` —— 4G 智能工牌
- `product-coach.html` —— 智能对练系统
- `closed-loop.html` —— 三大核心闭环
- `about.html` —— 关于我们（含预约表单）
- `assets/voice.css` —— 全部样式
- `assets/voice.js` —— 页面交互脚本 + 预约表单提交
- `server/server.js` —— 预约演示后端（Node.js 零依赖，内置 SQLite）
- `server/start-server.bat` —— 一键启动后端
- `server/start-tunnel.bat` —— 一键启动公网隧道（需先运行 install-tunnel.bat）
- `server/install-tunnel.bat` —— 下载公网隧道工具（仅需一次）
- `server/update-api-url.bat` —— 隧道地址变化后更新前端提交地址并自动推送

## 预览

直接双击 `index.html` 用浏览器打开即可本地预览（CSS/JS 为相对路径引用，无需构建）。

## 部署上线（任选其一）

1. **GitHub Pages（免费）**
   - 新建公开仓库（如 `voice-official-website`），上传 `index.html` 与 `assets/` 目录；
   - 仓库 Settings → Pages → Deploy from a branch → 选择 main 分支 + 根目录 → 保存；
   - 访问 `https://<用户名>.github.io/voice-official-website/`。
   - 注意：中国大陆访问 GitHub Pages 可能不稳定，正式运营建议改用云服务器 + 域名（需 ICP 备案）。

## 正式访问地址（两个版本共存）

- 科技蓝新版（当前主站，5 页）：**https://qinshifenmian.github.io/voice-official-website/**（仓库 `voice-official-website`）
- 紫色经典版 v1（单页）：**https://qinshifenmian.github.io/voice-official-website-v1/**（仓库 `voice-official-website-v1`）

两个站点共用同一套本机后端与数据库，访客在任何一站提交的预约都会写入 `server/data/voice.db`。

2. **国内云主机 / 对象存储**
   - 阿里云 OSS / 腾讯云 COS 静态网站托管，或云服务器 Nginx；
   - 将 `index.html` 放至站点根目录即可。

3. **自有域名**
   - 绑定域名后，将 `index.html` 作为首页；
   - 域名需 ICP 备案（国内服务器），备案号填到页脚占位处。

## 上线前请替换的占位内容

- 页脚 ICP 备案号：`渝ICP备XXXXXXXX号（备案信息待补充）`
- 联系邮箱：`contact@voice.cn（示例邮箱）`
- 联系电话：`400-000-0000（示例）`
- “关于我们”文字：可按公司实际介绍微调
- 数据看板 / 手机界面中的示例数字：上线前请替换为真实产品截图或演示数据

## 预约演示数据（后端 + 数据库）

预约表单（位于 `about.html`）已接通真实后端，访客提交后会写入**本机 SQLite 数据库**（`server/data/voice.db`），数据不会上传到 GitHub。

### 日常使用（电脑需保持开机）

1. 双击 `server/start-server.bat` —— 启动后端（保持窗口不关）；
2. 双击 `server/start-tunnel.bat` —— 启动公网隧道（保持窗口不关），窗口内会显示 `https://xxxx.trycloudflare.com` 地址；
3. 隧道地址与 `assets/voice.js` 中的 `DEMO_API` 不一致时，双击 `server/update-api-url.bat`，把新地址粘贴进去，脚本会自动更新并推送到线上；
4. 查看预约数据：浏览器打开 `http://127.0.0.1:8787/admin`，输入管理令牌（首次启动后端时窗口会打印，保存在 `server/config.json`），可查看 / 删除 / 导出 CSV。

### 注意事项

- 后端与隧道依赖你的电脑开机、联网，两个窗口都不能关闭；
- Cloudflare 免费隧道的公网地址是临时的，电脑重启后地址会变化，需要按上面第 3 步重新更新前端地址；
- `server/data/`、`server/config.json`、`server/cloudflared.exe` 已加入 `.gitignore`，不会推送到 GitHub，客户数据不会公开；
- 长期正式运营建议：购买云服务器部署后端 + 绑定域名 + ICP 备案，届时无需本机开机和临时隧道。

## 页面结构

首页（Hero + 核心亮点 + 产品入口）→ 智能工牌（采集 / 监控 / 员工端 / 管理端）→ 智能对练（数字教练 / 训练 / 考核）→ 三大核心闭环 → 关于我们（公司介绍 + 预约演示）
