# Next.js 版本 - AI 核心流程化

這是使用 **Next.js + Tailwind CSS** 建立的版本，完全匹配 RealFood.gov 的技術棧。

## 🚀 技術棧

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Animations**: Framer Motion (已安裝，可選用)
- **Charts**: ECharts (已安裝，可選用)
- **Deployment**: Vercel (推薦) 或 GitHub Pages

## 📦 安裝

```bash
# 安裝依賴
npm install

# 開發模式
npm run dev

# 建置生產版本
npm run build

# 啟動生產伺服器
npm start
```

訪問 [http://localhost:3000](http://localhost:3000) 查看網站。

## 📁 專案結構

```
/
├── app/
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 首頁
│   └── globals.css         # 全域樣式
├── components/
│   ├── Navbar.tsx          # 導航欄
│   ├── Hero.tsx            # Hero 區塊
│   ├── GapSection.tsx      # 差距分析區塊
│   ├── PortfolioSection.tsx # 成長布局區塊
│   ├── ExecutionSection.tsx # 執行方法區塊
│   ├── LeadershipSection.tsx # 領導能力區塊
│   ├── MetricsSection.tsx  # 指標與資源區塊
│   ├── Footer.tsx          # 頁尾
│   └── FixedCTA.tsx        # 固定 CTA 按鈕
├── tailwind.config.js      # Tailwind 配置
├── next.config.js          # Next.js 配置
└── package.json            # 依賴管理
```

## 🎨 自訂

### 修改顏色

編輯 `tailwind.config.js`:

```javascript
colors: {
  primary: '#1a1a1a',      // 主要顏色
  accent: '#2d5016',        // 強調色
  track: {
    a: '#2563eb',           // 主線 A 顏色
    b: '#7c3aed',           // 主線 B 顏色
  },
}
```

### 修改內容

編輯各組件檔案（`components/*.tsx`）中的文字內容。

### 加入圖表

使用已安裝的 ECharts:

```tsx
import ReactECharts from 'echarts-for-react'

// 在組件中使用
<ReactECharts option={chartOption} />
```

## 🚢 部署

### Vercel (推薦)

1. Push 到 GitHub
2. 在 [Vercel](https://vercel.com) 連接 repo
3. 自動部署完成

### GitHub Pages

```bash
npm run build
# 使用 next export 或設定 GitHub Actions
```

## 📝 與原版差異

- ✅ 使用 Next.js (React 框架)
- ✅ 使用 Tailwind CSS (而非自訂 CSS)
- ✅ TypeScript 支援
- ✅ 組件化架構
- ✅ 更好的 SEO 支援
- ✅ 自動程式碼分割
- ✅ 更快的載入速度

## 🔄 從原版遷移

原版的 HTML/CSS/JS 檔案保留在根目錄，可以參考對照。

## 📚 下一步

- [ ] 整合 ECharts 圖表
- [ ] 加入 Framer Motion 動畫
- [ ] 整合 HeroUI 組件庫
- [ ] 加入內容管理系統 (CMS)
- [ ] 設定分析工具
