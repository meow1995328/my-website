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
当前版本号：`20261020b`（日期 + 序号）。用 Grep 批量查找后批量替换。

---

## 触发词参考

碎碎拍：加新动态、更新碎碎拍、新照片、moments 图片、压缩图片、图片处理
更新日志：写更新日志、同步版本号、changelog、 bump 版本、版本号、更新三处