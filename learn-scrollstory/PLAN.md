# Learn Scrollstory — 精確可用的重現計畫

本文件供 Agent 或人類從零重現目前的 `learn-scrollstory` 網頁。包含程序化步驟與 vibe coding 描述。

---

## Part A：程序化計畫（一鍵不含部署）

### 目的與範圍

執行後得到與目前 `learn-scrollstory/` 相同的網頁；不含部署。

### 產出清單

| 項目 | 路徑 |
|------|------|
| 目錄 | `learn-scrollstory/` |
| HTML | `learn-scrollstory/index.html` |
| CSS | `learn-scrollstory/styles.css` |
| JS | `learn-scrollstory/script.js` |

### 執行步驟

1. **建立目錄**：在專案根目錄下建立 `learn-scrollstory/`。

2. **建立 `index.html`**：在同目錄下建立 `index.html`，內容見附錄 A。

3. **建立 `styles.css`**：在同目錄下建立 `styles.css`，內容見附錄 B。

4. **建立 `script.js`**：在同目錄下建立 `script.js`，內容見附錄 C。

5. **驗證**：本地開啟 `learn-scrollstory/index.html`（或 Live Server），確認：
   - 捲動時章節與右側 sticky 區塊聯動
   - 進度點（4 個 dot）隨當前章節高亮
   - Back to top 按鈕在捲動超過約一屏後出現，點擊可平滑回到頂部

### 檢查清單

- [ ] 目錄 `learn-scrollstory/` 已建立
- [ ] `index.html` 已建立且內容與附錄 A 一致
- [ ] `styles.css` 已建立且內容與附錄 B 一致
- [ ] `script.js` 已建立且內容與附錄 C 一致
- [ ] 本地預覽外觀與互動與現狀一致

---

## Part B：Vibe Coding 描述（AI 可解讀）

將以下描述交給 AI（如 Cursor Agent），可在空目錄下產出等效專案。

### 一句話

深色 scroll story 學習頁，有 sticky 視覺區與捲動章節聯動、Back to top；純 HTML/CSS/JS，無框架無 build。

### 視覺

- 深色背景 `#050816`，主色 `#38bdf8`，毛玻璃卡片，圓角 pill，radial gradient 景深
- 主文 `#e5e7eb`，次要文 `#9ca3af`

### 結構

- `header`（sticky nav）→ `hero`（eyebrow / title / subtitle / CTA）→ `story-layout`（`story-graphic` 左 + `story-steps` 右）→ `story-outro` → `footer`；`back-to-top` 固定右下

### 必要 class

`story-header`, `story-hero`, `story-layout`, `story-graphic`, `story-graphic__card`, `story-graphic__dot`, `story-step`, `story-step--active`, `back-to-top`, `back-to-top--visible`

### 必要 data / ID

`data-graphic-title`, `data-graphic-text`, `#chapter-1` ～ `#chapter-4`, `data-step="1"` ～ `4`

### 互動規格

- IntersectionObserver 監聽 `.story-step`，`threshold: 0.6`
- 當某章 `isIntersecting` 時，執行 activate：更新 graphic 標題/內文、對應 dot 加 `story-graphic__dot--active`、該章加 `story-step--active`
- Back to top：當 `scrollY > innerHeight * 0.85` 時加 `back-to-top--visible`；點擊時 `window.scrollTo({ top: 0, behavior: 'smooth' })`

### 響應式

- ≥768px：兩欄 grid，`story-graphic` 左、`story-steps` 右
- <768px：單欄，`story-graphic` 在上（`order: -1`）

### 排除

不用框架、不 build、不過度動畫

---

## Part C：技術規格速查

| 項目 | 值 |
|------|-----|
| IntersectionObserver threshold | 0.6 |
| Back to top 顯示條件 | `scrollY > innerHeight * 0.85` |
| 大螢幕斷點 | 768px |
| Grid 佈局 | `grid-template-columns: minmax(0, 1.1fr) minmax(0, 1.1fr)` |
| Sticky top | `calc(var(--space-xl) * 1.6)` |

---

## 附錄 A：index.html 完整內容

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Scrollstory Practice – Digital Story Page</title>
    <meta
      name="description"
      content="A simple practice project to learn digital storytelling and scroll-based interactions."
    />
    <link rel="stylesheet" href="./styles.css" />
  </head>
  <body>
    <header class="story-header">
      <nav class="story-header__nav">
        <div class="story-header__logo">Scrollstory Lab</div>
        <a href="#chapter-1" class="story-header__link">Start the story</a>
      </nav>
    </header>

    <main class="story-main">
      <section class="story-hero">
        <div class="story-hero__inner">
          <p class="story-hero__eyebrow">Practice project</p>
          <h1 class="story-hero__title">Learn digital storytelling by scrolling</h1>
          <p class="story-hero__subtitle">
            This page is a safe playground. Scroll down and watch how the story
            and visuals change together.
          </p>
          <a href="#chapter-1" class="story-hero__cta">Begin the scroll story</a>
        </div>
      </section>

      <section class="story-layout" aria-label="Learning scrollstory steps">
        <aside class="story-graphic" aria-hidden="true">
          <div class="story-graphic__card">
            <p class="story-graphic__label">Now showing</p>
            <h2 class="story-graphic__title" data-graphic-title>
              Your first scroll chapter
            </h2>
            <p class="story-graphic__text" data-graphic-text>
              As you scroll through each chapter on the right, this panel will
              update. This is a common pattern in digital stories.
            </p>
            <div class="story-graphic__progress" aria-hidden="true">
              <span class="story-graphic__dot story-graphic__dot--active"></span>
              <span class="story-graphic__dot"></span>
              <span class="story-graphic__dot"></span>
              <span class="story-graphic__dot"></span>
            </div>
          </div>
        </aside>

        <section class="story-steps" aria-label="Story chapters">
          <article
            id="chapter-1"
            class="story-step story-step--active"
            data-step="1"
          >
            <h2 class="story-step__title">Chapter 1 – Set the scene</h2>
            <p class="story-step__body">
              Great scrollstories always begin with context. In this chapter,
              you explain where we are, who is involved, and why the reader
              should care. Keep it short and visual.
            </p>
          </article>

          <article id="chapter-2" class="story-step" data-step="2">
            <h2 class="story-step__title">Chapter 2 – Introduce the change</h2>
            <p class="story-step__body">
              As the reader scrolls, introduce the main change or tension in
              your story. This could be a shift in data, a new strategy, or a
              surprising insight you discovered.
            </p>
          </article>

          <article id="chapter-3" class="story-step" data-step="3">
            <h2 class="story-step__title">Chapter 3 – Show the impact</h2>
            <p class="story-step__body">
              Use visuals to show how things evolve. In real projects, this
              could be charts, before/after comparisons, or animated diagrams
              that update as the reader continues scrolling.
            </p>
          </article>

          <article id="chapter-4" class="story-step" data-step="4">
            <h2 class="story-step__title">Chapter 4 – Land the takeaway</h2>
            <p class="story-step__body">
              Close with one clear message. What should the reader remember?
              What decision should be made? A strong ending makes your
              scrollstory feel intentional, not just decorative.
            </p>
          </article>
        </section>
      </section>

      <section class="story-outro">
        <div class="story-outro__inner">
          <h2 class="story-outro__title">Your next steps</h2>
          <p class="story-outro__body">
            This page is intentionally simple. Try editing the text, colors, and
            animations in the code. Then, experiment with adding your own data,
            images, and extra chapters to turn it into a real digital story.
          </p>
        </div>
      </section>
    </main>

    <button class="back-to-top" type="button">
      <span class="back-to-top__label">Back to top</span>
    </button>

    <footer class="story-footer">
      <p class="story-footer__text">
        Built as a learning sandbox inside your <code>cv_01</code> project.
        Open <code>learn-scrollstory/index.html</code> in the browser to play
        with it.
      </p>
    </footer>

    <script src="./script.js" defer></script>
  </body>
</html>
```

---

## 附錄 B：styles.css 完整內容

```css
:root {
  --color-bg: #050816;
  --color-surface: rgba(15, 23, 42, 0.96);
  --color-surface-soft: rgba(15, 23, 42, 0.8);
  --color-border-subtle: rgba(148, 163, 184, 0.18);
  --color-accent: #38bdf8;
  --color-accent-soft: rgba(56, 189, 248, 0.16);
  --color-text: #e5e7eb;
  --color-muted: #9ca3af;
  --shadow-soft: 0 20px 45px rgba(15, 23, 42, 0.7);
  --radius-lg: 24px;
  --radius-pill: 999px;
  --space-xs: 0.5rem;
  --space-sm: 0.75rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;
  --space-3xl: 4rem;
  --font-sans: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text",
    "Inter", sans-serif;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  scroll-behavior: smooth;
}

body {
  min-height: 100vh;
  font-family: var(--font-sans);
  color: var(--color-text);
  background:
    radial-gradient(circle at top, rgba(56, 189, 248, 0.14), transparent 55%),
    radial-gradient(circle at bottom, rgba(129, 140, 248, 0.22), transparent 60%),
    var(--color-bg);
}

img {
  max-width: 100%;
  display: block;
}

a {
  color: inherit;
  text-decoration: none;
}

.story-header {
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(20px);
  background: linear-gradient(
    to bottom,
    rgba(15, 23, 42, 0.9),
    rgba(15, 23, 42, 0.6),
    transparent
  );
}

.story-header__nav {
  max-width: 1100px;
  margin: 0 auto;
  padding: var(--space-md) var(--space-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
}

.story-header__logo {
  font-size: 0.9rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-muted);
}

.story-header__link {
  padding: 0.4rem 0.95rem;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border-subtle);
  background: radial-gradient(
    circle at top left,
    rgba(56, 189, 248, 0.35),
    transparent
  );
  font-size: 0.8rem;
  color: var(--color-text);
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  transition:
    border-color 160ms ease-out,
    box-shadow 160ms ease-out,
    transform 160ms ease-out,
    background 160ms ease-out;
}

.story-header__link::after {
  content: "↓";
  font-size: 0.75rem;
}

.story-header__link:hover {
  border-color: rgba(56, 189, 248, 0.7);
  box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.3);
  transform: translateY(1px);
}

.story-main {
  padding: var(--space-2xl) var(--space-lg) var(--space-3xl);
}

.story-hero {
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.story-hero__inner {
  max-width: 720px;
  text-align: center;
}

.story-hero__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.2rem 0.8rem;
  border-radius: var(--radius-pill);
  border: 1px solid rgba(148, 163, 184, 0.35);
  background-color: rgba(15, 23, 42, 0.7);
  color: var(--color-muted);
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: var(--space-md);
}

.story-hero__eyebrow::before {
  content: "";
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: radial-gradient(circle, #22c55e, #15803d);
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.16);
}

.story-hero__title {
  font-size: clamp(2.3rem, 5vw, 3.1rem);
  letter-spacing: -0.03em;
  margin: 0 0 var(--space-md);
}

.story-hero__subtitle {
  margin: 0 auto var(--space-xl);
  max-width: 520px;
  color: var(--color-muted);
  font-size: 0.98rem;
}

.story-hero__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.85rem 1.8rem;
  border-radius: var(--radius-pill);
  border: 1px solid rgba(56, 189, 248, 0.7);
  background: radial-gradient(
      circle at top left,
      rgba(56, 189, 248, 0.7),
      transparent
    ),
    radial-gradient(circle at bottom right, rgba(59, 130, 246, 0.85), #0f172a);
  color: #ecfeff;
  font-size: 0.95rem;
  font-weight: 500;
  box-shadow: var(--shadow-soft);
  cursor: pointer;
  transition:
    transform 150ms ease-out,
    box-shadow 150ms ease-out,
    filter 150ms ease-out;
}

.story-hero__cta:hover {
  transform: translateY(1px) scale(1.01);
  filter: brightness(1.05);
}

.story-layout {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-2xl);
}

.story-graphic {
  position: sticky;
  top: calc(var(--space-xl) * 1.6);
  z-index: 1;
}

.story-graphic__card {
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-subtle);
  background: radial-gradient(
      circle at top left,
      rgba(56, 189, 248, 0.3),
      transparent 55%
    ),
    radial-gradient(circle at bottom right, rgba(79, 70, 229, 0.4), transparent),
    linear-gradient(145deg, var(--color-surface), var(--color-surface-soft));
  padding: var(--space-xl);
  box-shadow: var(--shadow-soft);
  min-height: min(70vh, 460px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--space-lg);
}

.story-graphic__label {
  font-size: 0.8rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-muted);
}

.story-graphic__title {
  font-size: 1.4rem;
  margin: 0;
}

.story-graphic__text {
  margin: 0;
  color: var(--color-muted);
  font-size: 0.95rem;
  max-width: 420px;
}

.story-graphic__progress {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.story-graphic__dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.6);
  background-color: rgba(15, 23, 42, 0.9);
  box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.6);
  opacity: 0.5;
  transition:
    background-color 160ms ease-out,
    box-shadow 160ms ease-out,
    opacity 160ms ease-out,
    transform 160ms ease-out;
}

.story-graphic__dot--active {
  background: radial-gradient(circle, #38bdf8, #0ea5e9);
  box-shadow:
    0 0 0 1px rgba(15, 23, 42, 0.9),
    0 0 12px rgba(56, 189, 248, 0.7);
  opacity: 1;
  transform: scale(1.05);
}

.story-steps {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.story-step {
  padding: var(--space-lg);
  border-radius: 18px;
  border: 1px solid transparent;
  background: linear-gradient(
      to bottom,
      rgba(15, 23, 42, 0.92),
      rgba(15, 23, 42, 0.75)
    ),
    linear-gradient(to right, rgba(148, 163, 184, 0.28), transparent 45%);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.65);
  transform: translateY(18px);
  opacity: 0.25;
  transition:
    opacity 260ms ease-out,
    transform 260ms ease-out,
    border-color 260ms ease-out,
    box-shadow 260ms ease-out,
    background 260ms ease-out;
}

.story-step__title {
  margin: 0 0 var(--space-sm);
  font-size: 1.1rem;
}

.story-step__body {
  margin: 0;
  color: var(--color-muted);
  font-size: 0.96rem;
  line-height: 1.7;
}

.story-step--active {
  opacity: 1;
  transform: translateY(0);
  border-color: rgba(56, 189, 248, 0.6);
  box-shadow:
    0 18px 40px rgba(15, 23, 42, 0.9),
    0 0 0 1px rgba(15, 23, 42, 0.9);
  background:
    linear-gradient(
      135deg,
      rgba(15, 23, 42, 0.95),
      rgba(15, 23, 42, 0.92)
    ),
    radial-gradient(
      circle at top left,
      rgba(56, 189, 248, 0.32),
      transparent 60%
    );
}

.story-outro {
  margin-top: var(--space-3xl);
}

.story-outro__inner {
  max-width: 720px;
  margin: 0 auto;
  padding: var(--space-2xl) var(--space-xl);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-subtle);
  background: linear-gradient(
    135deg,
    rgba(15, 23, 42, 0.96),
    rgba(15, 23, 42, 0.9)
  );
  box-shadow: var(--shadow-soft);
}

.story-outro__title {
  margin: 0 0 var(--space-sm);
  font-size: 1.4rem;
}

.story-outro__body {
  margin: 0;
  color: var(--color-muted);
  font-size: 0.96rem;
}

.story-footer {
  padding: var(--space-lg);
  border-top: 1px solid rgba(148, 163, 184, 0.24);
  margin-top: var(--space-3xl);
}

.story-footer__text {
  max-width: 1100px;
  margin: 0 auto;
  color: var(--color-muted);
  font-size: 0.86rem;
}

.back-to-top {
  position: fixed;
  right: var(--space-lg);
  bottom: var(--space-lg);
  z-index: 20;
  padding: 0.7rem 1.4rem;
  border-radius: var(--radius-pill);
  border: 1px solid rgba(148, 163, 184, 0.6);
  background-color: rgba(15, 23, 42, 0.92);
  color: var(--color-text);
  font-size: 0.86rem;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  cursor: pointer;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.9);
  opacity: 0;
  transform: translateY(16px);
  pointer-events: none;
  transition:
    opacity 160ms ease-out,
    transform 160ms ease-out,
    box-shadow 160ms ease-out,
    border-color 160ms ease-out,
    background 160ms ease-out;
}

.back-to-top::before {
  content: "↑";
  font-size: 0.8rem;
}

.back-to-top--visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.back-to-top:hover {
  border-color: rgba(56, 189, 248, 0.7);
  background-color: rgba(15, 23, 42, 0.98);
}

@media (min-width: 768px) {
  .story-layout {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1.1fr);
    align-items: flex-start;
    gap: var(--space-2xl);
  }

  .story-graphic__card {
    min-height: min(68vh, 520px);
  }
}

@media (max-width: 767px) {
  .story-main {
    padding-inline: var(--space-md);
  }

  .story-graphic {
    order: -1;
  }
}
```

---

## 附錄 C：script.js 完整內容

```js
document.addEventListener("DOMContentLoaded", () => {
  const steps = Array.from(document.querySelectorAll(".story-step"));
  const graphicTitleEl = document.querySelector("[data-graphic-title]");
  const graphicTextEl = document.querySelector("[data-graphic-text]");
  const dots = Array.from(
    document.querySelectorAll(".story-graphic__dot")
  );
  const backToTopButton = document.querySelector(".back-to-top");

  if (!steps.length || !graphicTitleEl || !graphicTextEl) {
    return;
  }

  function activateStep(stepElement) {
    const index = steps.indexOf(stepElement);

    steps.forEach((step) => step.classList.remove("story-step--active"));
    stepElement.classList.add("story-step--active");

    const title = stepElement.querySelector(".story-step__title");
    const body = stepElement.querySelector(".story-step__body");

    graphicTitleEl.textContent = title ? title.textContent : "";
    graphicTextEl.textContent = body ? body.textContent : "";

    dots.forEach((dot) =>
      dot.classList.remove("story-graphic__dot--active")
    );
    if (index >= 0 && index < dots.length) {
      dots[index].classList.add("story-graphic__dot--active");
    }
  }

  activateStep(steps[0]);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activateStep(entry.target);
        }
      });
    },
    {
      threshold: 0.6,
    }
  );

  steps.forEach((step) => observer.observe(step));

  if (backToTopButton) {
    window.addEventListener("scroll", () => {
      const showAfter = window.innerHeight * 0.85;
      const shouldShow = window.scrollY > showAfter;

      backToTopButton.classList.toggle(
        "back-to-top--visible",
        shouldShow
      );
    });

    backToTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
});
```
