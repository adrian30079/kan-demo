'use client'

import { useState } from 'react'
import { BarChart3, MessageSquare, Filter, DownloadIcon, Download, Settings, ChevronLeft, ArrowLeft, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Line, LineChart } from "recharts"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TooltipProvider, Tooltip as UITooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { RawDataComponent } from './raw-data'
import { InspectTabComponent } from './inspect-tab'
import { WhoTab } from './who-tab'
import { WhereTabComponent } from './where-tab'
import { WhenTab } from './when-tab'
import { WhatTab } from './what-tab'
import { HowTab } from './how-tab'
import { QueryFilters } from './filter'
import { DateRange } from "react-day-picker"
import CreateNewTopicContent from './create-new-topic'
import { useToast } from "@/components/ui/use-toast"
import { TableOverlayNoLimit } from './table-overlay'
import { Topic } from '@/types/index'

const tabItems = ['Overview', 'What', 'When', 'Who', 'Where', 'How', 'Inspect', 'Raw Data']

const chartData = [
  { date: "Mon", Facebook: 8500, Instagram: 4020, X: 2103, "Online Forum": 1004 },
  { date: "Tue", Facebook: 7450, Instagram: 4150, X: 2130, "Online Forum": 1520 },
  { date: "Wed", Facebook: 9020, Instagram: 5200, X: 1480, "Online Forum": 920 },
  { date: "Thu", Facebook: 8540, Instagram: 4540, X: 2020, "Online Forum": 1650 },
  { date: "Fri", Facebook: 9530, Instagram: 5450, X: 1290, "Online Forum": 1870 },
  { date: "Sat", Facebook: 12000, Instagram: 6030, X: 3700, "Online Forum": 1880 },
  { date: "Sun", Facebook: 9240, Instagram: 5230, X: 2580, "Online Forum": 1760 }
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

type ChartDataPoint = {
  date: string;
  Facebook: number;
  Instagram: number;
  X: number;
  "Online Forum": number;
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
  const [showFilters, setShowFilters] = useState(true)
  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);

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
    console.log("Applying filters:", filterPanel)
    setPendingFilterChanges(false)
  }

  const handleResetFilters = () => {
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

  const handleChartClick = (data: ChartDataPoint) => {
    setSelectedData(data);
    setShowOverlay(true);
  };

  return (
    <div className="flex">
      <div className="flex-1 space-y-6 p-6 mx-12 overflow-y-auto">
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
          <div className="space-y-6">
            <div className="sticky top-0 z-10 py-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    onClick={onBack}
                    className="hover:bg-[#E9EEEE] hover:text-[#00857C]"
                  >
                    <ChevronLeft className="h-4 w-3 mr-1" />
                    Back
                  </Button>
                  <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold text-[#00857C]">{topic.name}</h1>
                    <p className="text-xs text-gray-500">From 1 Apr 2024 to 20 Apr 2024</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant={showFilters ? "default" : "outline"} 
                    onClick={() => setShowFilters(!showFilters)}
                    className={showFilters ? "bg-[#00857C] text-white hover:bg-[#00857C]/90" : ""}
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
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
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-[#F3F6F7]">
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="hover:border-[#00857C] hover:text-[#00857C]">
                            <DownloadIcon className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>Download as PNG</DropdownMenuItem>
                          <DropdownMenuItem>Download as CSV</DropdownMenuItem>
                          </DropdownMenuContent>
                      </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                      <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={chartData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            onClick={(data) => {
                              if (data && data.activePayload) {
                                const clickedPoint = data.activePayload[0].payload as ChartDataPoint;
                                handleChartClick(clickedPoint);
                              }
                            }}
                          >
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
                            <Line
                              type="monotone"
                              dataKey="Facebook"
                              stroke="#0A83C4"
                              strokeWidth={2}
                              style={{ cursor: 'pointer' }}
                              activeDot={{ r: 8, style: { cursor: 'pointer' } }}
                            />
                            <Line
                              type="monotone"
                              dataKey="Instagram"
                              stroke="#E3559C"
                              strokeWidth={2}
                              style={{ cursor: 'pointer' }}
                              activeDot={{ r: 8, style: { cursor: 'pointer' } }}
                            />
                            <Line
                              type="monotone"
                              dataKey="X"
                              stroke="#725ACC"
                              strokeWidth={2}
                              style={{ cursor: 'pointer' }}
                              activeDot={{ r: 8, style: { cursor: 'pointer' } }}
                            />
                            <Line
                              type="monotone"
                              dataKey="Online Forum"
                              stroke="#00B1A5"
                              strokeWidth={2}
                              style={{ cursor: 'pointer' }}
                              activeDot={{ r: 8, style: { cursor: 'pointer' } }}
                            />
                          </LineChart>
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

      {showFilters && (
        <Card className="h-fill w-[260px] border bg-white rounded-none relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={() => setShowFilters(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Filters</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      )}

      {showOverlay && (
        <TableOverlayNoLimit
          onClose={() => setShowOverlay(false)}
          selectedRow={selectedData}
        />
      )}
    </div>
  )
}