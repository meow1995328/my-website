---
name: site-content-update
description: Handles 碎碎拍 new photo pipeline and three-site changelog sync. Use when user asks to add new moments photos, process images, write update log, bump version, or sync changelog across files.
---

# 站点内容更新工作流

两个独立的例行维护任务：碎碎拍图片管线 + 更新日志三处同步。按需执行其一或全部。

---

## 任务 A：碎碎拍新动态

### 1. 获取原始图片
原始图在项目外（用户明确要求）：
```
/Users/xuexue/Library/CloudStorage/OneDrive-个人/01文件/★网站创作🐷/Moments原始图片
```
**禁止**在项目内创建 `raw-images/` 或类似目录。

### 2. 压缩（macOS sips，本机无 node）
基线：长边 2560px + JPEG 质量 90。
```bash
sips -Z 2560 -s format jpeg -s formatOptions 90 原图路径 --out 输出路径
```

### 3. 重命名 + 输出
命名规范：`YYYYMMDD_地点a.jpg`（a/b/c 按拍摄时间顺序）。
输出目录：`/Users/xuexue/GitHub-Project/my-website/images/moments/`。

例：2026 年 1 月 24 日在望京西拍了 3 张 → `20260124_望京西a.jpg`、`20260124_望京西b.jpg`、`20260124_望京西c.jpg`。

### 4. 写入 creation-moments.html
找到 `moments` 数组（约 L402），新条目插入**数组最前端**（倒序展示）：
```js
{
    id: 'm-YYYYMMDD',
    images: [
        { src: 'images/moments/YYYYMMDD_地点a.jpg' },
        { src: 'images/moments/YYYYMMDD_地点b.jpg' },
    ],
    text: '配文内容',
    date: 'YYYY年M月',
    location: '地点',
    tags: ['标签1']
}
```
字段说明：
- `id`：`m-` 前缀 + 日期
- `images`：数组，按 a/b/c 顺序
- `text`：动态配文，用中文标点
- `date`：`YYYY年M月` 格式（如 `2026年1月`）
- `location`：拍摄地点，简短
- `tags`：供筛选用，至少一个

### 5. 验证
- 本地预览（如有 http://127.0.0.1:8899/ 则直接打开）
- 确认图片加载无 404
- 确认弹窗画廊箭头/圆点/键盘切换正常

---

## 任务 B：更新日志三处同步

### 1. 写日志内容
从以下类别中选 3 项，每行一类：
- 功能更新
- 质量更新
- UI 更新（或界面更新）
- 内容更新
- Bug 修复

每行格式：`- 类别：一句话描述。`

版本规模约束：
- **大版本**（如 0.2.0-dev、0.3.0-dev）：5 行内
- **小版本**（如 0.3.1-dev）：3 行内

### 2. 确定版本号
格式：`v0.X.Y-alpha`（当前）或 `v0.X.Y-dev`（历史遗留）。每次递增 patch 号。

### 3. 同步三处文件

| 位置 | 操作 |
|------|------|
| `changelog.md` | 在文件顶部（`---` 分隔线之后）插入新版本块，旧版本下移 |
| `site-info-changelog.html` | 同样格式插入新版本块 |
| `index.html` L255 | `<p class="site-version">当前版本 vX.Y.Z · 最新更新 YYYY-MM-DD</p>` |

changelog.md 模板：
```markdown
## [v0.5.6-alpha] - 2026-10-20
- 功能更新：xxx
- UI更新：xxx
- 内容更新：xxx

---
```

### 4. 页面缓存破坏（如涉及 CSS/JS 变更）
全站 28 个 HTML 页面的 `css/style.css?v=` 和 `js/script.js?v=` 必须**同步一起改**。
当前版本号：`20261122a`（日期 + 序号）。用 Grep 批量查找后批量替换。

页面内容（纯 HTML 文案/DOM）改动不需要刷版本号。

---

## 待办清单（用户已确认、尚未开工）

| 项目 | 要点 |
|------|------|
| 浅色模式（简化版） | **只改**页面背景为浅色 + 标题类文字与边框适配 + 导航加 🌙/☀️ 切换按钮（localStorage 记忆）。**不要动** 14 个 `--fh-card-*` 地平线6板块彩色卡片，用户明确排除。参考起点：`:root` 已有 20+ 变量，但还有大量硬编码 `rgba(13,13,13,…)`、`#0d0d0d`、`rgba(255,255,255,0.55)` 需先变量化 |
| SEO 基础优化 | 28 页 `<title>` 与导航文案已不一致处对齐；补 `<meta name="description">`、Open Graph 标签；新增 `sitemap.xml` / `robots.txt` |
| Cloudflare CDN | 域名 NS 改到 Cloudflare 加速国内访问，零备案。注意与 GitHub Pages 的自定义域 `CNAME` 共存配置 |
| 移动端子页面入口 | 现在只能「先进板块首页再进子页」。可选方案：板块首页顶部快捷条 / 长按展开（提示性差）。用户目前选择**暂不动** |
| 荣誉证书数据 | `honorsData` 只有 1 条，方向键切换形同空转，需补真实数据 |
| 付费内容 / 后端 | 手写笔记付费下载。结论：先走爱发电等平台（零开发、抽成 10%），不租服务器；等做内容矩阵时再上后端 + 国内服务器 + 备案 |

### ✅ 已完成

| 项目 | 完成日期 |
|------|------|
| 图片懒加载 `loading="lazy"` | 2026-11-17 — 全站 33 张实际内容图已加（7 个 modal src="" 占位符跳过，2 个 JS 模板已自带） |

### 首页「最新创作」上限规则
最多 **9 张**卡片（3×3 九宫格），超出时删掉最旧的一张再插入新的。避免首页无限变长。

---

## 触发词参考

碎碎拍：加新动态、更新碎碎拍、新照片、moments 图片、压缩图片、图片处理
更新日志：写更新日志、同步版本号、changelog、 bump 版本、版本号、更新三处