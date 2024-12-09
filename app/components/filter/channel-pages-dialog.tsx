'use client'

import { useState } from 'react'
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

interface ChannelPagesDialogProps {
  channelName: string
  isDisabled: boolean
  pages: { name: string; included: boolean }[]
  onTogglePage: (pageName: string) => void
  onToggleAllPages: (included: boolean) => void
}

export function c({
  channelName,
  isDisabled,
  pages,
  onTogglePage,
  onToggleAllPages,
}: ChannelPagesDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={isDisabled}>
          Manage Pages
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage {channelName} Pages</DialogTitle>
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
            />
            <Label htmlFor={`selectAll-${channelName}`}>Select All</Label>
          </div>
        </div>
        <Command>
          <CommandInput placeholder="Search pages..." />
          <CommandList>
            <CommandEmpty>No pages found.</CommandEmpty>
            <CommandGroup>
              {pages.map((page) => (
                <CommandItem key={page.name}>
                  <Checkbox
                    id={`page-${channelName}-${page.name}`}
                    checked={page.included}
                    onCheckedChange={() => onTogglePage(page.name)}
                  />
                  <Label 
                    htmlFor={`page-${channelName}-${page.name}`} 
                    className="ml-2"
                  >
                    {page.name}
                  </Label>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}