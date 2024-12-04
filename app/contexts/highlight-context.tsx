import { createContext, useContext } from 'react'

interface HighlightContextType {
  highlightText: string[]
  setHighlightText: (text: string[]) => void
}

export const HighlightContext = createContext<HighlightContextType>({
  highlightText: [],
  setHighlightText: () => {},
})

export const useHighlight = () => useContext(HighlightContext) 