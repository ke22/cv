# 🚀 快速開始指南

## Next.js 版本（匹配 RealFood.gov）

### 第一步：安裝依賴

```bash
npm install
```

### 第二步：啟動開發伺服器

```bash
npm run dev
```

訪問 [http://localhost:3000](http://localhost:3000)

### 第三步：建置生產版本

```bash
npm run build
npm start
```

## 📋 專案結構說明

```
/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 根布局（設定 metadata）
│   ├── page.tsx           # 首頁（組合所有組件）
│   └── globals.css        # 全域 Tailwind 樣式
│
├── components/            # React 組件
│   ├── Navbar.tsx         # 導航欄（固定、滾動效果）
│   ├── Hero.tsx           # Hero 區塊（主線 A/B）
│   ├── GapSection.tsx     # 差距分析（滾動高亮）
│   ├── PortfolioSection.tsx # 成長布局（Three Horizons）
│   ├── ExecutionSection.tsx # 執行方法（SPTSi）
│   ├── LeadershipSection.tsx # 領導能力（5P）
│   ├── MetricsSection.tsx # 指標與資源
│   ├── Footer.tsx         # 頁尾
│   └── FixedCTA.tsx       # 固定 CTA 按鈕
│
├── tailwind.config.js     # Tailwind 配置（顏色、字體等）
├── next.config.js         # Next.js 配置
└── package.json           # 依賴管理
```

## 🎨 自訂指南

### 修改顏色

編輯 `tailwind.config.js`:

```javascript
colors: {
  primary: '#1a1a1a',    // 改這裡
  accent: '#2d5016',      // 改這裡
}
```

### 修改內容

直接編輯 `components/*.tsx` 檔案中的文字。

### 加入動畫

使用已安裝的 Framer Motion:

{% raw %}
```tsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
>
  內容
</motion.div>
```
{% endraw %}

### 加入圖表

使用已安裝的 ECharts:

{% raw %}
```tsx
import ReactECharts from 'echarts-for-react'

<ReactECharts option={{
  xAxis: { type: 'category', data: ['A', 'B'] },
  yAxis: { type: 'value' },
  series: [{ data: [1, 2], type: 'bar' }]
}} />
```
{% endraw %}

## 🚢 部署選項

### 選項 1: Vercel（推薦，最簡單）

1. Push 到 GitHub
2. 到 [vercel.com](https://vercel.com) 註冊
3. 點擊 "New Project"
4. 選擇你的 GitHub repo
5. 自動部署完成！

### 選項 2: GitHub Pages

需要設定 GitHub Actions，參考 `.github/workflows/deploy.yml`

### 選項 3: Netlify

類似 Vercel，連接 GitHub repo 即可。

## 🔄 與原版對照

| 功能 | 原版 (HTML/CSS/JS) | Next.js 版本 |
|------|-------------------|-------------|
| 檔案 | `index.html` | `app/page.tsx` |
| 樣式 | `styles.css` | `app/globals.css` + Tailwind |
| 互動 | `script.js` | React hooks + TypeScript |
| 組件 | 內嵌 HTML | `components/*.tsx` |

## ⚡ 效能優勢

- ✅ 自動程式碼分割
- ✅ 圖片優化
- ✅ 自動壓縮
- ✅ 更好的 SEO
- ✅ 更快的載入速度

## 🐛 常見問題

### Q: 如何修改導航連結？

A: 編輯 `components/Navbar.tsx` 中的 `navLinks` 陣列。

### Q: 如何改變滾動高亮速度？

A: 編輯各 Section 組件中的 `threshold` 和 `scrollProgress` 邏輯。

### Q: 如何加入新區塊？

A: 
1. 建立新組件 `components/NewSection.tsx`
2. 在 `app/page.tsx` 中引入並使用

### Q: TypeScript 錯誤？

A: 確保所有組件檔案使用 `.tsx` 副檔名，並正確匯入 React。

## 📚 下一步學習

- [Next.js 文件](https://nextjs.org/docs)
- [Tailwind CSS 文件](https://tailwindcss.com/docs)
- [React 文件](https://react.dev)
- [TypeScript 文件](https://www.typescriptlang.org/docs)

## 💡 提示

- 使用 `npm run dev` 時，修改檔案會自動重新載入
- 使用瀏覽器 DevTools 檢查 Tailwind 類別
- 使用 TypeScript 可以獲得更好的自動完成
