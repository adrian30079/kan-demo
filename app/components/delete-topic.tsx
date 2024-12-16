'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Info, ArrowLeft, X, AlertCircle } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"

interface KeywordGroup {
  id: string
  keywords: string[]
}

interface CreateNewTopicContentProps {
  onBack: () => void
  existingTopics: string[]
  onSave: (newTopic: Topic) => void
}

interface Channel {
  name: string
  included: boolean
  pages: { name: string; included: boolean }[]
}

interface Topic {
  id: string;
  name: string;
  keywords: string[];
  mentions: number;
  peopleTalking: number;
  engagement: string;
  sentiment: number;
  riskLevel: 'low' | 'medium' | 'high';
  period: { start: string; end: string };
}

const dummyPages = [
  "Mary's Investment Diary",
  "Tech Trends Today",
  "Eco-Friendly Living",
  "Gourmet Recipes Hub",
  "Fitness Journey Log",
  "Travel Adventures Blog",
  "DIY Home Improvement",
  "Parenting Tips & Tricks",
  "Book Lovers' Corner",
  "Local Events Spotlight"
]

export default function CreateNewTopicContent({ onBack, existingTopics, onSave }: CreateNewTopicContentProps) {
  const { toast } = useToast()
  const [topicName, setTopicName] = useState("")
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [startTime, setStartTime] = useState("00:00")
  const [endTime, setEndTime] = useState("23:59")
  const [keywordMode, setKeywordMode] = useState<"basic" | "advanced">("basic")

  // Basic mode states
  const [inclusionType, setInclusionType] = useState<"all" | "any">("all")
  const [exclusionType, setExclusionType] = useState<"all" | "any">("all")
  const [inclusionGroups, setInclusionGroups] = useState<KeywordGroup[]>([
    { id: '1', keywords: [] }
  ])
  const [exclusionGroups, setExclusionGroups] = useState<KeywordGroup[]>([
    { id: '1', keywords: [] }
  ])
  const [currentInclusionInput, setCurrentInclusionInput] = useState<Record<string, string>>({})
  const [currentExclusionInput, setCurrentExclusionInput] = useState<Record<string, string>>({})

  // Advanced mode state
  const [advancedKeywords, setAdvancedKeywords] = useState("")

  // Channel settings state
  const [channels, setChannels] = useState<Channel[]>([
    { name: 'Facebook', included: true, pages: dummyPages.map(page => ({ name: page, included: true })) },
    { name: 'Instagram', included: true, pages: dummyPages.map(page => ({ name: page, included: true })) },
    { name: 'Twitter', included: true, pages: dummyPages.map(page => ({ name: page, included: true })) },
    { name: 'Online Forums', included: true, pages: dummyPages.map(page => ({ name: page, included: true })) },
  ])

  const [openChannelDialog, setOpenChannelDialog] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Validation states
  const [topicNameError, setTopicNameError] = useState(false)
  const [keywordsError, setKeywordsError] = useState(false)
  const [channelsError, setChannelsError] = useState(false)
  const [duplicateTopicError, setDuplicateTopicError] = useState(false)

  const [selectAllChannels, setSelectAllChannels] = useState(true)

  const toggleAllChannels = (checked: boolean) => {
    setSelectAllChannels(checked)
    setChannels(prevChannels =>
      prevChannels.map(channel => ({ ...channel, included: checked }))
    )
    if (!checked) {
      setChannelsError(true)
    } else {
      setChannelsError(false)
    }
  }

  const isDuplicateKeyword = useCallback((group: KeywordGroup, newKeyword: string): boolean => {
    return group.keywords.some(keyword => keyword.toLowerCase() === newKeyword.toLowerCase())
  }, [])

  const handleKeywordInput = (
    type: 'inclusion' | 'exclusion',
    groupId: string,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key !== 'Enter') return
    e.preventDefault()

    const input = e.currentTarget
    const value = input.value.trim()
    if (!value) return

    const groups = type === 'inclusion' ? inclusionGroups : exclusionGroups
    const currentGroup = groups.find(group => group.id === groupId)

    if (currentGroup && isDuplicateKeyword(currentGroup, value)) {
      console.log('Duplicate keyword not allowed in the same group')
      return
    }

    if (type === 'inclusion') {
      setInclusionGroups(groups => 
        groups.map(group => 
          group.id === groupId
            ? { ...group, keywords: [...group.keywords, value.toLowerCase()] }
            : group
        )
      )
      setCurrentInclusionInput(prev => ({ ...prev, [groupId]: '' }))
    } else {
      setExclusionGroups(groups => 
        groups.map(group => 
          group.id === groupId
            ? { ...group, keywords: [...group.keywords, value.toLowerCase()] }
            : group
        )
      )
      setCurrentExclusionInput(prev => ({ ...prev, [groupId]: '' }))
    }
    setKeywordsError(false)
  }

  const removeKeyword = (
    type: 'inclusion' | 'exclusion',
    groupId: string,
    keywordIndex: number
  ) => {
    if (type === 'inclusion') {
      setInclusionGroups(groups =>
        groups.map(group =>
          group.id === groupId
            ? {
                ...group,
                keywords: group.keywords.filter((_, index) => index !== keywordIndex)
              }
            : group
        )
      )
    } else {
      setExclusionGroups(groups =>
        groups.map(group =>
          group.id === groupId
            ? {
                ...group,
                keywords: group.keywords.filter((_, index) => index !== keywordIndex)
              }
            : group
        )
      )
    }
  }

  const addKeywordGroup = (type: 'inclusion' | 'exclusion') => {
    const newId = Date.now().toString()
    if (type === 'inclusion') {
      setInclusionGroups(prev => [...prev, { id: newId, keywords: [] }])
    } else {
      setExclusionGroups(prev => [...prev, { id: newId, keywords: [] }])
    }
  }

  const removeKeywordGroup = (type: 'inclusion' | 'exclusion', groupId: string) => {
    if (type === 'inclusion') {
      setInclusionGroups(prev => prev.filter(group => group.id !== groupId))
    } else {
      setExclusionGroups(prev => prev.filter(group => group.id !== groupId))
    }
  }

  const generateKeywordPreview = () => {
    if (keywordMode === 'advanced') return { preview: advancedKeywords, changed: false }

    const inclusionOperator = inclusionType === 'all' ? ' AND ' : ' OR '
    const exclusionOperator = exclusionType === 'all' ? ' AND ' : ' OR '
    
    const inclusionString = inclusionGroups
      .map(group => {
        if (group.keywords.length === 0) return null
        const keywordsString = group.keywords
          .map(k => `"${k}"`)
          .join(' OR ')
        return `(${keywordsString})`
      })
      .filter(Boolean)
      .join(inclusionOperator)
    
    const exclusionString = exclusionGroups
      .map(group => {
        if (group.keywords.length === 0) return null
        const keywordsString = group.keywords
          .map(k => `"${k}"`)
          .join(' OR ')
        return `NOT (${keywordsString})`
      })
      .filter(Boolean)
      .join(exclusionOperator)

    const preview = [inclusionString, exclusionString].filter(Boolean).join(' AND ')
    return { preview, changed: preview !== advancedKeywords }
  }

  const getKeywordCount = (type: 'inclusion' | 'exclusion') => {
    const groups = type === 'inclusion' ? inclusionGroups : exclusionGroups
    return groups.reduce((sum, group) => sum + group.keywords.length, 0)
  }

  const translateBasicToAdvanced = () => {
    const query = generateKeywordPreview().preview
    setAdvancedKeywords(query)
  }

  const translateAdvancedToBasic = () => {
    const query = advancedKeywords.trim()
    if (!query) return

    const inclusionGroups: KeywordGroup[] = []
    const exclusionGroups: KeywordGroup[] = []
    let currentType: 'inclusion' | 'exclusion' = 'inclusion'
    let currentGroup: string[] = []

    const addGroup = (type: 'inclusion' | 'exclusion', keywords: string[]) => {
      if (keywords.length > 0) {
        const group = { id: Date.now().toString(), keywords }
        if (type === 'inclusion') {
          inclusionGroups.push(group)
        } else {
          exclusionGroups.push(group)
        }
      }
    }

    query.split(/\s+/).forEach(token => {
      if (token.toUpperCase() === 'AND' || token.toUpperCase() === 'OR') {
        addGroup(currentType, currentGroup)
        currentGroup = []
      } else if (token.toUpperCase() === 'NOT') {
        addGroup(currentType, currentGroup)
        currentGroup = []
        currentType = 'exclusion'
      } else {
        // Remove surrounding quotes and parentheses
        const cleanToken = token.replace(/^[("]|[)"]$/g, '')
        if (cleanToken) {
          currentGroup.push(cleanToken.toLowerCase())
        }
      }
    })

    addGroup(currentType, currentGroup)

    setInclusionGroups(inclusionGroups.length > 0 ? inclusionGroups : [{ id: '1', keywords: [] }])
    setExclusionGroups(exclusionGroups.length > 0 ? exclusionGroups : [{ id: '1', keywords: [] }])
    setInclusionType(query.includes(' AND ') ? 'all' : 'any')
    setExclusionType(query.includes(' AND NOT ') ? 'all' : 'any')
  }

  useEffect(() => {
    if (keywordMode === 'advanced') {
      translateBasicToAdvanced()
    } else {
      translateAdvancedToBasic()
    }
  }, [keywordMode])

  useEffect(() => {
    if (keywordMode === 'basic') {
      const { preview, changed } = generateKeywordPreview()
      if (changed) {
        setAdvancedKeywords(preview)
      }
    }
  }, [inclusionGroups, exclusionGroups, inclusionType, exclusionType])

  const toggleChannelInclusion = (channelName: string) => {
    setChannels(prevChannels =>
      prevChannels.map(channel =>
        channel.name === channelName
          ? { ...channel, included: !channel.included }
          : channel
      )
    )
    setChannelsError(false)
    
    // Update selectAllChannels state
    const updatedChannels = channels.map(channel =>
      channel.name === channelName ? { ...channel, included: !channel.included } : channel
    )
    setSelectAllChannels(updatedChannels.every(channel => channel.included))
  }

  const togglePageInclusion = (channelName: string, pageName: string) => {
    setChannels(prevChannels =>
      prevChannels.map(channel =>
        channel.name === channelName
          ? {
              ...channel,
              pages: channel.pages.map(page =>
                page.name === pageName
                  ? { ...page, included: !page.included }
                  : page
              )
            }
          : channel
      )
    )
  }

  const toggleAllPages = (channelName: string, included: boolean) => {
    setChannels(prevChannels =>
      prevChannels.map(channel =>
        channel.name === channelName
          ? {
              ...channel,
              pages: channel.pages.map(page => ({ ...page, included }))
            }
          : channel
      )
    )
  }

  const validateForm = () => {
    let isValid = true
    const errors: string[] = []

    if (!topicName.trim()) {
      setTopicNameError(true)
      isValid = false
      errors.push("Topic name is required")
    } else {
      setTopicNameError(false)
    }

    if (existingTopics.includes(topicName.trim())) {
      setDuplicateTopicError(true)
      isValid = false
      errors.push("A topic with this name already exists")
    } else {
      setDuplicateTopicError(false)
    }

    const hasInclusionKeywords = inclusionGroups.some(group => group.keywords.length > 0)
    if (!hasInclusionKeywords && !advancedKeywords.trim()) {
      setKeywordsError(true)
      isValid = false
      errors.push("At least one inclusion keyword is required")
    } else {
      setKeywordsError(false)
    }

    const hasSelectedChannel = channels.some(channel => channel.included)
    if (!hasSelectedChannel) {
      setChannelsError(true)
      isValid = false
      errors.push("At least one channel must be selected")
    } else {
      setChannelsError(false)
    }

    return { isValid, errors }
  }

  const handleSave = () => {
    const { isValid, errors } = validateForm()
    if (isValid) {
      const newTopic: Topic = {
        id: Date.now().toString(),
        name: topicName,
        keywords: keywordMode === 'basic' 
          ? inclusionGroups.flatMap(group => group.keywords)
          : advancedKeywords.split(/\s+/),
        mentions: 0,
        peopleTalking: 0,
        engagement: '0',
        sentiment: 0,
        riskLevel: 'low',
        period: { 
          start: `${startDate} ${startTime}`, 
          end: `${endDate} ${endTime}` 
        },
      }
      onSave(newTopic)
      toast({
        title: "Topic Saved",
        description: "Your new topic has been created successfully.",
      })
    } else {
      console.log("Form validation failed")
      toast({
        variant: "destructive",
        title: "Error",
        description: (
          <ul className="list-disc pl-4">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        ),
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={onBack} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="grid gap-6">
        {/* General Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle>General Setting</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="topic-name">Topic Name</Label>
                <Input
                  id="topic-name"
                  value={topicName}
                  onChange={(e) => {
                    setTopicName(e.target.value)
                    setTopicNameError(false)
                    setDuplicateTopicError(false)
                  }}
                  placeholder="Enter topic name"
                  className={topicNameError ? "border-red-500" : ""}
                />
                {topicNameError && (
                  <p className="text-red-500 text-sm">Topic name is required</p>
                )}
                {duplicateTopicError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      A topic with this name already exists. Please choose a different name.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              
              <div className="space-y-4">
                <Label>Data Collection Period</Label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <div className="flex gap-2">
                      <Input
                        id="start-date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                      <Input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-24"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <div className="flex gap-2">
                      <Input
                        id="end-date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                      <Input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-24"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Keyword Configuration Card */}
        <Card className={keywordsError ? "border-red-500" : ""}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Keyword Configuration</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Define your search criteria using keywords and operators</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
              <div className="space-y-6">
                <div className="flex gap-4 border-b mb-6">
                  <Button
                    variant={keywordMode === "basic" ? "default" : "ghost"}
                    className="relative rounded-none px-4 py-2"
                    onClick={() => setKeywordMode("basic")}
                  >
                    Basic Mode
                    {keywordMode === "basic" && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                  </Button>
                  <Button
                    variant={keywordMode === "advanced" ? "default" : "ghost"}
                    className="relative rounded-none px-4 py-2"
                    onClick={() => setKeywordMode("advanced")}
                  >
                    Advanced Mode
                    {keywordMode === "advanced" && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                  </Button>
                </div>

                {keywordMode === "basic" ? (
                  <div className="space-y-6">
                    {/* Inclusion Keywords */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2 text-base font-medium">
                          Inclusion
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Specify keywords that must appear in the content</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <span className="text-sm text-muted-foreground">
                          {getKeywordCount('inclusion')}/100
                        </span>
                      </div>
                      <RadioGroup
                        value={inclusionType}
                        onValueChange={(value) => setInclusionType(value as "all" | "any")}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="all" id="inclusion-all" />
                          <Label htmlFor="inclusion-all">All of the following</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="any" id="inclusion-any" />
                          <Label htmlFor="inclusion-any">Any of the following</Label>
                        </div>
                      </RadioGroup>
                      <div className="space-y-2">
                        {inclusionGroups.map((group, groupIndex) => (
                          <div key={group.id} className="space-y-2">
                            <div className="flex gap-2">
                              <span className="text-sm text-muted-foreground w-6 pt-2">
                                {groupIndex + 1}:
                              </span>
                              <div className="flex-1">
                                <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[40px]">
                                  {group.keywords.map((keyword, keywordIndex) => (
                                    <div
                                      key={keywordIndex}
                                      className="flex items-center bg-muted text-muted-foreground px-2 py-1"
                                    >
                                      <span>{keyword}</span>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                                        onClick={() => removeKeyword('inclusion', group.id, keywordIndex)}
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ))}
                                  <Input
                                    value={currentInclusionInput[group.id] || ''}
                                    onChange={(e) => setCurrentInclusionInput((prev) => ({
                                        ...prev,
                                        [group.id]: e.target.value,
                                      }))
                                    }
                                    onKeyDown={(e) => handleKeywordInput('inclusion', group.id, e)}
                                    className="border-none shadow-none focus-visible:ring-0 flex-1 min-w-[200px]"
                                    placeholder="Enter OR combinations here; press 'Enter' to split"
                                  />
                                </div>
                              </div>
                              {groupIndex > 0 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeKeywordGroup('inclusion', group.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          onClick={() => addKeywordGroup('inclusion')}
                          className="w-full"
                        >
                          Add Keyword Group
                        </Button>
                      </div>
                    </div>

                    {/* Exclusion Keywords */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2 text-base font-medium">
                          Exclusion
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Specify keywords that must not appear in the content</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <span className="text-sm text-muted-foreground">
                          {getKeywordCount('exclusion')}/100
                        </span>
                      </div>
                      <RadioGroup
                        value={exclusionType}
                        onValueChange={(value) => setExclusionType(value as "all" | "any")}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="all" id="exclusion-all" />
                          <Label htmlFor="exclusion-all">All of the following</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="any" id="exclusion-any" />
                          <Label htmlFor="exclusion-any">Any of the following</Label>
                        </div>
                      </RadioGroup>
                      <div className="space-y-2">
                        {exclusionGroups.map((group, groupIndex) => (
                          <div key={group.id} className="space-y-2">
                            <div className="flex gap-2">
                              <span className="text-sm text-muted-foreground w-6 pt-2">
                                {groupIndex + 1}:
                              </span>
                              <div className="flex-1">
                                <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[40px]">
                                  {group.keywords.map((keyword, keywordIndex) => (
                                    <div
                                      key={keywordIndex}
                                      className="flex items-center bg-muted text-muted-foreground px-2 py-1"
                                    >
                                      <span>{keyword}</span>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                                        onClick={() => removeKeyword('exclusion', group.id, keywordIndex)}
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ))}
                                  <Input
                                    value={currentExclusionInput[group.id] || ''}
                                    onChange={(e) =>
                                      setCurrentExclusionInput((prev) => ({
                                        ...prev,
                                        [group.id]: e.target.value,
                                      }))
                                    }
                                    onKeyDown={(e) => handleKeywordInput('exclusion', group.id, e)}
                                    className="border-none shadow-none focus-visible:ring-0 flex-1 min-w-[200px]"
                                    placeholder="Enter OR combinations here; press 'Enter' to split"
                                  />
                                </div>
                              </div>
                              {groupIndex > 0 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeKeywordGroup('exclusion', group.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          onClick={() => addKeywordGroup('exclusion')}
                          className="w-full"
                        >
                          Add Keyword Group
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Label htmlFor="advanced-keywords" className="text-base font-medium">Advanced Query Syntax</Label>
                    <Textarea
                      id="advanced-keywords"
                      value={advancedKeywords}
                      onChange={(e) => {
                        setAdvancedKeywords(e.target.value)
                        setKeywordsError(false)
                      }}
                      placeholder="Enter your query using boolean operators (AND, OR, NOT) and parentheses for grouping. Example: (climate AND (change OR crisis)) NOT (political OR economic)"
                      rows={10}
                      className="font-mono text-sm"
                    />
                    <p className="text-sm text-muted-foreground">
                      Use AND, OR, NOT operators and parentheses () for complex queries. Enclose exact phrases in quotation marks.
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Keyword Preview</h4>
                  <div className="p-4 border rounded-md min-h-[100px] text-sm bg-muted font-mono">
                    {generateKeywordPreview().preview}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Keyword Settings Guide</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>1. <strong>All of the following:</strong> Content must include all specified keyword groups. Each group uses OR logic internally.</p>
                    <p>2. <strong>Any of the following:</strong> Content must include at least one of the specified keyword groups. Each group uses AND logic internally.</p>
                  </div>
                </div>
              </div>
            </div>
            {keywordsError && (
              <p className="text-red-500 text-sm mt-2">At least one inclusion keyword is required</p>
            )}
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
                  <Dialog open={openChannelDialog === channel.name} onOpenChange={(isOpen) => setOpenChannelDialog(isOpen ? channel.name : null)}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" disabled={!channel.included}>
                        Manage Pages
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Manage {channel.name} Pages</DialogTitle>
                        <DialogDescription>
                          Select specific pages to include or exclude.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`selectAll-${channel.name}`}
                            checked={channel.pages.every(page => page.included)}
                            onCheckedChange={(checked) => toggleAllPages(channel.name, checked as boolean)}
                          />
                          <Label htmlFor={`selectAll-${channel.name}`}>Select All</Label>
                        </div>
                      </div>
                      <Command>
                        <CommandInput placeholder="Search pages..." />
                        <CommandList>
                          <CommandEmpty>No pages found.</CommandEmpty>
                          <CommandGroup>
                            {channel.pages.map((page) => (
                              <CommandItem key={page.name}>
                                <Checkbox
                                  id={`page-${channel.name}-${page.name}`}
                                  checked={page.included}
                                  onCheckedChange={() => togglePageInclusion(channel.name, page.name)}
                                />
                                <Label htmlFor={`page-${channel.name}-${page.name}`} className="ml-2">
                                  {page.name}
                                </Label>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            </div>
            {channelsError && (
              <p className="text-red-500 text-sm mt-2">At least one channel must be selected</p>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </div>
  )
}