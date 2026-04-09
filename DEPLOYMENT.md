# Deployment Guide

本指南說明如何將 CV Portfolio 網站部署到各種平台。

## 🚀 GitHub Pages 部署（推薦）

### 方法 1: 使用 GitHub Actions（自動部署）

1. **確保 dist 文件夾已創建**
   ```bash
   # 如果還沒有 dist 文件夾，運行：
   mkdir -p dist/css dist/img
   cp cv.html dist/
   cp css/*.css dist/css/
   cp img/*.svg dist/img/
   cp public/favicon.ico dist/ 2>/dev/null || true
   ```

2. **提交並推送代碼**
   ```bash
   git add dist/
   git add .github/workflows/deploy.yml
   git commit -m "Add dist folder and update deployment workflow"
   git push origin main
   ```

3. **啟用 GitHub Pages**
   - 前往 GitHub 倉庫：`https://github.com/ke22/cv`
   - 點擊 **Settings** → **Pages**
   - 在 **Source** 選擇：**GitHub Actions**
   - 保存設置

4. **等待部署完成**
   - 前往 **Actions** 標籤頁
   - 查看 "Deploy to GitHub Pages" workflow
   - 等待部署完成（通常 1-2 分鐘）

5. **訪問網站**
   - 部署完成後，訪問：`https://ke22.github.io/cv/`
   - URL 會在 Actions 的部署步驟中顯示

### 方法 2: 手動部署到 GitHub Pages

1. **切換到 gh-pages 分支**
   ```bash
   git checkout -b gh-pages
   ```

2. **複製 dist 文件夾內容到根目錄**
   ```bash
   cp -r dist/* .
   ```

3. **提交並推送**
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin gh-pages
   ```

4. **在 GitHub 設置中選擇 gh-pages 分支作為源**

## 🌐 其他部署方式

### Netlify

1. 註冊/登錄 [Netlify](https://www.netlify.com/)
2. 點擊 "Add new site" → "Deploy manually"
3. 將 `dist` 文件夾拖放到部署區域
4. 或連接 GitHub 倉庫，設置：
   - **Build command**: (留空)
   - **Publish directory**: `dist`

### Vercel

1. 註冊/登錄 [Vercel](https://vercel.com/)
2. 導入 GitHub 倉庫
3. 設置：
   - **Framework Preset**: Other
   - **Root Directory**: `dist`
   - **Build Command**: (留空)
   - **Output Directory**: `.`

### Microsoft Azure（Static Web Apps — CV v2）

此流程部署 **`cv-v2.html` 靜態站**（`css/`、`js/`、`img/`、`assets/`），與 Next.js `npm run build` 無關。

#### 一次性設定

1. [Azure Portal](https://portal.azure.com) → **建立資源** → **靜態 Web應用程式**（Static Web App）。
2. **訂用帳戶 / 資源群組 / 名稱 / 區域**：依需求填寫；**SKU** 可選 Free。
3. **部署詳細資料**：**GitHub**，授權並選取此倉庫與分支（例如 `main`）。
   - 若精靈會自動建立 workflow，可與本倉庫的 `.github/workflows/azure-static-web-apps.yml` **合併或擇一使用**（建議保留本倉庫版本，因含 `prepare-azure-static.sh`）。
4. 在 Azure 靜態 Web 應用程式 → **管理部署權杖**（或建立精靈結尾）複製 **部署權杖**。
5. GitHub 倉庫 → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**
   - 名稱：`AZURE_STATIC_WEB_APPS_API_TOKEN`
   - 值：貼上部署權杖

#### 觸發部署

- 推送至 `main` 會執行 `.github/workflows/azure-static-web-apps.yml`：
  - 執行 `scripts/prepare-azure-static.sh` 產生 `swa-output/`（含 `index.html` = `cv-v2.html` 副本）。
  - 上傳至 Azure Static Web Apps。
- 或在 **Actions** 手動執行 **Azure Static Web Apps — CV v2**（`workflow_dispatch`）。

#### 本機預覽套件

```bash
bash scripts/prepare-azure-static.sh
# 用靜態伺服器預覽 swa-output/，例如：
# npx --yes serve swa-output
```

#### 自訂網域與 HTTPS

在 Azure 靜態 Web 應用程式 → **自訂網域** 依精靈設定 DNS（CNAME）。

#### 注意

- `swa-output/` 由腳本生成，已列入 `.gitignore`，請勿手動提交。
- 若尚未設定 `AZURE_STATIC_WEB_APPS_API_TOKEN`，部署步驟會失敗；補上 secret 後重新執行 workflow 即可。

### 傳統 Web 服務器

1. **上傳文件**
   - 使用 FTP/SFTP 將 `dist` 文件夾內容上傳到服務器
   - 保持文件夾結構不變

2. **確保路徑正確**
   - 所有路徑都是相對路徑（`./css/`, `./img/`）
   - 確保 `cv.html` 在根目錄或適當位置

3. **訪問網站**
   - 訪問：`https://yourdomain.com/cv.html`
   - 或設置為默認 index：將 `cv.html` 重命名為 `index.html`

## 📋 部署前檢查清單

- [ ] `dist` 文件夾包含所有必要文件
- [ ] CSS 文件在 `dist/css/` 目錄
- [ ] 圖片文件在 `dist/img/` 目錄
- [ ] `cv.html` 使用相對路徑（`./css/`, `./img/`）
- [ ] 測試本地打開 `dist/cv.html` 是否正常顯示
- [ ] GitHub Actions workflow 已更新
- [ ] GitHub Pages 設置已配置

## 🔧 故障排除

### GitHub Pages 顯示 404
- 檢查 GitHub Pages 設置是否選擇了正確的源（GitHub Actions）
- 確認 workflow 文件在 `.github/workflows/` 目錄
- 檢查 Actions 標籤頁是否有錯誤

### 資源文件無法加載
- 確認文件路徑使用相對路徑（`./css/`, `./img/`）
- 檢查文件夾結構是否正確
- 確認所有文件都已提交到 git

### 部署後樣式丟失
- 檢查 CSS 文件是否在正確位置
- 確認瀏覽器控制台是否有 404 錯誤
- 清除瀏覽器緩存後重試

## 📝 快速部署命令

```bash
# 1. 確保 dist 文件夾存在並包含所有文件
mkdir -p dist/css dist/img
cp cv.html dist/
cp css/*.css dist/css/
cp img/*.svg dist/img/
cp public/favicon.ico dist/ 2>/dev/null || true

# 2. 提交並推送
git add dist/ .github/workflows/deploy.yml
git commit -m "Prepare for deployment"
git push origin main

# 3. 等待 GitHub Actions 完成部署
# 4. 訪問 https://ke22.github.io/cv/
```
