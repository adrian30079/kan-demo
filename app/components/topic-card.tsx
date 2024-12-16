import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Topic } from '@/types/topic'
import { Pin, MoreVertical, MessageSquare, Users2, BarChart3, Activity, ThumbsUp } from 'lucide-react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart,
  Bar
} from 'recharts'
import { CollapsibleContent } from "@/components/ui/collapsible"
import { useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { CustomPieChart, SENTIMENT_COLORS } from "@/components/ui/pie-chart"
import ownManagementData from '@/data/own-management.json';
import { BarChartTemplate } from "@/components/chart/bar-chart-template"

// Update the variant type
type TopicCardVariant = 'default' | 'comparison';

// Add type definition for sentiment
type Sentiment = {
  positive: number;
  negative: number;
  neutral: number;
  mixed: number;
}

interface TopicCardProps {
  variant?: TopicCardVariant;
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
  variant = 'default',
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
    { name: '11/24', value: 2500 },
    { name: '11/25', value: 4800 },
    { name: '11/26', value: 1200 },
    { name: '11/27', value: 3900 },
    { name: '11/28', value: 800 },
    { name: '11/29', value: 5200 },
    { name: '11/30', value: 2100 },
  ]

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
  const circumference = 2 * Math.PI * 45 // 45 is the radius

  // Inside the TopicCard component, before rendering the CustomPieChart
  const sentimentData = [
    { name: 'positive', value: 35 },
    { name: 'negative', value: 25 },
    { name: 'neutral', value: 20 },
    { name: 'mixed', value: 20 }
  ];

  console.log('Hardcoded Sentiment Data:', sentimentData);

  // First, add the colors array at the top of your component or outside
  const colors = ['#00B1A5', '#0070AC', '#593FB6', '#DA418E', '#E66A22', '#00857C', '#26A69A']

  // First, let's transform the data to be grouped by date
  const transformedData = [0, 1, 2, 3, 4, 5, 6].map((dateIndex) => {
    const date = `11/${24 + dateIndex}`;
    const dataPoint = {
      date,
      ...Object.fromEntries(
        ownManagementData.management.map(manager => [
          manager.managementName,
          manager.mentions[dateIndex].value
        ])
      )
    };
    return dataPoint;
  });

  // Only modify the render logic based on variant
  if (variant === 'comparison') {
    return (
      <Card className="mb-6 shadow-none border border-gray-200 rounded-none p-6">
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
                onClick={() => onViewDetailedAnalysis({
                  ...topic,
                  variant: 'comparison'
                })}
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
            {/* Left Column - Metrics */}
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

            {/* Right Column - Bar Chart */}
            <Card className="border border-[#00857C] rounded-none flex-1 h-full shadow-none">
              <div className="bg-[#00857C] px-4 py-2 h-[40px]">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-white" />
                  <span className="text-sm font-medium text-white">Executive Mentions</span>
                </div>
              </div>
              <div className="h-[calc(100%-40px)] p-4 flex items-center justify-center">
                <BarChartTemplate
                  data={transformedData}
                  dataKey={ownManagementData.management.map(manager => manager.managementName)}
                  categoryKey="date"
                  layout="horizontal"
                  type="grouped"
                  height="100%"
                  width="100%"
                  yAxisWidth={120}
                />
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Return default variant (existing implementation)
  return (
    <Card className="mb-6 shadow-none border border-gray-200 rounded-none p-6">
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
            <div className="h-[calc(100%-40px)] p-2 flex items-center justify-center" style={{ minHeight: "200px" }}>
              <CustomPieChart 
                data={sentimentData}
                showLabels={false}
                interactive={true}
                size="large"
                width="100%"
                height="100%"
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