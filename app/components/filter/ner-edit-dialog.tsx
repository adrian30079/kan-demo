'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import nerData from '@/components/data-channels.json'
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

interface ChannelPagesDialogProps {
  channelName: string
  isDisabled: boolean
  pages: { name: string; included: boolean }[]
  onTogglePage: (pageName: string) => void
  onToggleAllPages: (included: boolean) => void
}

export function NerEditDialog({
  channelName,
  isDisabled,
  pages,
  onTogglePage,
  onToggleAllPages,
}: ChannelPagesDialogProps) {
  const [open, setOpen] = useState(false)
  const [newNer, setNewNer] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [nerLabels, setNerLabels] = useState(nerData.nerLabels)

  const handleAddNer = () => {
    if (!newNer.trim()) return
    
    setIsLoading(true)
    // Simulate loading for 3 seconds
    setTimeout(() => {
      setNerLabels([...nerLabels, newNer])
      setNewNer('')
      setIsLoading(false)
    }, 3000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          disabled={isDisabled}
          className="hover:border-[#00857C] hover:text-[#00857C]"
        >
          NER Labels
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage {channelName}</DialogTitle>
          <DialogDescription>
            Select specific pages to include or exclude.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`selectAll-${channelName}`}
              checked={pages.every(page => page.included)}
              onCheckedChange={(checked) => onToggleAllPages(checked as boolean)}
              className="border-2 data-[state=checked]:bg-[#00857C] data-[state=checked]:border-[#00857C] cursor-pointer"
            />
            <Label htmlFor={`selectAll-${channelName}`} className="cursor-pointer">Select All</Label>
          </div>
        </div>
        <div className="flex gap-2 mb-4">
          <Input 
            placeholder="Add new NER label"
            value={newNer}
            onChange={(e) => setNewNer(e.target.value)}
            className="focus-visible:ring-[#00857C]"
          />
          <Button 
            onClick={handleAddNer} 
            disabled={isLoading}
            className="bg-[#00857C] hover:bg-[#00857C]/90"
          >
            Add
          </Button>
        </div>
        
        {isLoading && (
          <div className="flex items-center gap-2 mb-4 text-sm text-[#00857C]">
            <Loader2 className="h-4 w-4 animate-spin text-[#00857C]" />
            Adding new NER label...
          </div>
        )}

        <Command>
          <CommandInput placeholder="Search NER labels..." />
          <CommandList>
            <CommandEmpty>No labels found.</CommandEmpty>
            <CommandGroup>
              {nerLabels.map((label) => (
                <CommandItem key={label}>
                  <Checkbox
                    id={`ner-${label}`}
                    checked={!pages.some(p => p.name === label) || pages.some(p => p.name === label && p.included)}
                    onCheckedChange={() => onTogglePage(label)}
                    className="border-2 data-[state=checked]:bg-[#00857C] data-[state=checked]:border-[#00857C] cursor-pointer"
                  />
                  <Label 
                    htmlFor={`ner-${label}`} 
                    className="ml-2 cursor-pointer"
                  >
                    {label}
                  </Label>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={() => setOpen(false)}
            className="bg-[#00857C] hover:bg-[#00857C]/90"
          >
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}