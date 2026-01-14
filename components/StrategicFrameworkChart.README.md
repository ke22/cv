# 策略思維框架圖組件使用說明

## 🎯 功能特色

### ✅ 已實作功能

1. **滾動觸發動畫**
   - 使用 GSAP ScrollTrigger 偵測滾動位置
   - 當圖表進入視圖時自動播放動畫
   - 節點依次出現（stagger animation）

2. **高亮路徑**
   - 點擊節點自動高亮相關連線
   - 滑鼠懸停預覽高亮效果
   - 再次點擊取消選擇

3. **響應式布局**
   - 自動偵測螢幕大小（< 768px 為手機）
   - 動態調整節點位置和大小
   - 優化手機版顯示

4. **互動功能**
   - 可拖曳圖表（roam）
   - 可縮放圖表
   - 點擊節點查看詳情
   - 滑鼠懸停顯示提示

---

## 📊 圖表結構

### 節點（Nodes）

- **現狀 (As-is)**: 綠色，左下角
- **差距 (Gap)**: 橙色，中左
- **期望目標 (To-Be)**: 綠色，左上
- **關鍵路徑 (Path)**: 綠色，中左下方
- **價值觀 (Value)**: 綠色，右上
- **使命 (Mission)**: 綠色，右上中
- **願景 (Vision)**: 綠色，右上下

### 連線（Links）

- **主流程**: As-is → Gap → To-Be → Path → As-is（循環）
- **連接**: To-Be → Vision
- **集群**: Value ↔ Mission ↔ Vision

---

## 🎨 自訂選項

### 修改節點顏色

在 `components/StrategicFrameworkChart.tsx` 中：

```tsx
const nodes: NodeData[] = [
  { 
    name: 'as-is', 
    color: '#4CAF50',  // 改這裡
    // ...
  }
]
```

### 調整動畫速度

```tsx
animationDelay: (idx: number) => idx * 150  // 改這裡：延遲時間（毫秒）
```

### 修改觸發位置

```tsx
ScrollTrigger.create({
  trigger: containerRef.current,
  start: 'top 80%',  // 改這裡：觸發位置
  // ...
})
```

### 調整節點大小

```tsx
symbolSize: isActive 
  ? (isMobile ? 90 : 110)  // 活動節點大小
  : (isMobile ? 60 : 80)   // 一般節點大小
```

---

## 🔧 進階自訂

### 加入新節點

```tsx
const nodes: NodeData[] = [
  // ... 現有節點
  {
    name: 'new-node',
    label: '新節點\nNew Node',
    x: 400,
    y: 200,
    color: '#2563eb',
    description: '節點說明'
  }
]
```

### 加入新連線

```tsx
const links = [
  // ... 現有連線
  {
    source: 'to-be',
    target: 'new-node',
    type: 'main',
    curveness: 0.2  // 曲線程度（0-1）
  }
]
```

### 自訂動畫效果

```tsx
// 在 chartOption 中
animation: isVisible,
animationDuration: 1500,      // 動畫持續時間
animationEasing: 'cubicOut',  // 緩動函數
animationDelay: (idx: number) => idx * 150
```

可用的緩動函數：
- `'linear'` - 線性
- `'quadraticIn'` - 二次方慢入
- `'quadraticOut'` - 二次方慢出
- `'cubicIn'` - 三次方慢入
- `'cubicOut'` - 三次方慢出
- `'elasticOut'` - 彈性效果

---

## 🎯 使用範例

### 基本使用

組件已整合到 `GapSection.tsx`，會自動顯示。

### 獨立使用

```tsx
import StrategicFrameworkChart from '@/components/StrategicFrameworkChart'

export default function MyPage() {
  return (
    <div>
      <StrategicFrameworkChart />
    </div>
  )
}
```

### 與其他組件整合

```tsx
import StrategicFrameworkChart from '@/components/StrategicFrameworkChart'
import { motion } from 'framer-motion'

export default function CustomSection() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
    >
      <StrategicFrameworkChart />
    </motion.section>
  )
}
```

---

## 🐛 常見問題

### Q: 圖表不顯示？
A: 確保：
1. 容器有明確的高度
2. ECharts 已正確安裝
3. 檢查瀏覽器控制台錯誤

### Q: 動畫不觸發？
A: 檢查：
1. ScrollTrigger 是否正確註冊
2. `containerRef` 是否正確綁定
3. 滾動位置是否達到觸發點

### Q: 響應式不工作？
A: 確保：
1. `window` 物件可用（客戶端渲染）
2. resize 事件監聽器正確設置
3. 使用 `useEffect` 處理響應式邏輯

### Q: 點擊無反應？
A: 檢查：
1. `onEvents` 是否正確設置
2. 節點 `name` 是否唯一
3. 控制台是否有錯誤訊息

---

## 📈 效能優化

### 已實作的優化

1. ✅ 使用 `useMemo` 快取配置
2. ✅ 條件渲染動畫
3. ✅ 響應式檢測優化
4. ✅ 清理事件監聽器

### 進一步優化建議

```tsx
// 使用 React.memo 避免重複渲染
export default React.memo(StrategicFrameworkChart)

// 延遲載入
const StrategicFrameworkChart = dynamic(
  () => import('./StrategicFrameworkChart'),
  { ssr: false }
)
```

---

## 🎨 樣式自訂

### 修改背景色

```tsx
<div className="w-full bg-base-light p-4 md:p-6 rounded-xl">
  {/* 改 bg-base-light 為其他顏色 */}
</div>
```

### 修改節點說明卡片

```tsx
<motion.div
  className="mt-4 p-4 bg-base rounded-lg border-l-4 border-accent"
  // 修改 className 自訂樣式
>
```

---

## 📚 相關資源

- [ECharts Graph 文件](https://echarts.apache.org/zh/option.html#series-graph)
- [GSAP ScrollTrigger 文件](https://greensock.com/docs/v3/Plugins/ScrollTrigger)
- [Framer Motion 文件](https://www.framer.com/motion/)

---

**組件已完全整合，可直接使用！** 🎉
