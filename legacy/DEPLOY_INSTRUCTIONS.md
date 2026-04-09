# 🚀 部署指令

## 步驟 1: 推送到 GitHub

```bash
git push origin main
```

## 步驟 2: 在 GitHub 上啟用 Pages

1. **前往倉庫設置**
   - 打開：https://github.com/ke22/cv
   - 點擊 **Settings** 標籤

2. **啟用 GitHub Pages**
   - 在左側選單找到 **Pages**
   - 在 **Source** 部分選擇：**GitHub Actions**
   - 點擊 **Save**

3. **等待部署**
   - 前往 **Actions** 標籤頁
   - 查看 "Deploy to GitHub Pages" workflow
   - 等待部署完成（通常 1-2 分鐘）

## 步驟 3: 訪問網站

部署完成後，訪問：
**https://ke22.github.io/cv/**

---

## ✅ 部署檢查清單

- [x] `dist` 文件夾已創建並包含所有文件
- [x] GitHub Actions workflow 已配置
- [ ] 代碼已推送到 GitHub
- [ ] GitHub Pages 已啟用（選擇 GitHub Actions）
- [ ] 部署 workflow 已成功運行
- [ ] 網站可以正常訪問

---

## 🔍 驗證部署

部署完成後，檢查：
- ✅ 網站可以訪問
- ✅ CSS 樣式正確加載
- ✅ 圖片正常顯示
- ✅ 動畫效果正常運行

---

## 📝 注意事項

- 首次部署可能需要幾分鐘
- 如果看到 404，等待幾分鐘後重試
- 確保 GitHub Pages 設置中選擇了 **GitHub Actions** 作為源
