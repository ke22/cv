# AI 核心流程化 - 編輯產出流程與品質

A modular component-based frontend website inspired by realfood.gov design principles.

## 🎯 兩個版本

這個專案提供兩個版本：

### 版本 1: 純 HTML/CSS/JS（簡單、快速）
- ✅ 無需建置，直接打開 `index.html`
- ✅ 適合快速原型和學習
- ✅ 部署到 GitHub Pages

### 版本 2: Next.js + Tailwind CSS（匹配 RealFood.gov）
- ✅ 使用 Next.js 14 + React + TypeScript
- ✅ Tailwind CSS 樣式系統
- ✅ 組件化架構
- ✅ 更好的效能和 SEO
- ✅ 部署到 Vercel

**👉 查看 [README_NEXTJS.md](README_NEXTJS.md) 了解 Next.js 版本**

## 🚀 Quick Start

### 版本 1: HTML/CSS/JS

1. **Clone or download** this repository
2. **Open `index.html`** in your browser (no server needed!)
3. **Start editing** with Cursor AI

### 版本 2: Next.js

```bash
npm install
npm run dev
```

訪問 [http://localhost:3000](http://localhost:3000)

**👉 查看 [QUICK_START.md](QUICK_START.md) 了解詳細步驟**

## 📁 Project Structure

### 版本 1: HTML/CSS/JS
```
/
├── index.html            # Main HTML file
├── styles.css            # Main stylesheet
├── script.js             # Main JavaScript
└── content/              # Content data
```

### 版本 2: Next.js
```
/
├── app/                  # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/           # React components
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   └── ...
├── tailwind.config.js    # Tailwind configuration
└── package.json          # Dependencies
```

### 共用檔案
```
/
├── .cursor/              # Cursor AI context files
├── .github/              # GitHub workflows
├── .cursorrules          # Cursor AI rules
├── cursor.md             # Project documentation
└── README.md             # This file
```

## 🛠️ Development

### Local Development
- Open `index.html` directly in your browser
- No build step required
- Edit files and refresh browser to see changes

### Using Cursor AI
- The project includes `.cursorrules` and `cursor.md` for AI assistance
- Cursor will understand the project structure and design system
- Use Agent mode to create components, Ask mode for questions

### Components
- **Navbar**: Navigation bar with smooth scroll
- **Hero**: Main banner section
- **Stats Section**: Statistics display
- **Pyramid Section**: Food pyramid visualization
- **FAQ Section**: Key guidance/questions
- **Resources Section**: Downloads and resources
- **Footer**: Page footer

## 🎨 Design System

See `.cursor/context/design-system.md` for:
- Color palette
- Typography scale
- Spacing system
- Component patterns
- Responsive breakpoints

## 📱 Responsive Design

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

## 🚢 Deployment

### Automatic (GitHub Pages)
1. Push to `main` branch
2. GitHub Actions automatically deploys
3. Site available at: `https://[username].github.io/[repo-name]`

### Manual
1. Enable GitHub Pages in repository settings
2. Select `main` branch as source
3. Site will be available at the GitHub Pages URL

## 📝 Customization

### Changing Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --color-primary: #1a1a1a;
    --color-accent: #2d5016;
    /* ... */
}
```

### Adding Components
1. Add HTML structure
2. Add CSS styling
3. Add JavaScript (if needed)
4. Test in browser

### Modifying Layout
- Use CSS Grid for layouts
- Use Flexbox for alignment
- Follow mobile-first approach

## 🧪 Testing

Before deploying:
- [ ] Test on mobile (320px+)
- [ ] Test on tablet (768px+)
- [ ] Test on desktop (1024px+)
- [ ] Check all links work
- [ ] Verify smooth scrolling
- [ ] Test hover effects
- [ ] Check accessibility (keyboard navigation)

## 📚 Resources

- [Design System Documentation](.cursor/context/design-system.md)
- [Cursor AI Rules](.cursorrules)
- [Project Documentation](cursor.md)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Commit with clear messages
5. Push and create pull request

## 📄 License

This project is open source and available for learning purposes.

---

**Built with** ❤️ **using Cursor AI**
