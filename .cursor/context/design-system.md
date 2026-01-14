# Design System

## Color Palette

### Primary Colors
- **Primary Dark**: `#1a1a1a` - Main text, buttons, dark backgrounds
- **Primary Medium**: `#4a4a4a` - Secondary text, hover states
- **Accent Green**: `#2d5016` - Accent color, highlights, statistics

### Background Colors
- **White**: `#ffffff` - Main background
- **Light Gray**: `#f8f8f8` - Section backgrounds, card backgrounds
- **Border Gray**: `#e0e0e0` - Borders, dividers

### Text Colors
- **Text Dark**: `#1a1a1a` - Primary text
- **Text Light**: `#666` - Secondary text, descriptions
- **Text White**: `#ffffff` - Text on dark backgrounds

### CSS Variables
```css
:root {
    --color-primary: #1a1a1a;
    --color-primary-dark: #000000;
    --color-secondary: #4a4a4a;
    --color-accent: #2d5016;
    --color-base: #ffffff;
    --color-base-light: #f8f8f8;
    --color-border: #e0e0e0;
    --text-dark: #1a1a1a;
    --text-light: #666;
}
```

## Typography Scale

### Font Family
- **System Font Stack**: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`
- **Why**: Better performance, native look, no font loading

### Font Sizes
- **H1**: `4rem` (64px) - Hero headings
- **H2**: `3rem` (48px) - Section headings
- **H3**: `2rem` (32px) - Subsection headings
- **H4**: `1.5rem` (24px) - Card headings
- **Body**: `1rem` (16px) - Default text
- **Small**: `0.875rem` (14px) - Fine print, captions

### Font Weights
- **Bold**: `700` - Headings
- **Semi-bold**: `600` - Subheadings
- **Normal**: `400` - Body text

### Line Height
- **Headings**: `1.1` to `1.3` - Tight spacing
- **Body**: `1.6` to `1.8` - Readable spacing

## Spacing Scale (8px Base Unit)

### Spacing Values
- **xs**: `0.5rem` (8px) - Tight spacing
- **sm**: `1rem` (16px) - Small spacing
- **md**: `2rem` (32px) - Medium spacing
- **lg**: `4rem` (64px) - Large spacing
- **xl**: `6rem` (96px) - Extra large spacing

### CSS Variables
```css
:root {
    --spacing-xs: 0.5rem;
    --spacing-sm: 1rem;
    --spacing-md: 2rem;
    --spacing-lg: 4rem;
    --spacing-xl: 6rem;
}
```

## Component Patterns

### Cards
- **Border Radius**: `8px`
- **Box Shadow**: `0 2px 4px rgba(0, 0, 0, 0.1)`
- **Padding**: `2rem`
- **Background**: White or light gray
- **Hover Effect**: `translateY(-2px)` with stronger shadow

### Buttons
- **Padding**: `1rem 2rem`
- **Border Radius**: `4px`
- **Font Weight**: `600`
- **Transition**: `all 0.3s ease`
- **Primary**: Dark background, white text
- **Secondary**: Transparent with border

### Containers
- **Max Width**: `1200px`
- **Margin**: `0 auto` (centered)
- **Padding**: `0 20px` (side padding)

### Grid Layouts
- **Stats Grid**: `repeat(auto-fit, minmax(250px, 1fr))`
- **FAQ Grid**: `repeat(auto-fit, minmax(300px, 1fr))`
- **Food Grid**: `repeat(auto-fill, minmax(120px, 1fr))`
- **Gap**: `2rem` for large grids, `1rem` for small grids

## Border Radius
- **Small**: `4px` - Buttons, small elements
- **Medium**: `8px` - Cards, images
- **Large**: `12px` - Large cards, sections

## Shadows
- **Subtle**: `0 2px 4px rgba(0, 0, 0, 0.1)` - Default cards
- **Medium**: `0 4px 8px rgba(0, 0, 0, 0.15)` - Hover states
- **Strong**: `0 8px 16px rgba(0, 0, 0, 0.2)` - Modals, overlays

## Transitions
- **Default**: `all 0.3s ease` - Smooth transitions
- **Fast**: `all 0.2s ease` - Quick interactions
- **Slow**: `all 0.5s ease` - Deliberate animations

## Responsive Breakpoints
- **Mobile**: `320px - 767px`
- **Tablet**: `768px - 1023px`
- **Desktop**: `1024px+`

### Mobile Adjustments
- Reduce font sizes by 20-30%
- Single column layouts
- Reduce padding/spacing
- Stack navigation vertically

## Accessibility Standards
- **Contrast Ratio**: Minimum 4.5:1 for text (WCAG AA)
- **Focus States**: Visible outline on interactive elements
- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **ARIA Labels**: Use when semantic HTML isn't sufficient
- **Alt Text**: All images must have descriptive alt text

## Animation Guidelines
- **Duration**: 0.2s - 0.5s (fast enough to feel responsive)
- **Easing**: `ease` or `ease-in-out` (natural feeling)
- **Purpose**: Enhance UX, not distract
- **Reduce Motion**: Respect `prefers-reduced-motion` media query
