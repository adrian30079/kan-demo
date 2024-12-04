import * as React from "react"
import { X, Plus, Highlighter } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import defaultSettings from "./data-topic-setting.json"

interface HighlightTagsMenuProps {
  showHighlightTags: boolean
  setShowHighlightTags: (show: boolean) => void
}

export function HighlightTagsMenu({
  showHighlightTags,
  setShowHighlightTags,
}: HighlightTagsMenuProps) {
  const menuRef = React.useRef<HTMLDivElement>(null)
  const [highlightText, setHighlightText] = React.useState<string[]>(defaultSettings.highlightText)
  const [highlightTextPrev, setHighlightTextPrev] = React.useState<string[]>(defaultSettings.highlightTextPrev)
  const [newHighlightTag, setNewHighlightTag] = React.useState('')

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowHighlightTags(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [setShowHighlightTags])

  const saveSettings = React.useCallback(() => {
    // You might want to implement an API call here to save the settings
    console.log('Saving settings:', {
      highlightText,
      highlightTextPrev
    })
  }, [highlightText, highlightTextPrev])

  const addHighlightTag = () => {
    if (newHighlightTag && !highlightText.includes(newHighlightTag)) {
      setHighlightText([...highlightText, newHighlightTag])
      setNewHighlightTag('')
      saveSettings()
    }
  }

  const removeHighlightTag = (tagToRemove: string) => {
    setHighlightText(highlightText.filter(tag => tag !== tagToRemove))
    setHighlightTextPrev([...highlightTextPrev, tagToRemove])
    saveSettings()
  }

  const addPreviousHighlightTag = (tagToAdd: string) => {
    setHighlightText([...highlightText, tagToAdd])
    setHighlightTextPrev(highlightTextPrev.filter(tag => tag !== tagToAdd))
    saveSettings()
  }

  return (
    <div className="relative" ref={menuRef}>
      <Button 
        onClick={() => setShowHighlightTags(!showHighlightTags)}
        variant="outline" 
        size="sm"
        className={cn(
          "relative",
          showHighlightTags && "bg-[#00857C] text-white hover:bg-[#00857C]/90"
        )}
      >
        <Highlighter className="h-4 w-4 mr-2" />
        Highlights
      </Button>
      {showHighlightTags && (
        <div className="absolute top-full mt-2 right-0 bg-white p-6 rounded-xl shadow-lg border w-80 z-50">
          <p className="text-sm text-muted-foreground mb-2">Highlighted Text</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {highlightText.map((tag) => (
              <Badge key={tag} variant="secondary" className="px-2 py-1" style={{ backgroundColor: '#e9f5f1' }}>
                {tag}
                <button
                  onClick={() => removeHighlightTag(tag)}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex space-x-2 mb-6">
            <Input
              placeholder="Add new tag..."
              value={newHighlightTag}
              onChange={(e) => setNewHighlightTag(e.target.value)}
              className="flex-1"
            />
            <Button onClick={addHighlightTag} variant="outline" size="sm">
              Add
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-2">Recent Added</p>
          <div className="flex flex-wrap gap-2">
            {highlightTextPrev.map((tag) => (
              <Badge key={tag} variant="secondary" className="px-2 py-1">
                {tag}
                <button
                  onClick={() => addPreviousHighlightTag(tag)}
                  className="ml-1 hover:text-green-500"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}