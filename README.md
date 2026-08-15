# Voice 智能医美 · 官网（营销落地页）

面向医美机构客户的单页营销官网，基于《Teleagent智能医美-四端功能详细规划v4》功能清单制作，品牌名为 Voice 智能医美。
视觉风格参照 www.yanjiai.com（浅色企业风：白底 + 紫色渐变主色 + 衬底英文大标题 + 白色卡片）。

## 文件

- `index.html` —— 官网页面（HTML）
- `assets/voice.css` —— 全部样式
- `assets/voice.js` —— 页面交互脚本

## 预览

直接双击 `index.html` 用浏览器打开即可本地预览（CSS/JS 为相对路径引用，无需构建）。

## 部署上线（任选其一）

1. **GitHub Pages（免费）**
   - 新建公开仓库（如 `voice-official-website`），上传 `index.html` 与 `assets/` 目录；
   - 仓库 Settings → Pages → Deploy from a branch → 选择 main 分支 + 根目录 → 保存；
   - 访问 `https://<用户名>.github.io/voice-official-website/`。
   - 注意：中国大陆访问 GitHub Pages 可能不稳定，正式运营建议改用云服务器 + 域名（需 ICP 备案）。

本项目的正式访问地址：**https://qinshifenmian.github.io/voice-official-website/**

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
- 预约表单：当前为前端示例，提交后仅显示成功提示，请对接 CRM / 表单服务（如金数据、问卷星或自有接口）
- “关于我们”文字：可按公司实际介绍微调
- 数据看板 / 手机界面中的示例数字：上线前请替换为真实产品截图或演示数据

## 页面结构

首屏 Hero（居中大标题 + 四项数据）→ 技术底座 → 四层架构（应用层 / 平台层 / 硬件层 / 数据层）→ 4G 智能工牌 → AI 数据分析中台 → AI 智能体矩阵 → 六大数据闭环 → 行业价值 → 关于公司 → 预约演示 → 页脚
