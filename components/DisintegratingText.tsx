'use client'

import { useEffect, useRef, useState } from 'react'

interface DisintegratingTextProps {
  text: string
  className?: string
  delay?: number // Delay between each character (ms)
  threshold?: number // IntersectionObserver threshold
}

export default function DisintegratingText({ 
  text, 
  className = '', 
  delay = 30,
  threshold = 0.3 
}: DisintegratingTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true)
          }
        })
      },
      {
        threshold,
        rootMargin: '0px 0px -100px 0px'
      }
    )

    observer.observe(container)

    return () => {
      observer.disconnect()
    }
  }, [threshold, isVisible])

  // Split text into lines (handle \n or <br>)
  const lines = text.split(/\n|<br\s*\/?>/i)
  
  // Calculate character positions for proper sequential animation
  let globalCharIndex = 0
  const charElements: JSX.Element[] = []

  lines.forEach((line, lineIndex) => {
    const words = line.trim().split(' ')
    const lineElements: JSX.Element[] = []
    
    words.forEach((word, wordIndex) => {
      const wordChars: JSX.Element[] = []
      
      word.split('').forEach((char, charIndex) => {
        const currentIndex = globalCharIndex++
        
        wordChars.push(
          <span
            key={`${lineIndex}-${wordIndex}-${charIndex}`}
            className="disintegrating-char"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible 
                ? 'translateY(0) scale(1)' 
                : 'translateY(20px) scale(0.8)',
              transition: `opacity 0.5s ease ${currentIndex * delay}ms, 
                           transform 0.5s ease ${currentIndex * delay}ms`,
              marginLeft: charIndex === 0 && wordIndex > 0 ? '0.25em' : 
                         (charIndex > 0 ? '-0.08em' : '0')
            }}
          >
            {char}
          </span>
        )
      })
      
      lineElements.push(
        <span key={wordIndex} style={{ display: 'inline-flex' }}>
          {wordChars}
          {wordIndex < words.length - 1 && <span>&nbsp;</span>}
        </span>
      )
    })
    
    charElements.push(
      <div key={lineIndex} style={{ display: 'block' }}>
        {lineElements}
        {lineIndex < lines.length - 1 && <br />}
      </div>
    )
  })

  return (
    <div 
      ref={containerRef}
      className={`disintegrating-text ${className}`}
    >
      {charElements}
    </div>
  )
}
