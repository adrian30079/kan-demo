import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Topic } from '@/types/topic'
import { Pin, MoreVertical, MessageSquare, Users2, BarChart3, Activity, ThumbsUp } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { CollapsibleContent } from "@/components/ui/collapsible"
import { useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { CustomPieChart, SENTIMENT_COLORS } from "@/components/ui/pie-chart"

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
  const calculateSentimentData = (sentiment: number) => {
    // Convert sentiment score (0-10) to percentages
    const positive = sentiment * 8 // Main sentiment score as percentage
    const negative = Math.max(0, Math.min(12, 100 - positive)) // 0-15% negative
    const neutral = Math.max(0, Math.min(25, 100 - positive - negative)) // 0-10% neutral
    const mixed = Math.max(0, 100 - positive - negative - neutral) // Remaining is mixed
    
    return [
      { name: "Positive", value: positive },
      { name: "Negative", value: negative },
      { name: "Neutral", value: neutral },
      { name: "Mixed", value: mixed }
    ]
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

  const sentimentProps = calculateSentimentData(topic.sentiment)
  const circumference = 2 * Math.PI * 45 // 45 is the radius

  return (
    <Card key={topic.id} className="mb-6 shadow-none border border-gray-200 rounded-none p-6">
      <CardHeader className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-3">
            <CardTitle className="text-3xl font-bold">{topic.name}</CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Period: <span className="bg-gray-100 rounded-full px-2 py-1 italic">{topic.period.start}</span> to{" "}
              <span className="bg-gray-100 rounded-full px-2 py-1 italic">{topic.period.end}</span>
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="secondary" 
              className="bg-[#00857C] text-white hover:bg-[#00857C]/90"
              onClick={() => onViewDetailedAnalysis(topic)}
            >
              Analysis
              <MoreVertical className="h-4 w-4 ml-2" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => onPinTopic(topic.id)}
              className={`${
                isPinned ? 'text-[#00857C]' : 'text-gray-400'
              } hover:text-[#00857C] bg-gray-100 h-10 w-10 p-0`}
            >
              <Pin className={`h-4 w-4 ${isPinned ? 'rotate-45' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex gap-6 h-[280px]">
          {/* Left Column - Metrics - Adjusted height calculation to account for gaps */}
          <div className="flex flex-col gap-2 w-[15%] h-full">
            <Card className="h-[calc((280px-16px)/3)] border border-[#00857C] rounded-none shadow-none">
              <div className="bg-[#00857C] px-4 py-2 h-[40px]">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-white" />
                  <span className="text-sm font-medium text-white">Total Mentions</span>
                </div>
              </div>
              <div className="h-[calc(100%-40px)] p-4 flex items-center justify-center">
                <p className="text-xl font-bold text-gray-900">{topic.mentions.toLocaleString()}</p>
              </div>
            </Card>

            <Card className="h-[calc((280px-16px)/3)] border border-[#00857C] rounded-none shadow-none">
              <div className="bg-[#00857C] px-4 py-2 h-[40px]">
                <div className="flex items-center gap-2">
                  <Users2 className="h-4 w-4 text-white" />
                  <span className="text-sm font-medium text-white">People Talking</span>
                </div>
              </div>
              <div className="h-[calc(100%-40px)] p-4 flex items-center justify-center">
                <p className="text-xl font-bold text-gray-900">{topic.peopleTalking.toLocaleString()}</p>
              </div>
            </Card>

            <Card className="h-[calc((280px-16px)/3)] border border-[#00857C] rounded-none shadow-none">
              <div className="bg-[#00857C] px-4 py-2 h-[40px]">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-white" />
                  <span className="text-sm font-medium text-white">Engagement</span>
                </div>
              </div>
              <div className="h-[calc(100%-40px)] p-4 flex items-center justify-center">
                <p className="text-xl font-bold text-gray-900">{topic.engagement}</p>
              </div>
            </Card>
          </div>

          {/* Middle Column - Sentiment Analysis */}
          <Card className="border border-[#00857C] rounded-none w-[25%] h-full shadow-none">
            <div className="bg-[#00857C] px-4 py-2 h-[40px]">
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-4 w-4 text-white" />
                <span className="text-sm font-medium text-white">Public Sentiment</span>
              </div>
            </div>
            <div className="h-[calc(100%-40px)] p-2">
              <CustomPieChart 
                data={calculateSentimentData(topic.sentiment)} 
                showLabels={false}
                interactive={true}
                size="large"
              />
            </div>
          </Card>

          {/* Right Column - Share of Voice Chart */}
          <Card className="border border-[#00857C] rounded-none flex-1 h-full shadow-none">
            <div className="bg-[#00857C] px-4 py-2 h-[40px]">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-white" />
                <span className="text-sm font-medium text-white">Overall Share of Voice</span>
              </div>
            </div>
            <div className="h-[calc(100%-40px)] p-4 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={shareOfVoiceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#6B7280"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#6B7280"
                    fontSize={12}
                  />
                  <RechartsTooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '6px',
                      padding: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#00857C"
                    fill="#00857C"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Collapsible Content */}
        <CollapsibleContent>
          <div className="space-y-6 pt-4">
            <h3 className="text-lg font-semibold">Trend Analysis</h3>
            <div className="h-[200px] w-full rounded-lg bg-gray-100 flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-gray-400" />
              <span className="ml-2 text-gray-500">Detailed trend chart placeholder</span>
            </div>
            <Button onClick={() => onViewDetailedAnalysis(topic)} className="mt-4">
              View Detailed Analysis
            </Button>
          </div>
        </CollapsibleContent>
      </CardContent>
    </Card>
  )
} 