'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, X } from 'lucide-react'
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import alertData from './data-alert.json'
import { ChannerlManage } from "@/components/filter/channelManage"

interface CreateNewAlertProps {
  onBack: () => void
  onSave: (newAlert: Alert) => void
  editingAlert?: Alert
}

interface Alert {
  id: string
  name: string
  type: string
  channels: string[]
  status: boolean
  timeTriggered: number
  topic: string
  email: string
}

export default function CreateNewAlert({ onBack, onSave, editingAlert }: CreateNewAlertProps) {
  const [alertName, setAlertName] = useState(editingAlert?.name || "")
  const [alertType, setAlertType] = useState(editingAlert?.type || "spikes")
  const [selectAllChannels, setSelectAllChannels] = useState(true)
  const [channels, setChannels] = useState([
    { name: 'Facebook', included: editingAlert?.channels.includes('facebook') || true },
    { name: 'Instagram', included: editingAlert?.channels.includes('instagram') || true },
    { name: 'X', included: editingAlert?.channels.includes('X') || true },
    { name: 'LIHKG', included: editingAlert?.channels.includes('LIHKG') || true }
  ])
  const [selectedTopic, setSelectedTopic] = useState(editingAlert?.topic || "")
  const additionalTopics = [
    "黃天祐博士",
    "梁鳳儀行政總裁",
    "程蘋執行董事",
    "蔡鳳儀執行董事",
    "戴霖執行董事"
  ]
  const topics = [...Array.from(new Set(alertData.map(alert => alert.topic))), ...additionalTopics]
  const [channelsError, setChannelsError] = useState(false)
  const [emails, setEmails] = useState<string[]>(() => {
    if (!editingAlert?.email) return [];
    return Array.isArray(editingAlert.email) 
      ? editingAlert.email 
      : editingAlert.email.split(',').map(e => e.trim());
  });
  const [currentEmail, setCurrentEmail] = useState("")

  const toggleAllChannels = (checked: boolean) => {
    setSelectAllChannels(checked)
    setChannels(prevChannels =>
      prevChannels.map(channel => ({ ...channel, included: checked }))
    )
  }

  const toggleChannelInclusion = (channelName: string) => {
    setChannels(prevChannels =>
      prevChannels.map(channel =>
        channel.name === channelName
          ? { ...channel, included: !channel.included }
          : channel
      )
    )
    
    const updatedChannels = channels.map(channel =>
      channel.name === channelName ? { ...channel, included: !channel.included } : channel
    )
    setSelectAllChannels(updatedChannels.every(channel => channel.included))
  }

  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const email = currentEmail.trim()
      if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (!emails.includes(email)) {
          setEmails([...emails, email])
          setCurrentEmail("")
        }
      }
    }
  }

  const removeEmail = (emailToRemove: string) => {
    setEmails(emails.filter(email => email !== emailToRemove))
  }

  const handleSave = () => {
    const updatedAlert: Alert = {
      id: editingAlert?.id || Date.now().toString(),
      name: alertName,
      type: alertType === "spikes" ? "Spikes in Conversation" : 
            alertType === "sentiment" ? "Sentiment Shift" : "Periodic Notifications",
      channels: channels.filter(c => c.included).map(c => c.name.toLowerCase()),
      status: true,
      timeTriggered: 0,
      topic: selectedTopic,
      email: emails.join(','),
    }
    onSave(updatedAlert)
  }

  return (
    <div className="space-y-2 px-20 pt-8 overflow-y-auto">
      <div className="sticky top-0 z-10 py-4">
        <Button variant="ghost" onClick={onBack} className="hover:bg-[#E9EEEE] hover:text-[#00857C]">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="grid gap-6">
        <div className="grid grid-cols-2 gap-6">
          {/* General Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle>General Setting</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="alert-name">Alert Name</Label>
                  <Input
                    id="alert-name"
                    value={alertName}
                    onChange={(e) => setAlertName(e.target.value)}
                    className="bg-gray-50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Topic Card */}
          <Card>
            <CardHeader>
              <CardTitle>Topic</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a topic" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((topic) => (
                    <SelectItem key={topic} value={topic}>
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Email Card */}
        <Card>
          <CardHeader>
            <CardTitle>Email(s) of Notifyee(s)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[40px] bg-gray-50">
                  {emails.map((email, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-200 text-gray-700 px-2 py-1 rounded"
                    >
                      <span>{email}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                        onClick={() => removeEmail(email)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <Input
                    id="email"
                    type="email"
                    value={currentEmail}
                    onChange={(e) => setCurrentEmail(e.target.value)}
                    onKeyDown={handleEmailKeyDown}
                    className="border-none shadow-none focus-visible:ring-0 flex-1 min-w-[200px] bg-gray-50"
                    placeholder="Enter email and press Enter"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Channel Settings Card */}
        <Card className={channelsError ? "border-red-500" : ""}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Channel Settings</CardTitle>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all-channels"
                  checked={selectAllChannels}
                  onCheckedChange={toggleAllChannels}
                  className="border-2 data-[state=checked]:bg-[#00857C] data-[state=checked]:border-[#00857C] cursor-pointer"
                />
                <Label htmlFor="select-all-channels">Select All</Label>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {channels.map((channel) => (
                <div key={channel.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`channel-${channel.name}`}
                      checked={channel.included}
                      className="border-2 data-[state=checked]:bg-[#00857C] data-[state=checked]:border-[#00857C] cursor-pointer"
                      onCheckedChange={(checked) => {
                        toggleChannelInclusion(channel.name)
                        if (checked === false) {
                          setSelectAllChannels(false)
                        } else if (channels.every(ch => ch.name === channel.name || ch.included)) {
                          setSelectAllChannels(true)
                        }
                      }}
                    />
                    <Label htmlFor={`channel-${channel.name}`}>{channel.name}</Label>
                  </div>
                  <ChannerlManage 
                    channelName={channel.name}
                    isDisabled={!channel.included}
                  />
                </div>
              ))}
            </div>
            {channelsError && (
              <p className="text-red-500 text-sm mt-2">At least one channel must be selected</p>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-5">
          <Button variant="outline" onClick={onBack} style={{ width: '160px' }}>
            Back
          </Button>
          <Button 
            onClick={handleSave} 
            className="bg-[#00857C] hover:bg-[#00857C]/90 text-white"
            style={{ width: '160px' }}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}