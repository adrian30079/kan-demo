'use client'

import { useState } from 'react'
import { BarChart3, MessageSquare, Filter, DownloadIcon, Download, Settings, ChevronLeft, ArrowLeft, X, Users2, Building2, Link, MessageCircle, MoreVertical } from 'lucide-react'
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
import { AnalyticsCard } from './analytics-card'

const tabItems = ['What', 'When', 'Who', 'Where', 'How', 'Inspect', 'Raw Data']

interface TopicAnalysisProps {
  topic: Topic;
  onBack: () => void;
  isFeaturedTopic?: boolean;
  variant?: 'default' | 'comparison';
}

type ChartDataPoint = {
  date: string;
  Facebook: number;
  Instagram: number;
  X: number;
  "Online Forum": number;
}

export function TopicAnalysisComponent({ topic, onBack, isFeaturedTopic = false, variant = 'default' }: TopicAnalysisProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("What")
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
            <div className="sticky top-0 z-10 bg-white space-y-6">
              <div className="py-2 space-y-4">
                <Button 
                  variant="ghost" 
                  onClick={onBack}
                  className="hover:bg-[#E9EEEE] hover:text-[#00857C]"
                >
                  <ChevronLeft className="h-4 w-3 mr-1" />
                  Back
                </Button>

                <div className="flex justify-between items-center">
                  <div className="flex flex-col gap-3">
                    <h1 className="text-4xl font-bold text-gray-900">{topic.name}</h1>
                    <p className="text-sm text-gray-500">
                      Search Period: <span className="bg-gray-100 rounded-full px-2 py-1 italic">2024-01-01</span> to{" "}
                      <span className="bg-gray-100 rounded-full px-2 py-1 italic">2024-12-31</span>
                    </p>
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

              <div className="grid grid-cols-5 gap-4">
                <AnalyticsCard
                  title="People"
                  value="20,456"
                  icon={Users2}
                  className="h-[90px]"
                />
                <AnalyticsCard
                  title="Entities"
                  value="21"
                  icon={Building2}
                  className="h-[90px]"
                />
                <AnalyticsCard
                  title="URLs"
                  value="725"
                  icon={Link}
                  className="h-[90px]"
                />
                <AnalyticsCard
                  title="WhatsApp"
                  value="220"
                  icon={MessageCircle}
                  className="h-[90px]"
                />
                <AnalyticsCard
                  title="WeChat"
                  value="101"
                  icon={MessageCircle}
                  className="h-[90px]"
                />
              </div>
            </div>

            <Tabs defaultValue="What" className="w-full [&>*]:rounded-none">
              <div className="sticky top-[240px] z-10 bg-white">
                <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 bg-[#F3F6F7] rounded-none p-0 h-full">
                  {tabItems.map((tab) => (
                    <TabsTrigger 
                      key={tab} 
                      value={tab} 
                      onClick={() => setActiveTab(tab)}
                      className="data-[state=active]:bg-[#00857C] data-[state=active]:text-white data-[state=active]:font-bold rounded-none shadow-none data-[state=active]:shadow-none px-0 py-2 h-full"
                    >
                      {tab}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              <div className="border border-[#00857C] p-6 bg-[#F3F6F7]">
                <TabsContent value="Inspect">
                  <InspectTabComponent/>
                </TabsContent>
                <TabsContent value="What">
                  <WhatTab />
                </TabsContent>
                <TabsContent value="Who">
                  <WhoTab />
                </TabsContent>
                <TabsContent value="Where">
                  <WhereTabComponent />
                </TabsContent>
                <TabsContent value="When">
                  <WhenTab />
                </TabsContent>
                <TabsContent value="How">
                  <HowTab />
                </TabsContent>
                <TabsContent value="Raw Data">
                  <Card>
                    <div className="p-4"></div>
                    <CardContent>
                      <RawDataComponent />
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
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