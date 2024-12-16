'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

interface Item {
  id: string
  name: string
  metadata?: {
    [key: string]: string | number
  }
  count?: number
}

interface ManageItemsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  items: Item[]
  selectedItems: Set<string>
  onSelectionChange: (items: Set<string>) => void
  maxItems?: number
  metadataLabels?: {
    [key: string]: string
  }
  filters?: {
    [key: string]: {
      label: string,
      options: {
        id: string,
        label: string,
        checked: boolean
      }[]
    }
  }
  onFilterChange?: (filterKey: string, optionId: string, checked: boolean) => void
  activeFilters?: {
    [key: string]: Set<string>
  }
  sentimentFilters?: {
    all: boolean
    positive: boolean
    negative: boolean
    mixed: boolean
    neutral: boolean
  }
  posFilters?: {
    all: boolean
    nouns: boolean
    verbs: boolean
    adjectives: boolean
  }
}

export function ManageItemsDialog({
  open,
  onOpenChange,
  title,
  description,
  items,
  selectedItems,
  onSelectionChange,
  maxItems = 50,
  metadataLabels = {},
  filters,
  onFilterChange,
  activeFilters,
  sentimentFilters,
  posFilters,
}: ManageItemsDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleReset = () => {
    const initialSelected = new Set(
      items
        .sort((a, b) => (b.count || 0) - (a.count || 0))
        .slice(0, maxItems)
        .map(item => item.id)
    )
    onSelectionChange(initialSelected)
  }

  const filteredItems = items
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesSentiment = !sentimentFilters || 
        sentimentFilters.all || 
        (item.metadata?.sentiment && 
          sentimentFilters[item.metadata.sentiment as keyof typeof sentimentFilters])

      const posMapping = {
        noun: 'nouns',
        verb: 'verbs',
        adjective: 'adjectives'
      }
      const matchesPos = !posFilters || 
        posFilters.all || 
        (item.metadata?.pos && 
          posFilters[posMapping[item.metadata.pos as keyof typeof posMapping] as keyof typeof posFilters])

      return matchesSearch && matchesSentiment && matchesPos
    })
    .sort((a, b) => (b.count || 0) - (a.count || 0))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="space-y-4 p-4">
            <div className="text-sm text-muted-foreground">
              {description}
            </div>
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
            {filters && (
              <div className="space-y-4">
                {Object.entries(filters).map(([key, filter]) => (
                  <div key={key} className="space-y-2">
                    <h4 className="font-medium">{filter.label}</h4>
                    <div className="grid gap-2">
                      {filter.options.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`filter-${key}-${option.id}`}
                            checked={option.checked}
                            onCheckedChange={(checked) => {
                              onFilterChange?.(key, option.id, !!checked)
                            }}
                          />
                          <label
                            htmlFor={`filter-${key}-${option.id}`}
                            className="text-sm"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex-1 overflow-auto px-4 min-h-[400px]">
            <div className="space-y-2">
              {filteredItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-2 py-1">
                  <Checkbox
                    id={`item-${item.id}`}
                    checked={selectedItems.has(item.id)}
                    onCheckedChange={(checked) => {
                      const newSelected = new Set(selectedItems)
                      if (checked && newSelected.size < maxItems) {
                        newSelected.add(item.id)
                      } else if (!checked) {
                        newSelected.delete(item.id)
                      }
                      onSelectionChange(newSelected)
                    }}
                    disabled={!selectedItems.has(item.id) && selectedItems.size >= maxItems}
                  />
                  <label
                    htmlFor={`item-${item.id}`}
                    className="flex-1 flex justify-between items-center text-sm"
                  >
                    <span>{item.name}</span>
                    <div className="flex items-center gap-2">
                      {item.metadata && (
                        <span className="text-xs text-muted-foreground">
                          {Object.values(item.metadata).join(" • ")}
                        </span>
                      )}
                      {item.count !== undefined && (
                        <span className="text-muted-foreground">{item.count}</span>
                      )}
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {selectedItems.size} of {maxItems} items selected
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => onOpenChange(false)}
              className="bg-[#00857C] text-white hover:bg-[#00857C]/90"
            >
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 