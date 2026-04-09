# 圖表與圖形組件總覽

## 📊 已建立的圖表組件

### 1. ThreeHorizonsPortfolioChart.tsx
**三重地平線的事業組合規劃圖**
- ✅ 2x2 矩陣圖（資源適配優先度 vs 機會選擇優先度）
- ✅ H1/H2/H3 節點標記
- ✅ 成長布局選擇箭頭
- ✅ 圖例說明
- ✅ 滾動觸發動畫

**位置**: `components/PortfolioSection.tsx`

---

### 2. SelectionMatrixChart.tsx
**三重地平線選擇布局矩陣圖**
- ✅ 機會選擇矩陣（市場潛力 vs 進入難度）
- ✅ 資源適配矩陣（內部綜效 vs 資源需求）
- ✅ 象限標號（1-4）
- ✅ 成長布局選擇箭頭
- ✅ 響應式布局

**位置**: `components/PortfolioSection.tsx`

---

### 3. ThreeHorizonsGrowthChart.tsx
**三重地平線的成長策略規劃概念圖**
- ✅ 時間軸上的三條 S 型成長曲線
- ✅ H1: 既有核心（先上升後下降）
- ✅ H2: 新興事業（持續上升）
- ✅ H3: 未來機會（初始上升）
- ✅ 策略說明框
- ✅ 垂直分隔線

**位置**: `components/PortfolioSection.tsx`

---

### 4. FivePLeadershipChart.tsx
**發展領導力的 5P 架構圖**
- ✅ 圍繞中心人物的流程圖
- ✅ Purpose → Vision → Path/Pinnacle → Align/Motivate → Priority/People
- ✅ 互動式節點（點擊高亮）
- ✅ 連線動畫
- ✅ 可拖曳和縮放

**位置**: `components/LeadershipSection.tsx`

---

### 5. SPTSiFlowChart.tsx
**SPTSi 架構流程圖**
- ✅ Strategic Choice → Key Path → Tactical Action → Success Indicator
- ✅ Key Path 分支（S 產品 → P1/P2/P3）
- ✅ P 到 T 的連線
- ✅ T 到 Si 的詳細指標
- ✅ 互動式節點
- ✅ 完整流程可視化

**位置**: `components/ExecutionSection.tsx`

---

### 6. StrategicFrameworkChart.tsx（之前建立）
**發展策略思維的三要素架構圖**
- ✅ As-is → Gap → To-Be → Path 循環
- ✅ Value/Mission/Vision 集群
- ✅ 互動式節點
- ✅ 高亮路徑
- ✅ 響應式布局

**位置**: `components/GapSection.tsx`

---

## 🎨 圖表特色

### 共同功能
- ✅ 滾動觸發動畫（GSAP ScrollTrigger）
- ✅ 響應式設計（自動適應手機/桌面）
- ✅ 互動式節點（點擊/懸停）
- ✅ Framer Motion 動畫
- ✅ ECharts SVG 渲染

### 個別特色
- **矩陣圖**: 象限標號、箭頭指示
- **流程圖**: 節點連線、分支結構
- **成長曲線**: S 型曲線、面積填充
- **關係圖**: 中心節點、多層結構

---

## 📁 檔案結構

```
components/
├── ThreeHorizonsPortfolioChart.tsx    ✅ 事業組合規劃
├── SelectionMatrixChart.tsx           ✅ 選擇布局矩陣
├── ThreeHorizonsGrowthChart.tsx       ✅ 成長策略規劃
├── FivePLeadershipChart.tsx           ✅ 5P 領導力架構
├── SPTSiFlowChart.tsx                 ✅ SPTSi 流程圖
└── StrategicFrameworkChart.tsx       ✅ 策略思維架構
```

---

## 🔧 使用方式

### 獨立使用

```tsx
import ThreeHorizonsPortfolioChart from '@/components/ThreeHorizonsPortfolioChart'

export default function MyPage() {
  return (
    <div>
      <ThreeHorizonsPortfolioChart />
    </div>
  )
}
```

### 已整合的位置

- **PortfolioSection**: 
  - ThreeHorizonsPortfolioChart
  - SelectionMatrixChart
  - ThreeHorizonsGrowthChart

- **LeadershipSection**: 
  - FivePLeadershipChart

- **ExecutionSection**: 
  - SPTSiFlowChart

- **GapSection**: 
  - StrategicFrameworkChart

---

## 🎯 自訂選項

### 修改顏色

```tsx
// 在組件中修改
itemStyle: {
  color: '#4CAF50',  // 改這裡
}
```

### 調整動畫速度

```tsx
animationDuration: 1500,  // 改這裡（毫秒）
```

### 修改節點大小

```tsx
symbolSize: 80,  // 改這裡
```

### 調整布局

```tsx
// 在 chartOption 中修改
grid: {
  left: '10%',
  right: '10%',
  // ...
}
```

---

## 📊 圖表類型對照

| 圖表名稱 | 類型 | 技術 |
|---------|------|------|
| ThreeHorizonsPortfolioChart | 散點圖 + 矩陣 | ECharts Scatter |
| SelectionMatrixChart | 雙矩陣圖 | ECharts Scatter |
| ThreeHorizonsGrowthChart | 折線圖 + 面積 | ECharts Line |
| FivePLeadershipChart | 關係圖 | ECharts Graph |
| SPTSiFlowChart | 流程圖 | ECharts Graph |
| StrategicFrameworkChart | 關係圖 | ECharts Graph |

---

## 🚀 測試方式

1. **啟動開發伺服器**
   ```bash
   npm run dev
   ```

2. **訪問頁面**
   - http://localhost:3000

3. **測試功能**
   - 滾動到對應 section
   - 點擊圖表節點
   - 測試響應式布局（調整視窗大小）

---

## 🐛 常見問題

### Q: 圖表不顯示？
A: 確保：
1. ECharts 已正確安裝
2. 容器有明確高度
3. 檢查瀏覽器控制台錯誤

### Q: 動畫不觸發？
A: 檢查：
1. ScrollTrigger 是否註冊
2. 滾動位置是否達到觸發點
3. `isVisible` 狀態是否正確

### Q: 響應式不工作？
A: 確保：
1. `window` 物件可用（客戶端渲染）
2. resize 事件監聽器正確設置

---

## 📚 相關資源

- [ECharts 文件](https://echarts.apache.org/)
- [GSAP ScrollTrigger](https://greensock.com/docs/v3/Plugins/ScrollTrigger)
- [Framer Motion](https://www.framer.com/motion/)

---

**所有圖表已建立並整合完成！** 🎉
