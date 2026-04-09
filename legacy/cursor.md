# Project Documentation for Cursor AI

## Project Overview
This is a modular component-based frontend website inspired by realfood.gov design principles. The project uses pure HTML, CSS, and JavaScript with no frameworks, focusing on clean code and maintainable structure.

## Architecture
- **Structure**: Component-based modular architecture
- **Styling**: Custom CSS with design system variables
- **JavaScript**: Vanilla JS with modular component scripts
- **No Framework**: Pure HTML/CSS/JS (no React, Vue, etc.)
- **Deployment**: GitHub Pages with auto-deploy on push

## Component Naming Convention
- Use descriptive names: `navbar`, `hero-section`, `stats-section`, `pyramid-section`
- CSS classes: `.component-name` (kebab-case)
- IDs: `#component-name` (kebab-case)
- JavaScript: camelCase for variables/functions

## Development Workflow
1. Create component HTML structure
2. Add component-specific CSS
3. Add JavaScript functionality (if needed)
4. Test in browser (open index.html directly)
5. Refine and iterate
6. Commit and push (auto-deploys)

## Common Tasks & Prompts
- **Creating new components**: "Create a [name] component with [features]"
- **Styling**: "Style the [component] with [requirements]"
- **Responsive design**: "Make [component] mobile responsive"
- **Debugging**: "Fix [issue] in [component]"
- **Refactoring**: "Refactor [component] to use [new approach]"

## File Structure
```
/
├── .cursor/
│   └── context/
│       └── design-system.md
├── .cursorrules
├── cursor.md
├── .github/
│   └── workflows/
│       └── deploy.yml
├── .gitignore
├── README.md
├── index.html          # Main HTML file
├── styles.css          # Main stylesheet
├── script.js           # Main JavaScript
└── [component files if modular]
```

## Design Principles
- Clean, minimalist design
- High contrast for accessibility (WCAG AA)
- Mobile-first responsive design
- Consistent spacing and typography scale
- Smooth animations and transitions
- Performance optimized

## Component List
Current components:
- Navbar (navigation bar)
- Hero (main banner section)
- Stats Section (statistics display)
- Pyramid Section (food pyramid)
- FAQ Section (key guidance)
- Resources Section (downloads)
- Footer

## When Adding Features
- Always consider mobile responsiveness first
- Maintain design system consistency (use variables)
- Add appropriate hover states and transitions
- Include accessibility attributes
- Test cross-browser compatibility
- Optimize images and assets

## Testing Checklist
- [ ] Works on mobile (320px+)
- [ ] Works on tablet (768px+)
- [ ] Works on desktop (1024px+)
- [ ] No console errors
- [ ] All links work
- [ ] Images load properly
- [ ] Smooth scrolling works
- [ ] Hover effects work
- [ ] Accessibility: keyboard navigation works

## Deployment
- Auto-deploys on push to `main` branch
- Uses GitHub Pages
- No build step required (static files)
- Check deployment at: `https://[username].github.io/[repo-name]`
