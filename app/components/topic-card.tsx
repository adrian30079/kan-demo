import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Topic } from '@/types/topic'
import { Pin, MoreVertical, MessageSquare, Users2, BarChart3, Activity, ThumbsUp } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts'
import { CollapsibleContent } from "@/components/ui/collapsible"
import { useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface TopicCardProps {
  topic: Topic
  isPinned: boolean
  isFeatured: boolean
  onDuplicate: (topic: Topic) => void
  onViewDetailedAnalysis: (topic: Topic) => void
  onAddForComparison: (topic: Topic) => void
  onPinTopic: (topicId: string) => void
  onEmojiChange: (topic: Topic, emoji: string) => void
  onImageChange: (topic: Topic, imageUrl: string) => void
  onEdit?: (topic: Topic) => void
  onDelete?: (topicId: string) => void
}

export function TopicCard({
  topic,
  isPinned,
  isFeatured,
  onDuplicate,
  onViewDetailedAnalysis,
  onAddForComparison,
  onPinTopic,
  onEmojiChange,
  onImageChange,
  onEdit,
  onDelete
}: TopicCardProps) {
  // Sample data for the Share of Voice chart
  const shareOfVoiceData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
  ]

  // Calculate sentiment proportions
  const calculateSentimentProportions = (sentiment: number) => {
    // Convert sentiment score (0-10) to percentages
    const positive = sentiment * 8 // Main sentiment score as percentage
    const negative = Math.max(0, Math.min(12, 100 - positive)) // 0-15% negative
    const neutral = Math.max(0, Math.min(25, 100 - positive - negative)) // 0-10% neutral
    const mixed = Math.max(0, 100 - positive - negative - neutral) // Remaining is mixed
    
    return {
      positive,
      negative,
      neutral,
      mixed,
      total: positive + negative + neutral + mixed
    }
  }

  // Get stroke colors based on sentiment type
  const getSentimentColor = (type: 'positive' | 'negative' | 'neutral' | 'mixed') => {
    switch (type) {
      case 'positive':
        return '#22C55E' // green
      case 'negative':
        return '#EF4444' // red
      case 'neutral':
        return '#9CA3AF' // grey
      case 'mixed':
        return '#FCD34D' // yellow
      default:
        return '#E5E7EB' // light gray
    }
  }

  const sentimentProps = calculateSentimentProportions(topic.sentiment)
  const circumference = 2 * Math.PI * 45 // 45 is the radius

  return (
    <Card key={topic.id} className="mb-4 p-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* <TopicEmoji
              currentEmoji={topic.emoji}
              currentImage={topic.imageUrl}
              onEmojiChange={(emoji) => onEmojiChange(topic, emoji)}
              onImageChange={(imageUrl) => onImageChange(topic, imageUrl)}
            /> */}
            <CardTitle className="text-2xl">{topic.name}</CardTitle>
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="bg-[#00857C] text-white hover:bg-[#00857C]/90"
                >
                  Actions
                  <MoreVertical className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={() => onViewDetailedAnalysis(topic)} 
                  className="hover:cursor-pointer"
                >
                  View Analysis
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onAddForComparison(topic)} 
                  className="hover:cursor-pointer"
                >
                  Add to Comparison
                </DropdownMenuItem>
                {isFeatured ? (
                  <DropdownMenuItem 
                    onClick={() => onDuplicate(topic)} 
                    className="hover:cursor-pointer"
                  >
                    Duplicate to Own
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem 
                    onClick={() => onEdit?.(topic)} 
                    className="hover:cursor-pointer"
                  >
                    Edit/Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPinTopic(topic.id)}
              className={`${
                isPinned ? 'text-[#00857C]' : 'text-gray-400'
              } hover:text-[#00857C] bg-gray-100 rounded p-1 px-2`}
            >
              <Pin className={`h-4 w-4 ${isPinned ? 'rotate-45' : ''}`} />
            </Button>
          </div>
        </div>
        <CardDescription>
          Period: <span className="bg-gray-100 rounded-full px-2 py-1 italic">{topic.period.start}</span> to <span className="bg-gray-100 rounded-full px-2 py-1 italic">{topic.period.end}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Total Mentions</span>
            </div>
            <p className="text-2xl font-bold">{topic.mentions.toLocaleString()}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users2 className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">People Talking</span>
            </div>
            <p className="text-2xl font-bold">{topic.peopleTalking.toLocaleString()}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Engagement</span>
            </div>
            <p className="text-2xl font-bold">{topic.engagement}</p>
          </div>
          <div className="space-y-2">
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ThumbsUp className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Public Sentiment</span>
            </div>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <div className="relative h-24 w-24">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">+{topic.sentiment}</span>
                    </div>
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle
                        className="stroke-gray-200"
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        strokeWidth="10"
                      />
                      {/* Positive sentiment (green) */}
                      <circle
                        className="transition-all duration-300"
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        strokeWidth="10"
                        stroke={getSentimentColor('positive')}
                        strokeDasharray={`${(sentimentProps.positive / 100) * circumference} ${circumference}`}
                        strokeDashoffset="0"
                      />
                      {/* Negative sentiment (red) */}
                      <circle
                        className="transition-all duration-300"
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        strokeWidth="10"
                        stroke={getSentimentColor('negative')}
                        strokeDasharray={`${(sentimentProps.negative / 100) * circumference} ${circumference}`}
                        strokeDashoffset={`${-((sentimentProps.positive / 100) * circumference)}`}
                      />
                      {/* Neutral sentiment (grey) */}
                      <circle
                        className="transition-all duration-300"
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        strokeWidth="10"
                        stroke={getSentimentColor('neutral')}
                        strokeDasharray={`${(sentimentProps.neutral / 100) * circumference} ${circumference}`}
                        strokeDashoffset={`${-((sentimentProps.positive + sentimentProps.negative) / 100 * circumference)}`}
                      />
                      {/* Mixed sentiment (yellow) */}
                      <circle
                        className="transition-all duration-300"
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        strokeWidth="10"
                        stroke={getSentimentColor('mixed')}
                        strokeDasharray={`${(sentimentProps.mixed / 100) * circumference} ${circumference}`}
                        strokeDashoffset={`${-((sentimentProps.positive + sentimentProps.negative + sentimentProps.neutral) / 100 * circumference)}`}
                      />
                    </svg>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-white p-2 rounded shadow-md text-black">
                  <div className="text-sm">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: getSentimentColor('positive') }} />
                      <span>Pos: {sentimentProps.positive.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: getSentimentColor('negative') }} />
                      <span>Neg: {sentimentProps.negative.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: getSentimentColor('neutral') }} />
                      <span>Neu: {sentimentProps.neutral.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: getSentimentColor('mixed') }} />
                      <span>Mix: {sentimentProps.mixed.toFixed(1)}%</span>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Share of Voice Chart */}
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold">Overall Share of Voice</h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={shareOfVoiceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Collapsible Content */}
        <CollapsibleContent>
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">Trend Analysis</h3>
            <div className="h-[200px] w-full rounded-lg bg-gray-100 flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-gray-400" />
              <span className="ml-2 text-gray-500">Detailed trend chart placeholder</span>
            </div>
            <Button onClick={() => onViewDetailedAnalysis(topic)}>
              View Detailed Analysis
            </Button>
          </div>
        </CollapsibleContent>
      </CardContent>
    </Card>
  )
} 