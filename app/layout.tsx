import { useState } from 'react'
import { HighlightContext } from '@/contexts/highlight-context'
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({ children }) {
  const [highlightText, setHighlightText] = useState<string[]>([])

  return (
    <HighlightContext.Provider value={{ highlightText, setHighlightText }}>
      {children}
      <Toaster />
    </HighlightContext.Provider>
  )
} 