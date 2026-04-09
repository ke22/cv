# Design Guidelines

> 視覺規範、CSS tokens、元件規則

## 視覺規範來源

本專案沿用 `.cursor/context/design-system.md` 的規範，並與 `.cursorrules` 一致。

## CSS Tokens（摘要）

### cv-v2 靜態版（根目錄 `cv-v2.html`）
- **來源**：`css/base.css` 的 `:root`
- **變數**：`--space-*`、`--bg-*`、`--text-*`、`--radius-*`、`--shadow-*`、`--duration-*`、`--z-*` 等

### Next.js 版（已移至 `legacy/`：`legacy/app/`、`legacy/components/`）
- **來源**：`legacy/tailwind.config.js` 的 `theme.extend`（維護舊版時查）
- **變數**：`colors.primary`、`colors.accent`、`colors.base`、`colors.text`、`spacing` 等

### 共通規範
- **Breakpoints**：Mobile 320–767, Tablet 768–1023, Desktop 1024+
- **Typography**：System font stack, H1–H4 與 body 級距

## 元件規則

- **命名**：BEM 或語意化 class（如 `.hero-section`）
- **結構**：元件自包含、可重用
- **響應**：Mobile-first、CSS Grid / Flexbox
- **無障礙**：WCAG AA、aria、keyboard、focus visible

## 新增/變更元件時

1. 先查對應 token 來源（**cv-v2：`css/base.css`**；舊 Next：`legacy/tailwind.config.js`）是否有可重用 token
2. 遵守 spacing / color / typography 變數
3. 加上 hover / focus 狀態
4. 驗證 contrast 與 reduced-motion

---

*更新此檔：當設計 token、元件規範變動時。*
