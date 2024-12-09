'use client'

import { useMemo, useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Download, Plus } from 'lucide-react'
import dataPost from './data-post.json'
import { PostMonitoringCardsComponent } from "./post-monitoring-cards"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Bar, BarChart, ResponsiveContainer, YAxis, Cell } from "recharts"
import { EntityTreemap } from './chart/entity-treemap'
import { TopNERTimeChart } from './chart/top-ner-time-chart'
import { EntityMentionsChart } from './chart/entity-mentions-chart'
import { TopEntitiesPerformanceChart } from './chart/top-entities-performance-chart'

type Post = {
  id: string
  group: string
  groupType: string
  URL: string
  channel: string
  summary: string
  fullContent: string
  postDate: string
  engagementIndex: number
  author: string
  mentions: number
  hashtag: string
  ner: string[]
  sentiment: string
  linkExtracted: string
  classifiedContent: string[]
  country: string
  language: string
}

function TableOverlay({ 
  onClose, 
  selectedRow,
  selectedEntity 
}: { 
  onClose: () => void, 
  selectedRow?: Post | null,
  selectedEntity?: string | null
}) {
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(onClose, 300)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ease-in m-0"
      onClick={handleClose}
      style={{ 
        animation: `${isClosing ? 'fadeOut' : 'fadeIn'} 250ms ease-in`,
        top: 0,
        margin: 0
      }}
    >
      <div 
        className="fixed right-0 top-0 h-full bg-white overflow-auto"
        style={{ 
          width: '78%',
          minWidth: '830px',
          animation: `${isClosing ? 'slideOut' : 'slideIn'} 300ms cubic-bezier(0.72, 0, 0.13, 1)`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <PostMonitoringCardsComponent 
          onClose={handleClose} 
          selectedEntity={selectedEntity}
        />
      </div>
    </div>
  )
}

// Update the dummy entities data with specific colors
const dummyEntitiesData = [
  { entity: "我要做股神", color: "#FF6B6B" },
  { entity: "CoinUnited", color: "#4ECDC4" },
  { entity: "JPEX家庭", color: "#45B7D1" },
  { entity: "比特幣", color: "#96CEB4" },
  { entity: "區塊鏈", color: "#FFEEAD" },
  { entity: "加密貨幣", color: "#D4A5A5" },
  { entity: "NFT", color: "#9B5DE5" },
  { entity: "Web3", color: "#00BBF9" },
  { entity: "元宇宙", color: "#F15BB5" },
  { entity: "DeFi", color: "#FEE440" },
]

export function InspectTabComponent() {
  const [currentURLPage, setCurrentURLPage] = useState(1)
  const [currentEntityPage, setCurrentEntityPage] = useState(1)
  const itemsPerPage = 10
  const [showOverlay, setShowOverlay] = useState(false)
  const [selectedRow, setSelectedRow] = useState<Post | null>(null)
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState("30d")

  // Define the data array within the component
  const data = dataPost.posts

  const totalEntities = data.length
  const totalURLs = 725
  const totalGroups = 321

  const topURLs = useMemo(() => {
    return [...data]
      .sort((a, b) => b.engagementIndex - a.engagementIndex)
  }, [])

  const topEntities = useMemo(() => {
    const entityData = data.flatMap(post => 
      post.ner.map(entity => ({
        entity,
        engagementIndex: post.engagementIndex,
        channel: post.channel
      }))
    ).reduce((acc, { entity, engagementIndex, channel }) => {
      if (!acc[entity]) {
        acc[entity] = { entity, count: 0, engagementIndex: 0, channels: new Set() };
      }
      acc[entity].count++;
      acc[entity].engagementIndex += engagementIndex;
      acc[entity].channels.add(channel);
      return acc;
    }, {} as Record<string, { entity: string, count: number, engagementIndex: number, channels: Set<string> }>);

    return Object.values(entityData)
      .sort((a, b) => b.count - a.count)
      .map(({ entity, count, engagementIndex, channels }) => ({
        entity,
        count,
        engagementIndex: Math.round(engagementIndex),
        channel: Array.from(channels).join(', '),
        randomMentions: Math.floor(Math.random() * (100 - 30 + 1) + 30) // Random number between 30-100
      }));
  }, [])

  const paginatedURLs = topURLs.slice(
    (currentURLPage - 1) * itemsPerPage,
    currentURLPage * itemsPerPage
  )

  const paginatedEntities = topEntities.slice(
    (currentEntityPage - 1) * itemsPerPage,
    currentEntityPage * itemsPerPage
  )

  const handleExport = (data: any[], filename: string) => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + data.map(row => Object.values(row).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  useEffect(() => {
    const styleTag = document.createElement('style')
    styleTag.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
      @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
      }
      @keyframes slideOut {
        from { transform: translateX(0); }
        to { transform: translateX(100%); }
      }
    `
    document.head.appendChild(styleTag)
    return () => styleTag.remove()
  }, [])

  const top10Entities = useMemo(() => {
    return topEntities.slice(0, 10).map(entity => entity.entity)
  }, [topEntities])

  // Updated dummy chart data generation with more variations
  const dummyChartData = useMemo(() => {
    const dates = Array.from({ length: 90 }).map((_, i) => {
      const date = new Date('2023-12-31')
      date.setDate(date.getDate() - (89 - i))
      return date.toISOString().split('T')[0]
    })

    const filteredDates = dates.filter(date => {
      const dateObj = new Date(date)
      const referenceDate = new Date('2023-12-31')
      const daysToSubtract = timeRange === "30d" ? 30 : timeRange === "7d" ? 7 : 90
      const startDate = new Date(referenceDate)
      startDate.setDate(startDate.getDate() - daysToSubtract)
      return dateObj >= startDate
    })

    return filteredDates.map(date => {
      const dataPoint: any = { date }
      dummyEntitiesData.forEach(({ entity }) => {
        const dateObj = new Date(date)
        const dayOfMonth = dateObj.getDate()
        
        // Base values with more variation
        const baseValue = {
          "股市達人阿強": 600 + Math.sin(dayOfMonth / 3) * 150,
          "CoinUnited": 1800 + (dayOfMonth === 17 ? 1000 : 0), // Spike on day 15
          "JPEX家庭": 1500 + (dayOfMonth === 28 ? 1200 : 0), // Spike on day 7
          "比特幣": 1000 + Math.cos(dayOfMonth / 4) * 200,
          "區塊鏈": 750 + (dayOfMonth % 7 === 0 ? 700 : 0), // Periodic spikes
          "加密貨幣": 700 + (dayOfMonth < 10 ? -800 : 0), // Low start
          "NFT": 650 + (dayOfMonth > 25 ? -500 : 0), // Low end
          "Web3": 260 + Math.sin(dayOfMonth / 2) * 250,
          "元宇宙": 350 + (dayOfMonth % 5 === 0 ? 200 : -100), // Alternating pattern
          "DeFi": 150 + Math.random() * 200, // High volatility
        }[entity] || 0;

        // Add random fluctuation with more variation
        const fluctuation = Math.sin(dateObj.getTime() / 8.64e7) * 200
        const random = Math.random() * 200 // Increased randomness
        dataPoint[entity] = Math.max(0, Math.round(baseValue + fluctuation + random))
      })
      return dataPoint
    })
  }, [timeRange])

  // Create chart config for dummy entities
  const dummyChartConfig = useMemo(() => {
    return Object.fromEntries(
      dummyEntitiesData.map(({ entity, color }) => [
        entity,
        {
          label: entity,
          color: color,
        }
      ])
    ) satisfies ChartConfig
  }, [])

  const last7DaysBarData = useMemo(() => {
    const entities = topEntities.slice(0, 10)
    return entities.map(entity => {
      const colorMatch = dummyEntitiesData.find(e => e.entity === entity.entity)
      return {
        name: entity.entity,
        value: entity.count,
        // Use the matched color or a default color if no match is found
        color: colorMatch?.color || "#00857C"
      }
    })
  }, [topEntities])

  return (
    <div className="space-y-6">

      <EntityMentionsChart 
        data={topEntities}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Entity Distribution Treemap</CardTitle>
          <div className="flex flex-row items-end">
          <Button
              variant="outline"
              size="sm"
              onClick={() => console.log('Edit NER labels clicked')}
            >
              Edit NER labels
            </Button>
            <Select>
              <SelectTrigger className="w-[150px] rounded-lg">
                <SelectValue placeholder="NER Type" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="Entities">Entities</SelectItem>
                <SelectItem value="Non-entities">Non-entities</SelectItem>
              </SelectContent>
            </Select>
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-6 w-4 mr-2" />
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
        <CardContent>
          <EntityTreemap data={topEntities.slice(0, 20)} />
        </CardContent>
      </Card>

      <TopNERTimeChart data={data} />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Entities by mentions</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="default"
              size="sm"
              className="bg-[#00857C] hover:bg-[#00857C]/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add NER
            </Button>
            <Select>
              <SelectTrigger className="w-[100px] rounded-lg">
                <SelectValue placeholder="Top 10" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="200">200</SelectItem>
                <SelectItem value="300">300</SelectItem>
                <SelectItem value="400">400</SelectItem>
                <SelectItem value="500">500</SelectItem>
                <SelectItem value="1000">1000</SelectItem>
                <SelectItem value="1500">1500</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport(topEntities, 'entities_by_mentions')}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-[#E9EEEE]">
              <TableRow>
                <TableHead className="text-[#213938]">Entity</TableHead>
                <TableHead className="text-[#213938]">Mentions</TableHead>
                <TableHead className="text-[#213938]">Random Mentions</TableHead>
                <TableHead className="text-[#213938]">Engagement Index</TableHead>
                <TableHead className="text-[#213938]">Avg. Engagement</TableHead>
                <TableHead className="text-[#213938]">Channels</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedEntities.map((entity) => (
                <TableRow 
                  key={entity.entity}
                  onClick={() => {
                    setSelectedEntity(entity.entity)
                    setShowOverlay(true)
                  }}
                  className="cursor-pointer"
                >
                  <TableCell className="font-medium">{entity.entity}</TableCell>
                  <TableCell>{entity.count}</TableCell>
                  <TableCell>{entity.randomMentions}</TableCell>
                  <TableCell>{entity.engagementIndex}</TableCell>
                  <TableCell>{Math.round(entity.engagementIndex / entity.count)}</TableCell>
                  <TableCell>{entity.channel}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-end items-center space-x-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentEntityPage(prev => Math.max(prev - 1, 1))}
              disabled={currentEntityPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span>Page {currentEntityPage}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentEntityPage(prev => prev + 1)}
              disabled={currentEntityPage * itemsPerPage >= topEntities.length}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      

      {showOverlay && (
        <TableOverlay 
          onClose={() => {
            setShowOverlay(false)
            setSelectedRow(null)
            setSelectedEntity(null)
          }}
          selectedRow={selectedRow}
          selectedEntity={selectedEntity}
        />
      )}
    </div>
  )
}