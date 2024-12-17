import { useState } from 'react'
import { HighlightContext } from '@/contexts/highlight-context'
import { LayoutProvider } from './contexts/layout-context'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [highlightText, setHighlightText] = useState<string[]>([])

  return (
    <html lang="en">
      <body>
        <LayoutProvider>
          <HighlightContext.Provider value={{ highlightText, setHighlightText }}>
            <header id="header">
              {/* Header content */}
            </header>
            <aside id="sidebar">
              {/* Sidebar content */}
            </aside>
            {children}
            <Toaster position="bottom-right" />
          </HighlightContext.Provider>
        </LayoutProvider>
      </body>
    </html>
  )
} 