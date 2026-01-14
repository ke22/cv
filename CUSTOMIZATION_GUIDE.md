# 自訂指南 / Customization Guide

## 📋 內容結構說明

這個網站基於 RealFood.gov 的設計風格，包含 7 個主要區塊：

### 1. Hero Section (任務目標)
- **位置**: `#mission`
- **內容**: 主線 A/B 的說明
- **修改**: 編輯 `index.html` 中的 `.hero-headline` 和 `.track-badges`

### 2. Gap Section (現況與差距)
- **位置**: `#gap`
- **內容**: As-Is → Gap → Path → To-Be
- **修改**: 編輯 `.text-block` 中的內容
- **互動**: 滾動時會自動高亮對應的步驟

### 3. Portfolio Section (成長布局)
- **位置**: `#portfolio`
- **內容**: Three Horizons (H1/H2/H3) + 優先矩陣
- **修改**: 編輯 `.horizon-block` 和 `.chosen-layout`
- **互動**: 滾動時會高亮對應的 Horizon

### 4. Execution Section (執行方法)
- **位置**: `#execution`
- **內容**: SPTSi 流程 (S/P/T/Si)
- **修改**: 編輯 `.sptsi-content` 中的內容
- **互動**: 滾動時會高亮對應的步驟

### 5. Leadership Section (領導能力)
- **位置**: `#leadership`
- **內容**: 5P 能力地圖
- **修改**: 編輯 `.five-p-content` 中的內容
- **互動**: 滑鼠懸停時會高亮

### 6. Metrics Section (指標與資源)
- **位置**: `#metrics`
- **內容**: Mission/Strategy/IDP + 資源連結
- **修改**: 編輯 `.metric-block` 和 `.resource-card`

## 🎨 設計自訂

### 顏色變更
編輯 `styles.css` 中的 CSS 變數：

```css
:root {
    --color-primary: #1a1a1a;      /* 主要顏色 */
    --color-accent: #2d5016;       /* 強調色 */
    --track-a: #2563eb;             /* 主線 A 顏色 */
    --track-b: #7c3aed;             /* 主線 B 顏色 */
}
```

### 字體大小
修改 `.hero-headline` 和 `.section-title` 的 `font-size`

### 間距調整
修改 CSS 變數中的 spacing 值：
```css
--spacing-md: 2rem;  /* 調整這個值 */
```

## 📊 圖表整合 (未來)

目前圖表使用簡單的 HTML/CSS 視覺化。未來可以整合：

### ECharts 整合
1. 在 `<head>` 加入 ECharts CDN：
```html
<script src="https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js"></script>
```

2. 在 `script.js` 中初始化圖表：
```javascript
// Three Horizons Chart
const horizonsChart = echarts.init(document.getElementById('horizons-chart'));
horizonsChart.setOption({
    // 圖表配置
});
```

### Scrollama 整合 (進階滾動動畫)
1. 加入 Scrollama：
```html
<script src="https://unpkg.com/scrollama"></script>
```

2. 設定 scrollama：
```javascript
const scroller = scrollama();
scroller.setup({
    step: '.sptsi-step',
    offset: 0.5
}).onStepEnter(response => {
    // 高亮對應步驟
});
```

## 📝 內容編輯建議

### 每個區塊保持簡潔
- 每個滾動步驟 = 一個句子主張
- 每個 sticky chart = 一個高亮
- Track badge = A / B / Both (始終可見)

### 文字長度
- Hero headline: 1-2 句
- Section 內容: 每段 2-3 行
- 按鈕文字: 簡短明確

## 🔧 技術細節

### 滾動高亮機制
使用 `IntersectionObserver` API 偵測元素進入視窗，自動高亮對應的步驟。

### 響應式設計
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

### 效能優化
- 使用 CSS 變數減少重複
- 使用 `transform` 而非 `position` 做動畫
- 圖片使用適當格式和大小

## 📁 檔案結構

```
/
├── index.html          # 主要 HTML
├── styles.css          # 樣式表
├── script.js           # JavaScript 互動
├── content/
│   └── steps.json      # 內容資料 (可選)
└── CUSTOMIZATION_GUIDE.md  # 本檔案
```

## 🚀 下一步

1. **自訂內容**: 編輯 `index.html` 中的文字
2. **調整顏色**: 修改 `styles.css` 中的變數
3. **加入圖表**: 整合 ECharts (參考上方說明)
4. **測試**: 在不同裝置上測試
5. **部署**: Push 到 GitHub 自動部署

## 💡 提示

- 保持 RealFood.gov 的簡潔風格
- 每個區塊一個核心概念
- 使用清晰的視覺層次
- 確保可訪問性 (accessibility)
