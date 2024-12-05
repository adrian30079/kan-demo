'use client'

import { useState } from 'react'
import { BarChart3, MessageSquare, Filter, Download, Settings, ChevronLeft, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TooltipProvider, Tooltip as UITooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { RawDataComponent } from './raw-data'
import { InspectTabComponent } from './inspect-tab'
import { WhoTab } from './who-tab'
import { WhereTabComponent } from './where-tab'
import { WhenTab } from './when-tab'
import { WhatTab } from './what-tab'
import { HowTab } from './how-tab'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { QueryFilters } from './filter'
import { DateRange } from "react-day-picker"
import CreateNewTopicContent from './create-new-topic'
import { useToast } from "@/components/ui/use-toast"

const tabItems = ['Overview', 'What', 'When', 'Who', 'Where', 'How', 'Inspect', 'Raw Data']

const chartData = [
  { date: "Apr 1", Facebook: 200, Instagram: 100, X: 100, "Online Forum": 200 },
  { date: "Apr 3", Facebook: 250, Instagram: 100, X: 150, "Online Forum": 150 },
  { date: "Apr 5", Facebook: 300, Instagram: 200, X: 300, "Online Forum": 200 },
  { date: "Apr 7", Facebook: 350, Instagram: 250, X: 300, "Online Forum": 300 },
  { date: "Apr 9", Facebook: 300, Instagram: 200, X: 300, "Online Forum": 300 },
  { date: "Apr 11", Facebook: 400, Instagram: 300, X: 300, "Online Forum": 300 },
  { date: "Apr 13", Facebook: 350, Instagram: 250, X: 300, "Online Forum": 300 },
  { date: "Apr 15", Facebook: 450, Instagram: 350, X: 300, "Online Forum": 300 },
  { date: "Apr 17", Facebook: 400, Instagram: 300, X: 300, "Online Forum": 300 },
  { date: "Apr 19", Facebook: 350, Instagram: 250, X: 300, "Online Forum": 300 },
  { date: "Apr 21", Facebook: 400, Instagram: 300, X: 300, "Online Forum": 300 },
  { date: "Apr 23", Facebook: 450, Instagram: 350, X: 300, "Online Forum": 300 },
  { date: "Apr 25", Facebook: 400, Instagram: 300, X: 300, "Online Forum": 300 },
  { date: "Apr 27", Facebook: 500, Instagram: 400, X: 300, "Online Forum": 300 },
  { date: "Apr 30", Facebook: 600, Instagram: 400, X: 300, "Online Forum": 300 },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border rounded shadow-lg">
        <p className="font-bold mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

interface TopicAnalysisProps {
  topic: Topic;
  onBack: () => void;
  isFeaturedTopic?: boolean;
}

export function TopicAnalysisComponent({ topic, onBack, isFeaturedTopic = false }: TopicAnalysisProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("Overview")
  const [timeRange, setTimeRange] = useState("7d")
  const [filterPanel, setFilterPanel] = useState({
    resultType: '',
    dateRange: undefined as DateRange | undefined,
    classifiedContent: {
      virtualAssets: false,
      encourageInvestment: false,
      encourageAccount: false,
    },
    group: 'all' as 'all' | 'wechat' | 'whatsapp',
    linkExtracted: false,
    sentiment: {
      all: true,
      positive: false,
      negative: false,
      mixed: false,
      neutral: false,
    },
  })
  const [channels] = useState<any[]>([]) // Add your channels data here
  const [pendingFilterChanges, setPendingFilterChanges] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const handleExport = () => {
    // Implement export functionality here
    console.log("Exporting data...")
  }

  const handleFilterChange = (key: string, value: any) => {
    setFilterPanel(prev => ({
      ...prev,
      [key]: value
    }))
    setPendingFilterChanges(true)
  }

  const handleApplyFilters = () => {
    // Implement your filter application logic here
    console.log("Applying filters:", filterPanel)
    setPendingFilterChanges(false)
  }

  const handleResetFilters = () => {
    // Reset filter logic here
    setFilterPanel({
      resultType: '',
      dateRange: undefined,
      classifiedContent: {
        virtualAssets: false,
        encourageInvestment: false,
        encourageAccount: false,
      },
      group: 'all',
      linkExtracted: false,
      sentiment: {
        all: true,
        positive: false,
        negative: false,
        mixed: false,
        neutral: false,
      },
    })
    setPendingFilterChanges(true)
  }

  const handleDelete = async (topicId: string) => {
    try {
      toast({
        title: "Topic Deleted",
        description: "The topic has been successfully deleted.",
        className: "bg-[#00857C] text-white",
      })
      onBack()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the topic. Please try again.",
      })
    }
  }

  return (
    <div className="space-y-6 p-6 bg-white overflow-y-auto">
      {isEditing ? (
        <CreateNewTopicContent
          onBack={() => setIsEditing(false)}
          existingTopics={[]} 
          onSave={(updatedTopic) => {
            setIsEditing(false)
          }}
          editingTopic={topic}
          onDelete={handleDelete}
          isFeaturedTopic={isFeaturedTopic}
        />
      ) : (
        <div className="space-y-6 p-6 bg-white overflow-y-auto">
          <div className="sticky top-0 bg-white z-10 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  onClick={onBack}
                  className="hover:bg-[#E9EEEE] hover:text-[#00857C]"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <h1 className="text-3xl font-bold">{topic.name}</h1>
              </div>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0" align="end">
                    <QueryFilters
                      filterPanel={filterPanel}
                      channels={channels}
                      selectAllChannels={true}
                      channelsError={false}
                      pendingFilterChanges={pendingFilterChanges}
                      onFilterChange={handleFilterChange}
                      onChannelToggle={() => {}}
                      onAllChannelsToggle={() => {}}
                      onPageToggle={() => {}}
                      onAllPagesToggle={() => {}}
                      onResetFilters={handleResetFilters}
                      onApplyFilters={handleApplyFilters}
                    />
                  </PopoverContent>
                </Popover>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsEditing(true)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit Keyword Settings</p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
          <Tabs defaultValue="Overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
              {tabItems.map((tab) => (
                <TabsTrigger key={tab} value={tab} onClick={() => setActiveTab(tab)}>{tab}</TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="Overview">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Mentions
                    </CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">45,231</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total People Talking
                    </CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">20,456</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Average Mentions Per Day
                    </CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,508</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Average People Talking Per Day
                    </CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">682</div>
                  </CardContent>
                </Card>
              </div>
              <Card className="mb-6 mt-6">
                <CardContent className="flex justify-between items-center py-4">
                  <div className="flex flex-row items-center">
                  <div className="text-sm ml-2 pr-4">Total Entities</div>
                    <div className="text-2xl font-bold">21</div>
                  </div>
                  <div className="w-px h-12 bg-gray-200" />
                  <div className="flex flex-row items-center">
                    <div className="text-sm ml-2 pr-4">Total URLs</div>
                    <div className="text-2xl font-bold">725</div>
                  </div>
                  <div className="w-px h-12 bg-gray-200" />
                  <div className="flex flex-row items-center">
                    <div>
                      <div className="flex flex-row items-center">
                        <div className="text-sm ml-2 pr-2">Total Groups</div>
                        <div className="text-2xl font-bold pr-6">321</div>
                        <div className="flex flex-row gap-4 text-sm text-muted-foreground mt-1">
                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded">
                          <img src="/img/media/WhatsApp.png" alt="WhatsApp" className="w-4 h-4" />
                          <span>WhatsApp 220</span>
                        </div>
                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded">
                          <img src="/img/media/WeChat.png" alt="WeChat" className="w-4 h-4" />
                          <span>WeChat 101</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="mt-6">
                <Card>
                  <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                    <div className="grid flex-1 gap-1 text-center sm:text-left">
                      <CardTitle>Overall Volume of Mentions</CardTitle>
                      <CardDescription>
                        Showing mentions across different platforms
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger
                          className="w-[160px] rounded-lg sm:ml-auto"
                          aria-label="Select time range"
                        >
                          <SelectValue placeholder="Last 30 days" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30d">Last 30 days</SelectItem>
                          <SelectItem value="7d">Last 7 days</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                    <div className="h-[350px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={chartData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorFacebook" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#84E1BC" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#84E1BC" stopOpacity={0.1}/>
                            </linearGradient>
                            <linearGradient id="colorInstagram" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#FFA69E" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#FFA69E" stopOpacity={0.1}/>
                            </linearGradient>
                            <linearGradient id="colorX" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#93A5CF" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#93A5CF" stopOpacity={0.1}/>
                            </linearGradient>
                            <linearGradient id="colorOnlineForum" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#FFE5B4" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#FFE5B4" stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis 
                            dataKey="date" 
                            axisLine={false}
                            tickLine={false}
                            tickMargin={10}
                            fontSize={12}
                            stroke="#94a3b8"
                          />
                          <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tickMargin={10}
                            fontSize={12}
                            stroke="#94a3b8"
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Area
                            type="monotone"
                            dataKey="Facebook"
                            stackId="1"
                            stroke="#84E1BC"
                            fill="url(#colorFacebook)"
                          />
                          <Area
                            type="monotone"
                            dataKey="Instagram"
                            stackId="1"
                            stroke="#FFA69E"
                            fill="url(#colorInstagram)"
                          />
                          <Area
                            type="monotone"
                            dataKey="X"
                            stackId="1"
                            stroke="#93A5CF"
                            fill="url(#colorX)"
                          />
                          <Area
                            type="monotone"
                            dataKey="Online Forum"
                            stackId="1"
                            stroke="#FFE5B4"
                            fill="url(#colorOnlineForum)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="Inspect" className="mt-6">
              <InspectTabComponent/>
            </TabsContent>
            <TabsContent value="What" className="mt-6">
              <WhatTab />
            </TabsContent>
            <TabsContent value="Who" className="mt-6">
              <WhoTab />
            </TabsContent>
            <TabsContent value="Where" className="mt-6">
              <WhereTabComponent />
            </TabsContent>
            <TabsContent value="When" className="mt-6">
              <WhenTab />
            </TabsContent>
            <TabsContent value="How" className="mt-6">
              <HowTab />
            </TabsContent>
            <TabsContent value="Raw Data" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Raw Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <RawDataComponent />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}