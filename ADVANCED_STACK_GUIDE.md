# 進階技術棧使用指南

## 🚀 已整合的技術

### 1. GSAP ScrollTrigger
- **用途**: 滾動觸發動畫、元素固定、進度追蹤
- **檔案**: `lib/gsap-scrolltrigger.ts`
- **使用範例**: 見 `components/GapSection.tsx`

### 2. Framer Motion
- **用途**: React 動畫、手勢、布局動畫
- **已安裝**: ✅
- **使用範例**: 所有組件都有使用

### 3. ECharts + D3.js
- **用途**: 資料視覺化、圖表、互動式圖形
- **ECharts**: 用於 Three Horizons 圖表
- **D3.js**: 用於 Priority Matrix 視覺化
- **使用範例**: 見 `components/PortfolioSection.tsx`

### 4. Locomotive Scroll
- **用途**: 平滑滾動、視差效果
- **檔案**: `lib/locomotive-scroll.ts`
- **Provider**: `components/SmoothScrollProvider.tsx`

---

## 📦 安裝依賴

```bash
npm install
```

這會安裝：
- `gsap` - GSAP 動畫庫
- `d3` - D3.js 視覺化庫
- `locomotive-scroll` - 平滑滾動庫

---

## 🎨 使用範例

### GSAP ScrollTrigger

```tsx
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// 註冊插件
gsap.registerPlugin(ScrollTrigger)

// 創建滾動動畫
gsap.from('.element', {
  opacity: 0,
  y: 50,
  scrollTrigger: {
    trigger: '.element',
    start: 'top 80%',
    toggleActions: 'play none none reverse',
  },
})

// 固定元素
ScrollTrigger.create({
  trigger: '.element',
  pin: true,
  start: 'top top',
})
```

### Framer Motion

```tsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
  內容
</motion.div>
```

### ECharts

```tsx
import ReactECharts from 'echarts-for-react'

<ReactECharts
  option={chartOption}
  style={{ height: '400px' }}
/>
```

### D3.js

```tsx
import * as d3 from 'd3'

const svg = d3.select(svgRef.current)
svg.append('circle')
  .attr('cx', 50)
  .attr('cy', 50)
  .attr('r', 20)
```

### Locomotive Scroll

已在 `SmoothScrollProvider` 中自動初始化，所有組件自動支援平滑滾動。

---

## 🔧 組件更新

### 已更新的組件

1. **GapSection.tsx**
   - ✅ GSAP ScrollTrigger 用於步驟高亮
   - ✅ Framer Motion 用於進入動畫

2. **PortfolioSection.tsx**
   - ✅ ECharts 用於 Three Horizons 圖表
   - ✅ D3.js 用於 Priority Matrix
   - ✅ GSAP ScrollTrigger 用於視圖動畫

3. **ExecutionSection.tsx**
   - ✅ GSAP ScrollTrigger 用於固定效果
   - ✅ Framer Motion 用於互動動畫

---

## 🎯 最佳實踐

### 1. 效能優化

```tsx
// ✅ 正確：清理 ScrollTrigger
useEffect(() => {
  // ... 創建 triggers
  return () => {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
  }
}, [])
```

### 2. 響應式設計

```tsx
// 使用 Framer Motion 的 viewport
<motion.div
  whileInView={{ opacity: 1 }}
  viewport={{ once: true, margin: '-100px' }}
>
```

### 3. 動畫時機

- **進入視圖**: 使用 `whileInView`
- **滾動觸發**: 使用 GSAP ScrollTrigger
- **互動**: 使用 `whileHover`, `whileTap`

---

## 🐛 常見問題

### Q: ScrollTrigger 不工作？
A: 確保已註冊插件：
```tsx
gsap.registerPlugin(ScrollTrigger)
```

### Q: Locomotive Scroll 與 ScrollTrigger 衝突？
A: 已在 `SmoothScrollProvider` 中處理，ScrollTrigger 會在 Locomotive Scroll 更新時同步。

### Q: ECharts 圖表不顯示？
A: 確保容器有明確的高度：
```tsx
<ReactECharts style={{ height: '400px' }} />
```

---

## 📚 參考資源

- [GSAP ScrollTrigger 文件](https://greensock.com/docs/v3/Plugins/ScrollTrigger)
- [Framer Motion 文件](https://www.framer.com/motion/)
- [ECharts 文件](https://echarts.apache.org/)
- [D3.js 文件](https://d3js.org/)
- [Locomotive Scroll 文件](https://github.com/locomotivemtl/locomotive-scroll)

---

## 🚀 下一步

1. 自訂動畫參數
2. 加入更多圖表類型
3. 優化效能
4. 加入更多互動效果
