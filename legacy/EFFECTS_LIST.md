# 所有特效列表 (All Effects List)

## 📊 總覽
本專案實現了完整的 Scrollytelling（滾動敘事）動畫系統，所有動畫都使用 Scroll Scrub 模式（滾動驅動，非時間驅動）。

---

## 🎬 主要區塊特效

### 1. **Hero Section (開場區塊)**
**位置**: `#intro` / `.scroll-container--intro`
**函數**: `initHero()`

#### 特效列表：
- ✅ **標題淡入 + 視差** (Title Fade In + Parallax)
  - 進度: 0-20% 淡入
  - 20% 之後: 視差向上移動 (-50px)
  
- ✅ **描述淡入 + 視差** (Description Fade In + Parallax)
  - 進度: 25-45% 淡入
  - 45% 之後: 視差向上移動 (-40px)
  
- ✅ **CTA 按鈕淡入 + 視差** (CTA Fade In + Parallax)
  - 進度: 50-70% 淡入
  - 70% 之後: 視差向上移動 (-30px)

---

### 2. **Flip Cards (翻轉卡片)**
**位置**: `#cards` / `.scroll-container--cards`
**函數**: `initFlipCards()`

#### 特效列表：
- ✅ **卡片出現動畫** (Card Appear Animation)
  - 3 張卡片依序出現
  - 效果: `opacity` + `translateY` + `scale`
  - Card 1: 0-8% 出現
  - Card 2: 33.33-41.33% 出現
  - Card 3: 66.66-74.66% 出現

- ✅ **3D 翻轉動畫** (3D Flip Animation)
  - 使用 `rotateY` 實現 3D 翻轉
  - Card 1: 8-15% 翻轉 (0° → 180°)
  - Card 2: 41.33-48.33% 翻轉
  - Card 3: 74.66-81.66% 翻轉
  - 翻轉後顯示背面內容

- ✅ **累積顯示** (Cumulative Display)
  - 卡片翻轉完成後留在畫面上
  - 所有卡片最終同時可見

---

### 3. **Problem Section (現況區塊)**
**位置**: `#problem` / `.scroll-container--problem`
**函數**: `initProblem()`

#### 特效列表：
- ✅ **標題淡入** (Title Fade In)
  - 進度: 0-30% 淡入
  - 效果: `opacity` + `translateY`

- ✅ **副標題淡入** (Subtitle Fade In)
  - 進度: 40-70% 淡入
  - 效果: `opacity` + `translateY`

---

### 4. **Future Outlook (未來展望)**
**位置**: `#future-outlook` / `.scroll-container--future-outlook`
**函數**: `initFutureOutlook()`

#### 特效列表：
- ✅ **標題序列切換** (Title Sequential Switch)
  - Title A: 0-25% 顯示（淡入/淡出）
  - Title B: 25-50% 顯示（淡入/淡出）
  - Title C: 50-75% 顯示（淡入/淡出）
  - 效果: `opacity` + `translateY`

- ✅ **圓圈堆疊動畫** (Circle Stack Animation)
  - Small Circle: 0-25% 從右下角滑入
  - Medium Circle: 25-50% 從右下角滑入
  - Large Circle: 50-75% 從右下角滑入
  - 效果: `opacity` + `translate` (累積顯示，不消失)

- ✅ **同心圓縮放** (Concentric Zoom-Out)
  - 進度: 75-100%
  - 三個圓圈從右下角依序放大
  - 效果: `scale` + `opacity` (淡出)
  - Staggered timing: Large → Medium → Small

- ✅ **自動跳轉** (Auto-advance)
  - 98% 時自動滾動到 Solution section

---

### 5. **Solution Section (策略區塊)**
**位置**: `#solution`
**函數**: `initSolution()`

#### Stage 1: Solution Text
**位置**: `.scroll-container--solution-text`

- ✅ **文字淡入** (Text Fade In)
  - 進度: 0-25% 淡入
  - 效果: `opacity` + `translateY`

- ✅ **字符依次出現** (Character Sequential Reveal)
  - 進度: 10-60% (每個字符依序)
  - 效果: `opacity` + `translateY` (打字機效果)

#### Stage 2: Solution Matrix
**位置**: `.scroll-container--solution-matrix`

- ✅ **視覺滑入** (Visual Slide In)
  - 進度: 0-10% 從左側滑入
  - 效果: `opacity` + `translateX`

- ✅ **項目滑入** (Items Slide In)
  - 進度: 0-10% 從右側滑入
  - 效果: `opacity` + `translateX`

- ✅ **H1/H2/H3 即時高亮** (Instant Highlight)
  - H1: 20-43% 高亮（即時切換，無動畫）
  - H1+H2: 43-66% 高亮
  - H1+H2+H3: 66-90% 高亮
  - 效果: `clip-path` + `opacity` (SVG 彩色版本)
  - 效果: `opacity` + `color` (圖標和文字)

#### Stage 3: Resource Fit Matrix
**位置**: `.scroll-container--solution-resource-fit`

- ✅ **標題滑入** (Title Slide In)
  - 進度: 0-25% 從右側滑入
  - 效果: `opacity` + `translateX`

- ✅ **視覺滑入** (Visual Slide In)
  - 進度: 30-60% 從左側滑入
  - 效果: `opacity` + `translateX`

#### Stage 4: Opportunity Matrix
**位置**: `.scroll-container--solution-opportunity`

- ✅ **標題滑入** (Title Slide In)
  - 進度: 0-25% 從右側滑入
  - 效果: `opacity` + `translateX`

- ✅ **視覺滑入** (Visual Slide In)
  - 進度: 30-60% 從左側滑入
  - 效果: `opacity` + `translateX`

- ✅ **高亮縮放** (Highlight Scale)
  - 進度: 65-90% 縮放動畫
  - 效果: `opacity` + `scale`

---

### 6. **Growth Section (成長區塊)**
**位置**: `#growth` / `.scroll-container--growth`
**函數**: `initGrowth()`

#### 特效列表：
- ✅ **標題淡入** (Title Fade In)
  - 進度: 0-25% 淡入
  - 效果: `opacity` + `translateY`

- ✅ **SVG 淡入 + 縮放** (SVG Fade In + Scale)
  - 進度: 30-65% 淡入
  - 效果: `opacity` + `translateY` + `scale`

---

### 7. **Strategy Section (策略區塊)**
**位置**: `#strategy` / `.scroll-container--strategy`
**函數**: `initStrategy()`

#### 特效列表：
- ✅ **標題淡入** (Heading Fade In)
  - 進度: 0-25% 淡入
  - 效果: `opacity` + `translateY`

- ✅ **SVG 淡入 + 縮放** (SVG Fade In + Scale)
  - 進度: 30-65% 淡入
  - 效果: `opacity` + `translateY` + `scale`

---

### 8. **Resources Section (資源區塊)**
**位置**: `#resources` / `.scroll-container--resources`
**函數**: `initResources()`

#### 特效列表：
- ✅ **標題淡入** (Heading Fade In)
  - 進度: 0-15% 淡入
  - 效果: `opacity` + `translateY`

- ✅ **書籍依序出現** (Books Sequential Reveal)
  - Book 1: 10-25% 淡入 + 旋轉
  - Book 2: 30-45% 淡入 + 旋轉
  - Book 3: 50-65% 淡入 + 旋轉
  - 效果: `opacity` + `translateY` + `rotate`

- ✅ **連結依序出現** (Links Sequential Reveal)
  - Link 1: 10-25% 從左側滑入
  - Link 2: 30-45% 從左側滑入
  - Link 3: 50-65% 從左側滑入
  - 效果: `opacity` + `translateX`

- ✅ **連結高亮狀態** (Link Highlight State)
  - 當前階段的連結會高亮
  - 效果: `border-left-width` + `border-left-color` + `background`

---

## 🛠️ 通用特效

### 9. **Progress Bar (進度條)**
**位置**: `.progress-bar`
**函數**: `updateProgressBar()`

- ✅ **全局滾動進度** (Global Scroll Progress)
  - 顯示整個頁面的滾動進度
  - 效果: `transform: scaleX(progress)`

---

### 10. **Navigation (導覽)**
**函數**: `initNavigation()`

- ✅ **導覽點高亮** (Navigation Dot Highlight)
  - 根據當前滾動位置自動高亮對應的導覽點
  - 效果: `classList.toggle('active')`

---

### 11. **Debug Monitor (調試監控)**
**位置**: `#debug-monitor`
**函數**: `initDebugMonitor()`, `updateDebugMonitor()`

- ✅ **全局滾動信息** (Global Scroll Info)
  - 顯示當前滾動位置、視口高度、文檔高度、全局進度

- ✅ **區塊進度監控** (Section Progress Monitor)
  - 顯示每個區塊的滾動進度（0-1）
  - 視覺化進度條

- ✅ **觸發點監控** (Trigger Points Monitor)
  - 顯示每個區塊的進入/退出狀態
  - Pending / Active / Exited 狀態

---

## 🎨 動畫技術細節

### 使用的動畫技術：
1. **Scroll Scrub**: 所有動畫都綁定到滾動進度，非時間驅動
2. **setProperty with important**: 使用 `setProperty` 並設置 `important` 標誌，確保覆蓋 CSS `!important` 規則
3. **requestAnimationFrame**: 使用 rAF 優化性能
4. **IntersectionObserver**: 用於檢測元素進入視口（在 calculateProgress 中）

### 動畫類型：
- ✅ **Fade In/Out** (淡入/淡出): `opacity`
- ✅ **Slide In** (滑入): `translateX` / `translateY`
- ✅ **Parallax** (視差): `translateY` (不同速度)
- ✅ **Scale** (縮放): `scale`
- ✅ **3D Rotate** (3D 旋轉): `rotateY`
- ✅ **Clip Path** (裁剪路徑): `clip-path` (SVG 高亮)
- ✅ **Color Change** (顏色變化): `color`

---

## 📝 特效統計

- **總區塊數**: 8 個主要區塊
- **總特效數**: 30+ 個獨立動畫效果
- **動畫模式**: Scroll Scrub (滾動驅動)
- **性能優化**: requestAnimationFrame + setProperty with important

---

## 🔧 調試工具

- **Debug Monitor**: 按 `D` 鍵或點擊 🔍 按鈕開啟
- **Console Logs**: 每個區塊都有詳細的初始化日誌
- **Progress Tracking**: 實時顯示每個區塊的滾動進度

---

**最後更新**: 2024-01-15
**版本**: 1.0.0
