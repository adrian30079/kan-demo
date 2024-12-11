'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tags, DownloadIcon, Download, Settings2, Check  } from 'lucide-react';
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
}

export function ChannerlManage({
  channelName,
  isDisabled,
}: ChannelPagesDialogProps) {
  const [open, setOpen] = useState(false)
  const [newChannel, setNewChannel] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [channels, setChannels] = useState(nerData.cryptoChannels)
  const [selectedChannels, setSelectedChannels] = useState<string[]>(channels)
  const [selectAll, setSelectAll] = useState(true)

  const handleAddChannel = () => {
    if (!newChannel.trim()) return
    
    setIsLoading(true)
    setTimeout(() => {
      setChannels([...channels, newChannel])
      setNewChannel('')
      setIsLoading(false)
    }, 3000)
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked)
    setSelectedChannels(checked ? channels : [])
  }

  const handleChannelSelect = (channel: string, checked: boolean) => {
    if (checked) {
      setSelectedChannels([...selectedChannels, channel])
    } else {
      setSelectedChannels(selectedChannels.filter(c => c !== channel))
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          disabled={isDisabled}
          className="hover:border-[#00857C] hover:text-[#00857C] h-6"
        >
          Manage
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>Manage {channelName} Groups</DialogTitle>
            <span className="bg-[#00857C]/10 text-[#00857C] text-xs px-2 py-0.5 rounded-full">
              {selectedChannels.length}
            </span>
          </div>
          <DialogDescription>
            Manage monitoring groups for this channel.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`selectAll-${channelName}`}
              checked={selectAll}
              onCheckedChange={handleSelectAll}
              className="border-2 data-[state=checked]:bg-[#00857C] data-[state=checked]:border-[#00857C] cursor-pointer"
            />
            <Label htmlFor={`selectAll-${channelName}`} className="cursor-pointer">Select All</Label>
          </div>
        </div>
        <div className="flex gap-2 mb-4">
          <Input 
            placeholder="Add a new group"
            value={newChannel}
            onChange={(e) => setNewChannel(e.target.value)}
            className="focus-visible:ring-[#00857C]"
          />
          <Button 
            onClick={handleAddChannel} 
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
              {channels.map((channel) => (
                <CommandItem key={channel}>
                  <Checkbox
                    id={`channel-${channel}`}
                    checked={selectedChannels.includes(channel)}
                    onCheckedChange={(checked) => handleChannelSelect(channel, checked)}
                    className="border-2 data-[state=checked]:bg-[#00857C] data-[state=checked]:border-[#00857C] cursor-pointer"
                  />
                  <Label 
                    htmlFor={`channel-${channel}`} 
                    className="ml-2 cursor-pointer"
                  >
                    {channel}
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
            <Check className="mr-2 h-4 w-4" />
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}