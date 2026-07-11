# 自托管 HTML5 游戏操作手册

> 本文档总结了 PuzzlePlay 上线 Juice Merge 的完整经验，可直接复用于后续所有 GD（GameDistribution）来源的游戏。

## 1. 为什么需要自托管

### 问题：GD 域名锁

GameDistribution 的游戏有两种嵌入方式：

- **iframe 外壳**：`https://html5.gamedistribution.com/{uuid}/`
  - 加载 GD 的 `main.min.js` SDK
  - SDK 读取 `location.ancestorOrigins` 获取宿主域名
  - 域名不在白名单 → 弹出 "Click here to Play" 跳转页（`utm_campaign=block-and-redirect`）
  - 域名在白名单 → 正常运行

- **直链游戏包**：`https://html5.gamedistribution.com/{token}/{uuid}/index.html`
  - 绕过了外壳页面的 SDK
  - **但**游戏内部的 Construct 插件（`azerion-integration-libs.js`、`scripts/main.js`）仍会动态加载 `main.min.js`
  - 加载后同样触发域名校验

### 结论

roundgames、funnygames 等站点能正常嵌入，是因为它们的域名在 GD 白名单里。
puzzleplay.online 不在白名单，所以无论用外壳还是直链都会被拦。

**唯一的解法：把完整游戏包下载到自己服务器，用 CSP 在 HTML 层面拦截所有外部脚本。**

## 2. 完整自托管流程（约 30 分钟）

以游戏 `juice-merge`（GD UUID: `d4c11a64ed754d71b4671d699c66a9c7`）为例。

### 第一步：获取游戏包的 token 和 UUID

从 roundgames 的游戏页面提取 iframe src：
```
https://html5.gamedistribution.com/d4c11a64ed754d71b4671d699c66a9c7/?gd_sdk_referrer_url=...
```

访问 GD 外壳页面，在 HTML 源码里找到直链：
```
https://html5.gamedistribution.com/rvvASMiM/d4c11a64ed754d71b4671d699c66a9c7/index.html
```
- `rvvASMiM` 是 CDN 路径 token（不同游戏可能不同）
- `d4c11a64ed754d71b4671d699c66a9c7` 是游戏 UUID

### 第二步：获取文件清单

下载 `data.json`，提取所有资源文件路径：
```powershell
$uuid = "d4c11a64ed754d71b4671d699c66a9c7"
$token = "rvvASMiM"
$base = "https://html5.gamedistribution.com/$token/$uuid"
$data = (Invoke-WebRequest -Uri "$base/data.json" -UseBasicParsing).Content
$files = [regex]::Matches($data, '"([^"]*\.(?:png|jpg|jpeg|webp|ogg|webm|m4a|wav|mp3|txt|dat|json|svg))"') | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
```

### 第三步：下载所有文件（关键：用 RawContentStream 写入，禁止 PowerShell 编码）

```powershell
$dest = "game-site/games/juice-merge/play"

# 结构文件（手动列出）
$files = @(
  "index.html","main.js","style.css","azerion-libs.js","appmanifest.json",
  "manifest.json","data.json","box2d.wasm","box2d.wasm.js","parabolic.min.js",
  "scripts/main.js","scripts/modernjscheck.js","scripts/supportcheck.js",
  "scripts/c3main.js","scripts/c3runtime.js","scripts/objRefTable.js",
  "scripts/dispatchworker.js","scripts/jobworker.js",
  "scripts/project/javaScriptInEvents.js",
  "scripts/plugins/Globals/c3runtime/plugin.js","type.js","instance.js",
  "actions.js","conditions.js","expressions.js","main.js",
  "scripts/plugins/Azerion_Integration_SDK/c3runtime/*.js",
  "scripts/behaviors/*/c3runtime/*.js",
  "assets/css/orientation.css","assets/css/aeria_ymenu.css",
  "icons/icon-*.png"
)
# ... plus all data.json-listed media/images

foreach ($f in $files) {
  $url = "$base/$encoded"
  $out = Join-Path $dest ($f.Replace('/','\'))
  $outDir = Split-Path $out -Parent
  if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Force -Path $outDir | Out-Null }
  $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 45
  [System.IO.File]::WriteAllBytes($out, $r.RawContentStream.ToArray())
}
``+
> **注意：不要用 `Invoke-WebRequest -OutFile`。** 用 `RawContentStream.ToArray()` + `[System.IO.File]::WriteAllBytes()` 确保二进制安全。`-OutFile` 在某些 PowerShell 版本会加 BOM。

### 第四步：在 play/index.html 里加 CSP（唯一需要改的地方）

在 `<meta charset="UTF-8">` 后面加一行：
```html
<meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline' 'unsafe-eval'">
```

用 .NET API 写入（避免编码问题）：
```powershell
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$html = [System.IO.File]::ReadAllText("$dest\index.html", $utf8NoBom)
$html = $html.Replace('<meta charset="UTF-8">', '<meta charset="UTF-8"><meta http-equiv="Content-Security-Policy" content="script-src ''self'' ''unsafe-inline'' ''unsafe-eval''">')
[System.IO.File]::WriteAllText("$dest\index.html", $html, $utf8NoBom)
```

这条 CSP 做了什么：
- `script-src 'self'` — 只允许加载同源 JS 文件
- `'unsafe-inline'` — 允许内联 script
- `'unsafe-eval'` — Construct 引擎需要 eval
- 所有来自 `html5.api.gamedistribution.com` 的脚本被浏览器直接拒绝

### 第五步：创建网站落地页

复制 `games/juice-merge/index.html` 作为模板，修改：
- SEO（title、description、canonical、OG tags）
- iframe `src` 指向 `play/index.html`
- 内容（About / How to Play / Tips / FAQ）

### 第六步：更新首页和 sitemap

- 在 `index.html` 的 featured grid 里加游戏卡片
- 在 `sitemap.xml` 里加新 URL
- 交叉链接到其他游戏

## 3. PowerShell 编码陷阱（踩过的坑）

### 绝对不要用的方法

```powershell
# ❌ 会加 UTF-8 BOM（EF BB BF），浏览器报 SyntaxError
Set-Content -Path $file -Value $content -Encoding UTF8

# ❌ 会把 UTF-8 多字节字符搞坏（重编码导致字节级损坏）
$content | Out-File -FilePath $file -Encoding UTF8
```

### 正确的方法

```powershell
# ✅ 二进制安全写入（下载文件时）
[System.IO.File]::WriteAllBytes($path, $bytes)

# ✅ 无 BOM 的 UTF-8 文本写入（修改 HTML 时）
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($path, $content, $utf8NoBom)

# ✅ 无 BOM 读取
$content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
```

### 检查 BOM
```powershell
$bytes = [System.IO.File]::ReadAllBytes($file)
$hasBom = ($bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF)
```

## 4. 验证清单

部署前逐项检查：

- [ ] `play/index.html` 有 CSP meta 标签
- [ ] 所有 JS 文件无 BOM
- [ ] `play/` 目录无 `workermain.js`（如果原版是 49 字节的 "Not found" HTML）
- [ ] iframe `src` 指向本地 `play/index.html`，不是 GD CDN
- [ ] 落地页 SEO 全部更新（title、description、canonical、OG、JSON-LD）
- [ ] 首页有游戏卡片
- [ ] sitemap.xml 有新 URL
- [ ] 测试时用无痕窗口（避免缓存）

## 5. 常见问题

### Q: 黑屏 + "Invalid or unexpected token"
A: JS 文件被 PowerShell 编码损坏。重新从 CDN 下载原始版本，用 `[System.IO.File]::WriteAllBytes()`。

### Q: 游戏加载到一部分弹出 "Click here to Play" 跳转
A: GD SDK 仍在加载。确认 CSP 标签已加、外部脚本引用被拦截。

### Q: "Web exports won't work until you upload them"
A: 这是 Construct 原生的 file:// 协议警告。部署到 HTTP 后不出现。可以从 `play/index.html` 里删掉对应的 alert 脚本块。

### Q: 游戏 iframe 显示空白
A: 确认通过 HTTP 服务器测试（不能用 file:// 直接打开）。

## 6. 游戏选择标准

从 burst-embed 列表里选游戏时优先考虑：

- **增量高**（7天新增域名数多）
- **增长率高**（7天增长率 >40%）
- **类型契合**（puzzle、merge、match —— 和 PuzzlePlay 定位一致）
- **非外壳可嵌入**（≥1 个非 GD 外壳的直链源）
- **避免重复**（和已有游戏类型不冲突）
