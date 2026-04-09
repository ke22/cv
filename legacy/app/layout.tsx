import type { Metadata } from 'next'
import './globals.css'
import SmoothScrollProvider from '@/components/SmoothScrollProvider'

export const metadata: Metadata = {
  title: 'AI 核心流程化 - 編輯產出流程與品質',
  description: '推進編輯產出流程與品質到 AI 核心流程化',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW" data-scroll-container suppressHydrationWarning>
      <body className="antialiased">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  )
}
