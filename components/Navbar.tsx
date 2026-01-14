'use client'

import { useState, useEffect } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '#mission', label: '任務目標' },
    { href: '#gap', label: '現況與差距' },
    { href: '#portfolio', label: '成長布局' },
    { href: '#execution', label: '執行方法' },
    { href: '#metrics', label: '指標與資源' },
  ]

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    if (typeof document !== 'undefined') {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-base border-b border-border transition-shadow ${
      scrolled ? 'shadow-md' : ''
    }`}>
      <div className="container-custom py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-text-dark">AI 核心流程化</div>
        <ul className="flex gap-8 list-none">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="text-sm text-text-dark hover:text-accent transition-colors no-underline"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
