# 滾動敘事與視覺效果實作指南

## 🎬 已實作的組件

### 1. The Movement (滾動與過渡)

#### ✅ ScrollytellingSection.tsx
**功能**: 完整的滾動敘事組件
- **Scroll-Jacking**: 控制滾動速度，延長特定區域
- **Sticky Positioning**: 內容固定在螢幕中央
- **Parallax Effect**: 背景層移動速度不同

**使用方式**:
```tsx
import ScrollytellingSection from '@/components/ScrollytellingSection'

<ScrollytellingSection />
```

#### ✅ ParallaxLayers.tsx
**功能**: 多層視差效果
- **ParallaxElement**: 單一視差元素
- **ParallaxLayers**: 多層視差組合

**使用方式**:
```tsx
import { ParallaxElement } from '@/components/ParallaxLayers'

<ParallaxElement speed={0.5}>
  <div>你的內容</div>
</ParallaxElement>
```

---

### 2. The Visual Style (視覺風格)

#### ✅ KineticTypography.tsx
**功能**: 動態文字效果
- **KineticTypography**: 文字移動、淡入、繪製
- **TextReveal**: 文字揭示效果（上下左右）

**使用方式**:
```tsx
import KineticTypography, { TextReveal } from '@/components/KineticTypography'

<KineticTypography text="你的文字" />
<TextReveal direction="up">內容</TextReveal>
```

#### ✅ MicroAnimations.tsx
**功能**: 微動畫集合
- **PulsingIcon**: 脈衝動畫
- **GlowingButton**: 發光按鈕
- **BreathingElement**: 呼吸效果
- **FloatingElement**: 懸浮效果
- **TypewriterText**: 打字機效果
- **MagneticButton**: 磁鐵效果（滑鼠吸引）

**使用方式**:
```tsx
import { 
  PulsingIcon, 
  GlowingButton, 
  FloatingElement 
} from '@/components/MicroAnimations'

<PulsingIcon>
  <div>圖標</div>
</PulsingIcon>

<GlowingButton onClick={() => {}}>
  按鈕文字
</GlowingButton>

<FloatingElement>
  <div>浮動內容</div>
</FloatingElement>
```

#### ✅ AtmosphericOverlays.tsx
**功能**: 大氣層疊效果
- **DigitalFog**: 數位霧
- **LightFlare**: 光暈
- **GrainTexture**: 顆粒質感
- **GradientOverlay**: 漸變遮罩
- **Scanlines**: 掃描線（CRT 風格）
- **AtmosphericContainer**: 組合容器

**使用方式**:
```tsx
import { 
  AtmosphericContainer,
  DigitalFog,
  LightFlare 
} from '@/components/AtmosphericOverlays'

<AtmosphericContainer fog grain flare>
  <LightFlare x="30%" y="20%" size={300} />
  <DigitalFog intensity={0.2} />
  {/* 你的內容 */}
</AtmosphericContainer>
```

#### ✅ ImmersiveSection.tsx
**功能**: 完整的沉浸式環境
- 組合所有效果
- 3D 視角變化
- 動態背景
- 完整範例

**使用方式**:
```tsx
import ImmersiveSection from '@/components/ImmersiveSection'

<ImmersiveSection />
```

---

## 🎯 實作範例

### 範例 1: 簡單滾動敘事

```tsx
'use client'

import ScrollytellingSection from '@/components/ScrollytellingSection'

export default function MyPage() {
  return (
    <div>
      <ScrollytellingSection />
    </div>
  )
}
```

### 範例 2: 動態文字 + 視差

```tsx
'use client'

import KineticTypography from '@/components/KineticTypography'
import { ParallaxElement } from '@/components/ParallaxLayers'

export default function HeroSection() {
  return (
    <section className="h-screen flex items-center justify-center">
      <ParallaxElement speed={-0.3}>
        <KineticTypography text="歡迎來到未來" />
      </ParallaxElement>
    </section>
  )
}
```

### 範例 3: 微動畫按鈕

```tsx
'use client'

import { GlowingButton, MagneticButton } from '@/components/MicroAnimations'

export default function CTAButtons() {
  return (
    <div className="flex gap-4">
      <GlowingButton onClick={() => {}}>
        發光按鈕
      </GlowingButton>
      <MagneticButton strength={0.5}>
        磁鐵按鈕
      </MagneticButton>
    </div>
  )
}
```

### 範例 4: 沉浸式區塊

```tsx
'use client'

import { AtmosphericContainer, LightFlare } from '@/components/AtmosphericOverlays'
import { FloatingElement } from '@/components/MicroAnimations'

export default function ImmersiveBlock() {
  return (
    <AtmosphericContainer fog grain>
      <LightFlare x="50%" y="50%" size={500} />
      <FloatingElement>
        <div className="card">
          沉浸式內容
        </div>
      </FloatingElement>
    </AtmosphericContainer>
  )
}
```

---

## 🔧 整合到現有組件

### 更新 Hero Section

```tsx
import KineticTypography from '@/components/KineticTypography'
import { ParallaxElement } from '@/components/ParallaxLayers'
import { GlowingButton } from '@/components/MicroAnimations'

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center">
      <ParallaxElement speed={-0.2}>
        <KineticTypography text="AI 核心流程化" />
        <GlowingButton>開始探索</GlowingButton>
      </ParallaxElement>
    </section>
  )
}
```

### 更新 Execution Section（使用 Scrollytelling）

```tsx
import ScrollytellingSection from '@/components/ScrollytellingSection'

export default function ExecutionSection() {
  return (
    <section>
      <ScrollytellingSection />
    </section>
  )
}
```

---

## 🎨 自訂參數

### Scroll-Jacking 強度

```tsx
ScrollTrigger.create({
  end: '+=200%',  // 改這裡：數字越大，滾動越慢
})
```

### 視差速度

```tsx
<ParallaxElement speed={0.5}>  {/* 0-1，越大移動越快 */}
```

### 微動畫速度

```tsx
<PulsingIcon>
  {/* 在組件內修改 duration */}
  animate={{
    scale: [1, 1.2, 1],
  }}
  transition={{
    duration: 2,  // 改這裡
  }}
/>
```

### 大氣效果強度

```tsx
<DigitalFog intensity={0.3} />  {/* 0-1 */}
<GrainTexture opacity={0.1} />  {/* 0-1 */}
```

---

## 📊 效能優化

### 1. 條件渲染動畫

```tsx
const [isVisible, setIsVisible] = useState(false)

// 只在可見時播放動畫
<motion.div animate={isVisible ? { opacity: 1 } : { opacity: 0 }}>
```

### 2. 使用 will-change

```tsx
<div style={{ willChange: 'transform' }}>
  {/* 動畫元素 */}
</div>
```

### 3. 減少重繪

```tsx
// 使用 transform 而非 position
style={{ transform: `translateY(${y}px)` }}
// 而非
style={{ top: `${y}px` }}
```

---

## 🚀 進階技巧

### 組合多種效果

```tsx
<AtmosphericContainer fog grain>
  <ParallaxElement speed={0.3}>
    <FloatingElement>
      <PulsingIcon>
        <GlowingButton>
          組合效果按鈕
        </GlowingButton>
      </PulsingIcon>
    </FloatingElement>
  </ParallaxElement>
</AtmosphericContainer>
```

### 滾動進度控制

```tsx
const { scrollYProgress } = useScroll()
const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1])

<motion.div style={{ scale }}>
  根據滾動縮放
</motion.div>
```

---

## 📚 參考資源

- [GSAP ScrollTrigger](https://greensock.com/docs/v3/Plugins/ScrollTrigger)
- [Framer Motion Scroll](https://www.framer.com/motion/use-scroll/)
- [Parallax Effects](https://www.framer.com/motion/use-scroll/#scroll-linked-animations)

---

**所有組件已建立完成，可以直接使用！** 🎉
